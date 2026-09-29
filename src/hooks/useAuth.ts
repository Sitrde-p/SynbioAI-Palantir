/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase';
import { UserAccount, isUserAdmin } from '../types';
import type { Session, User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<UserAccount | null>(() => {
    try {
      const savedUser = localStorage.getItem('synbio_current_user');
      if (savedUser) {
        return JSON.parse(savedUser);
      }
    } catch (e) {
      console.error('Failed to load cached user', e);
    }
    return null;
  });
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Helper to fetch and normalize user profile from Supabase 'profiles' table
  const fetchUserProfile = useCallback(async (authUser: User): Promise<UserAccount> => {
    const userId = authUser.id;
    const email = authUser.email || '';
    const userMetadata = authUser.user_metadata || {};

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.warn('Notice querying profiles table:', error.message);
      }

      const role = profile?.role || userMetadata.role || 'creator';
      const normalizedRole = String(role).toLowerCase() === 'admin' ? 'admin' : 'creator';
      const isAdm = normalizedRole === 'admin';

      const displayName =
        profile?.display_name ||
        profile?.name ||
        profile?.full_name ||
        userMetadata.display_name ||
        userMetadata.name ||
        userMetadata.full_name ||
        (isAdm ? 'System Admin' : email.split('@')[0]);

      const account: UserAccount = {
        id: userId,
        name: displayName,
        email: email,
        role: normalizedRole,
        createdAt: profile?.created_at || authUser.created_at || new Date().toISOString(),
        bio: profile?.bio ?? '',
        affiliation: profile?.affiliation ?? (isAdm ? 'Admin' : ''),
        identityTag: profile?.identity_tag || (isAdm ? 'System Administrator' : 'Creator'),
        notifications: {
          emailUpdates: true,
          labMatches: true,
          collaborationRequests: true,
          weeklyDigest: false,
        },
      };

      return account;
    } catch (err) {
      console.error('Error in fetchUserProfile:', err);
      return {
        id: userId,
        name: userMetadata.display_name || userMetadata.name || email.split('@')[0],
        email: email,
        role: 'creator',
        createdAt: authUser.created_at || new Date().toISOString(),
        bio: '',
        affiliation: '',
        identityTag: 'Creator',
      };
    }
  }, []);

  // Listen to Supabase auth state changes
  useEffect(() => {
    let isMounted = true;

    // 1. Check current session immediately
    supabase.auth.getSession().then(async ({ data: { session: initialSession }, error }) => {
      if (!isMounted) return;
      if (error) {
        console.warn('Error fetching initial session:', error.message);
      }

      setSession(initialSession);

      if (initialSession?.user) {
        const account = await fetchUserProfile(initialSession.user);
        if (isMounted) {
          setUser(account);
          try {
            localStorage.setItem('synbio_current_user', JSON.stringify(account));
          } catch (e) {}
        }
      } else {
        if (isMounted) {
          // Keep cached user if offline, or sync with auth
          setLoading(false);
        }
      }
      if (isMounted) {
        setLoading(false);
      }
    });

    // 2. Subscribe to auth state updates
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (!isMounted) return;

      setSession(currentSession);

      if (currentSession?.user) {
        const account = await fetchUserProfile(currentSession.user);
        if (isMounted) {
          setUser(account);
          try {
            localStorage.setItem('synbio_current_user', JSON.stringify(account));
          } catch (e) {}
          setLoading(false);
        }
      } else {
        if (isMounted) {
          setUser(null);
          try {
            localStorage.removeItem('synbio_current_user');
          } catch (e) {}
          setLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchUserProfile]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Error signing out from Supabase:', err);
    }
    setUser(null);
    setSession(null);
    try {
      localStorage.removeItem('synbio_current_user');
    } catch (e) {}
  };

  const refreshUser = async () => {
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    if (currentSession?.user) {
      const account = await fetchUserProfile(currentSession.user);
      setUser(account);
      try {
        localStorage.setItem('synbio_current_user', JSON.stringify(account));
      } catch (e) {}
    }
  };

  const isAdmin = isUserAdmin(user);

  return {
    user,
    setUser,
    session,
    loading,
    isAdmin,
    signOut,
    refreshUser,
  };
}
