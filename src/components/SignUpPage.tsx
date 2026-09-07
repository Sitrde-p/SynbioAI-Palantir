/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Eye, EyeOff, X } from 'lucide-react';
import { UserAccount } from '../types';

interface SignUpPageProps {
  onSignUpSuccess: (user: UserAccount) => void;
  onGoToSignIn: () => void;
  onBackToHome: () => void;
}

export default function SignUpPage({
  onSignUpSuccess,
  onGoToSignIn,
  onBackToHome,
}: SignUpPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Save new user to localStorage
      let users: (UserAccount & { password?: string })[] = [];
      try {
        const storedUsers = localStorage.getItem('synbio_registered_users');
        if (storedUsers) {
          users = JSON.parse(storedUsers);
        }
      } catch (err) {
        console.error(err);
      }

      const existingUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (existingUser) {
        setError('An account with this email already exists. Please sign in instead.');
        setIsLoading(false);
        return;
      }

      const newUser: UserAccount = {
        id: `user_${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        createdAt: new Date().toISOString(),
        bio: 'Synthetic biology researcher exploring computational design and bio-manufacturing interfaces.',
        affiliation: 'Independent Research Fellow',
        identityTag: 'Principal Investigator',
        notifications: {
          emailUpdates: true,
          labMatches: true,
          collaborationRequests: true,
          weeklyDigest: false,
        },
      };

      const updatedUsers = [...users, { ...newUser, password }];
      localStorage.setItem('synbio_registered_users', JSON.stringify(updatedUsers));
      localStorage.setItem('synbio_current_user', JSON.stringify(newUser));

      setIsLoading(false);
      onSignUpSuccess(newUser);
    }, 400);
  };

  const handleGoogleSignUp = () => {
    setIsLoading(true);
    setTimeout(() => {
      const googleUser: UserAccount = {
        id: 'user_google_calista',
        name: name.trim() || 'Calista Peng',
        email: email.trim() || 'calistapeng7@gmail.com',
        createdAt: new Date().toISOString(),
      };

      try {
        const storedUsers = localStorage.getItem('synbio_registered_users');
        const users = storedUsers ? JSON.parse(storedUsers) : [];
        if (!users.some((u: any) => u.email === googleUser.email)) {
          users.push(googleUser);
          localStorage.setItem('synbio_registered_users', JSON.stringify(users));
        }
      } catch (err) {
        console.error(err);
      }

      localStorage.setItem('synbio_current_user', JSON.stringify(googleUser));
      setIsLoading(false);
      onSignUpSuccess(googleUser);
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

        {/* Header matching exact prompt request */}
        <h1 className="text-4xl md:text-5xl font-serif text-white tracking-tight mb-3 text-center font-normal">
          Create an account
        </h1>
        <p className="text-neutral-400 text-sm text-center max-w-sm mb-8">
          Sign up to get started
        </p>

        {error && (
          <div className="w-full mb-4 px-4 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-3 rounded-xl bg-[#18181b] border border-white/10 text-white text-sm outline-none focus:border-white/30 transition-all placeholder:text-neutral-600"
            />
          </div>

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
            <label className="text-xs font-semibold text-neutral-300">Password</label>
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

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-11 rounded-xl bg-[#18181b] border border-white/10 text-white text-sm outline-none focus:border-white/30 transition-all placeholder:text-neutral-600 tracking-wider"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors p-1"
                aria-label="Toggle password visibility"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-[#c83a1d] hover:bg-[#b53318] text-white rounded-xl font-semibold text-sm transition-all shadow-lg active:scale-98 disabled:opacity-50 mt-2"
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>

          <button
            type="button"
            onClick={handleGoogleSignUp}
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
            Sign up with Google
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-neutral-400">
          Already have an account?{' '}
          <button
            onClick={onGoToSignIn}
            className="text-[#d64024] hover:underline font-semibold ml-1"
          >
            Sign in
          </button>
        </div>
      </div>

      <div className="w-full text-center text-xs text-neutral-600 py-4">
        © 2026 SynbioAI Palantir. All rights reserved.
      </div>
    </div>
  );
}
