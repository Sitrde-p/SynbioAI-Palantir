/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Microscope, Users, Sparkles, UserCircle, Search, Shield } from 'lucide-react';
import { Category, UserAccount, isUserAdmin } from '../types';
import SearchModal from './SearchModal';

interface NavigationProps {
  activeCategory: Category;
  setActiveCategory: (cat: Category) => void;
  currentUser: UserAccount | null;
  onPost: () => void;
  onSignIn: () => void;
  onSignUp: () => void;
  onDashboard: () => void;
  onSignOut: () => void;
  onAdmin?: () => void;
  onLanding?: () => void;
  isDashboardActive?: boolean;
  isAdminActive?: boolean;
  isLandingActive?: boolean;
}

const navItems: { label: string; value: Category; icon: any }[] = [
  { label: 'Inspiration', value: 'Inspiration Square', icon: Sparkles },
  { label: 'Teams', value: 'Synthetic Biology', icon: Microscope },
  { label: 'Community', value: 'AI Community', icon: Users },
  { label: 'About', value: 'Team', icon: UserCircle },
];

export default function Navigation({
  activeCategory,
  setActiveCategory,
  currentUser,
  onPost,
  onSignIn,
  onSignUp,
  onDashboard,
  onSignOut,
  onAdmin,
  onLanding,
  isDashboardActive,
  isAdminActive,
  isLandingActive,
}: NavigationProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const isAdmin = isUserAdmin(currentUser);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Vertical gradient background: semi-transparent black at top fading to completely transparent at bottom */}
      <div className="absolute inset-x-0 top-0 h-28 sm:h-32 bg-gradient-to-b from-black/85 via-black/40 to-transparent pointer-events-none" />

      {/* Full width container with sleek reduced vertical height */}
      <div className="relative z-10 w-full px-6 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
        {/* Logo positioned on the far left - navigates to Landing page */}
        <button
          onClick={() => {
            if (onLanding) {
              onLanding();
            } else {
              setActiveCategory('Inspiration Square');
            }
          }}
          className="flex items-center gap-3 shrink-0 text-left cursor-pointer group"
          title="Go to Landing Page"
        >
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black border border-white/20 shadow-sm group-hover:scale-105 transition-transform">
            <div className="w-3.5 h-3.5 border-2 border-black rounded-full" />
          </div>
          <span className="text-base font-bold tracking-tight text-white">
            SynbioAI <span className="font-normal text-neutral-500">Palantir</span>
          </span>
        </button>

        {/* Right side cluster: Nav Links + Search + Auth Buttons */}
        <div className="flex items-center gap-5 sm:gap-7 shrink-0">
          {/* Navigation group moved to the right, placed directly left of the search icon */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navItems.map((item) => {
              const isActive = !isLandingActive && !isDashboardActive && !isAdminActive && activeCategory === item.value;
              return (
                <button
                  key={item.value}
                  onClick={() => setActiveCategory(item.value)}
                  className={`text-sm font-bold transition-all duration-300 relative py-2 ${
                    isActive
                      ? 'text-white'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            {/* Admin link - ONLY visible to administrator accounts */}
            {isAdmin && onAdmin && (
              <button
                onClick={onAdmin}
                className={`text-sm font-bold transition-all duration-300 relative py-2 flex items-center gap-1.5 cursor-pointer ${
                  isAdminActive
                    ? 'text-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Shield size={14} className={isAdminActive ? 'text-amber-400' : 'text-neutral-400'} />
                <span>Admin</span>
              </button>
            )}
          </div>

          {/* Search button */}
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="text-neutral-400 hover:text-white transition-colors p-1.5"
            aria-label="Search"
          >
            <Search size={20} />
          </button>
          
          {/* Auth Action Buttons matching Figure 4 & Figure 5 */}
          <div className="flex items-center gap-2.5">
            {currentUser ? (
              <>
                {/* Dashboard button: Black text, white/light gray background (Figure 4) */}
                <button
                  onClick={onDashboard}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all shadow-sm active:scale-95 ${
                    isDashboardActive
                      ? 'bg-white text-black ring-2 ring-white/50'
                      : 'bg-[#dcdcdc] hover:bg-white text-black'
                  }`}
                >
                  Dashboard
                </button>

                {/* Sign out button: White text, dark gray/black background (Figure 4) */}
                <button
                  onClick={onSignOut}
                  className="px-4 py-2 bg-[#1c1c1f] hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl border border-white/10 transition-all shadow-sm active:scale-95"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                {/* Sign in button: White text, dark gray/black background (Figure 5) */}
                <button
                  onClick={onSignIn}
                  className="px-4 py-2 bg-[#1c1c1f] hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl border border-white/10 transition-all shadow-sm active:scale-95"
                >
                  Sign in
                </button>

                {/* Sign up button: Black text, white/light gray background (Figure 5) */}
                <button
                  onClick={onSignUp}
                  className="px-4 py-2 bg-[#dcdcdc] hover:bg-white text-black text-xs font-semibold rounded-xl transition-all shadow-sm active:scale-95"
                >
                  Sign up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </nav>
  );
}
