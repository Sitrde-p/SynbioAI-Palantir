/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Eye, EyeOff, X } from 'lucide-react';
import { UserAccount } from '../types';

interface SignInPageProps {
  onSignInSuccess: (user: UserAccount) => void;
  onGoToSignUp: () => void;
  onBackToHome: () => void;
}

export default function SignInPage({
  onSignInSuccess,
  onGoToSignUp,
  onBackToHome,
}: SignInPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Check registered users in localStorage
      let users: (UserAccount & { password?: string })[] = [];
      try {
        const storedUsers = localStorage.getItem('synbio_registered_users');
        if (storedUsers) {
          users = JSON.parse(storedUsers);
        }
      } catch (err) {
        console.error(err);
      }

      // If user storage is totally fresh, pre-seed primary demo and admin accounts
      if (users.length === 0) {
        const defaultUser = {
          id: 'user_calista_default',
          name: 'Calista Peng',
          email: 'calistapeng7@gmail.com',
          createdAt: new Date().toISOString(),
          password: 'password123',
          role: 'creator',
        };
        const adminUser = {
          id: 'user_admin_default',
          name: 'System Admin',
          email: 'admin@synbio.org',
          createdAt: new Date().toISOString(),
          password: 'admin123',
          role: 'admin',
        };
        users = [defaultUser, adminUser];
        localStorage.setItem('synbio_registered_users', JSON.stringify(users));
      } else {
        // Ensure admin user exists in list
        const hasAdmin = users.some((u) => u.email.toLowerCase() === 'admin@synbio.org');
        if (!hasAdmin) {
          users.push({
            id: 'user_admin_default',
            name: 'System Admin',
            email: 'admin@synbio.org',
            createdAt: new Date().toISOString(),
            password: 'admin123',
            role: 'admin',
          });
          localStorage.setItem('synbio_registered_users', JSON.stringify(users));
        }
      }

      const existingUser = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());

      // 1. Unregistered email: deny sign in, prompt user, and redirect to Sign Up
      if (!existingUser) {
        setIsLoading(false);
        setError('This email has not been registered yet. Redirecting you to sign up...');
        setTimeout(() => {
          onGoToSignUp();
        }, 1200);
        return;
      }

      // 2. Incorrect password check: strictly fail if password does not match
      if (existingUser.password && existingUser.password !== password) {
        setIsLoading(false);
        setError('Incorrect password. Please verify your password and try again.');
        return;
      }

      // Log in as existing user
      const loggedUser: UserAccount = {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        createdAt: existingUser.createdAt,
        bio: existingUser.bio,
        affiliation: existingUser.affiliation,
        identityTag: existingUser.identityTag,
        notifications: existingUser.notifications,
      };
      localStorage.setItem('synbio_current_user', JSON.stringify(loggedUser));
      setIsLoading(false);
      onSignInSuccess(loggedUser);
    }, 400);
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      // Check if Google account is in registered users
      let users: (UserAccount & { password?: string })[] = [];
      try {
        const storedUsers = localStorage.getItem('synbio_registered_users');
        if (storedUsers) {
          users = JSON.parse(storedUsers);
        }
      } catch (err) {
        console.error(err);
      }

      const googleEmail = 'calistapeng7@gmail.com';
      const existingUser = users.find((u) => u.email.toLowerCase() === googleEmail.toLowerCase());

      if (!existingUser) {
        setIsLoading(false);
        setError('This Google account is not registered yet. Redirecting to sign up...');
        setTimeout(() => {
          onGoToSignUp();
        }, 1200);
        return;
      }

      const googleUser: UserAccount = {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        createdAt: existingUser.createdAt,
        bio: existingUser.bio,
        affiliation: existingUser.affiliation,
        identityTag: existingUser.identityTag,
        notifications: existingUser.notifications,
      };

      localStorage.setItem('synbio_current_user', JSON.stringify(googleUser));
      setIsLoading(false);
      onSignInSuccess(googleUser);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white flex flex-col justify-between py-12 px-4 sm:px-6 relative">
      {/* Top-right close button: unhovered is bare grey X (Fig 1), hovered is dark rounded square with white X (Fig 2) */}
      <button
        onClick={onBackToHome}
        aria-label="Close"
        className="absolute top-6 right-6 sm:top-8 sm:right-8 w-9 h-9 rounded-xl bg-transparent hover:bg-[#262626] flex items-center justify-center text-neutral-400 hover:text-white transition-all cursor-pointer z-30 group"
      >
        <X size={18} strokeWidth={2.2} />
      </button>

      {/* Main card container */}
      <div className="w-full max-w-md mx-auto flex flex-col items-center my-auto">
        {/* Emblem Logo matching Hero bottom email section & Figure 1 */}
        <div
          onClick={onBackToHome}
          className="w-14 h-14 bg-neutral-900 rounded-2xl flex items-center justify-center text-white border border-white/15 shadow-md mb-6 cursor-pointer hover:scale-105 transition-transform"
        >
          <div className="w-5 h-5 border-[2.5px] border-white rounded-full" />
        </div>

        {/* Header */}
        <h1 className="text-4xl md:text-5xl font-serif text-white tracking-tight mb-3 text-center font-normal">
          Welcome back
        </h1>
        <p className="text-neutral-400 text-sm text-center max-w-sm mb-8">
          Sign in to your account
        </p>

        {error && (
          <div className="w-full mb-4 px-4 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl bg-[#18181b] border border-white/10 text-white text-sm outline-none focus:border-white/30 transition-all placeholder:text-neutral-600"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-neutral-300">
                Password
              </label>
              <button
                type="button"
                onClick={() => alert('Password reset instructions sent to your email.')}
                className="text-xs text-neutral-400 hover:text-white transition-colors"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-11 rounded-xl bg-[#18181b] border border-white/10 text-white text-sm outline-none focus:border-white/30 transition-all placeholder:text-neutral-600 tracking-wider"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors p-1"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2.5 pt-1">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded bg-[#18181b] border-white/20 text-[#c83a1d] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#c83a1d]"
            />
            <label htmlFor="remember" className="text-xs text-neutral-300 select-none cursor-pointer">
              Remember me for 30 days
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-[#c83a1d] hover:bg-[#b53318] text-white rounded-xl font-semibold text-sm transition-all shadow-lg active:scale-98 disabled:opacity-50 mt-2"
          >
            {isLoading ? 'Signing in...' : 'Sign in with email'}
          </button>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full py-3.5 bg-[#18181b] hover:bg-[#222226] text-white rounded-xl font-medium text-sm border border-white/10 transition-all flex items-center justify-center gap-2.5 active:scale-98"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2s.7 5.5 1.9 7.9l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z"
              />
            </svg>
            Sign in with Google
          </button>

          {/* Quick Demo Access Helpers */}
          <div className="pt-2 border-t border-white/5 flex flex-col items-center gap-2">
            <span className="text-[11px] text-neutral-500 uppercase tracking-wider font-semibold">
              Demo Credentials
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@synbio.org');
                  setPassword('admin123');
                }}
                className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 rounded-lg text-[11px] font-medium transition-all cursor-pointer"
                title="Fill admin account"
              >
                Admin (admin@synbio.org)
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('calistapeng7@gmail.com');
                  setPassword('password123');
                }}
                className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10 rounded-lg text-[11px] font-medium transition-all cursor-pointer"
                title="Fill user account"
              >
                User (calistapeng7@gmail.com)
              </button>
            </div>
          </div>
        </form>

        <div className="mt-8 text-center text-xs text-neutral-400">
          Don't have an account?{' '}
          <button
            onClick={onGoToSignUp}
            className="text-[#d64024] hover:underline font-semibold ml-1"
          >
            Sign up
          </button>
        </div>
      </div>

      <div className="w-full text-center text-xs text-neutral-600 py-4">
        © 2026 SynbioAI Palantir. All rights reserved.
      </div>
    </div>
  );
}
