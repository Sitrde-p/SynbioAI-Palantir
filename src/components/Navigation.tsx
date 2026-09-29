/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Microscope, Users, Sparkles, UserCircle, Search, Shield } from 'lucide-react';
import { Category, UserAccount, isUserAdmin, ImaginationNote } from '../types';
import { ResearchLab } from '../data/mockLabs';
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
  onSelectNote?: (note: ImaginationNote) => void;
  onSelectLab?: (lab: ResearchLab) => void;
  onSelectDiscussion?: (discussionTitle: string) => void;
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
  onSelectNote,
  onSelectLab,
  onSelectDiscussion,
  isDashboardActive,
  isAdminActive,
  isLandingActive,
}: NavigationProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const isAdmin = isUserAdmin(currentUser);

  // Global Keyboard Shortcuts: ⌘K or / to open Search Overlay
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Check if user is typing in an input / textarea / editable area
      const activeElement = document.activeElement;
      const isInput =
        activeElement &&
        (activeElement.tagName === 'INPUT' ||
          activeElement.tagName === 'TEXTAREA' ||
          (activeElement as HTMLElement).isContentEditable);

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.key === '/' && !isInput) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Vertical gradient background */}
      <div className="absolute inset-x-0 top-0 h-28 sm:h-32 bg-gradient-to-b from-black/85 via-black/40 to-transparent pointer-events-none" />

      {/* Full width container */}
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
        <div className="flex items-center gap-4 sm:gap-6 shrink-0">
          {/* Navigation group */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navItems.map((item) => {
              const isActive = !isLandingActive && !isDashboardActive && !isAdminActive && activeCategory === item.value;
              return (
                <button
                  key={item.value}
                  onClick={() => setActiveCategory(item.value)}
                  className={`text-sm font-bold transition-all duration-300 relative py-2 cursor-pointer ${
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

          {/* Search button (Icon only) */}
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="text-neutral-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-xl cursor-pointer flex items-center justify-center"
            aria-label="Search"
            title="Search"
          >
            <Search size={18} />
          </button>
          
          {/* Auth Action Buttons */}
          <div className="flex items-center gap-2.5">
            {currentUser ? (
              <>
                {/* Dashboard button */}
                <button
                  onClick={onDashboard}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer ${
                    isDashboardActive
                      ? 'bg-white text-black ring-2 ring-white/50'
                      : 'bg-[#dcdcdc] hover:bg-white text-black'
                  }`}
                >
                  Dashboard
                </button>

                {/* Sign out button */}
                <button
                  onClick={onSignOut}
                  className="px-4 py-2 bg-[#1c1c1f] hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl border border-white/10 transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                {/* Sign in button */}
                <button
                  onClick={onSignIn}
                  className="px-4 py-2 bg-[#1c1c1f] hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl border border-white/10 transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  Sign in
                </button>

                {/* Sign up button */}
                <button
                  onClick={onSignUp}
                  className="px-4 py-2 bg-[#dcdcdc] hover:bg-white text-black text-xs font-semibold rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  Sign up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Search Overlay */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectIdea={(note) => {
          if (onSelectNote) {
            onSelectNote(note);
          }
        }}
        onSelectLab={(lab) => {
          if (onSelectLab) {
            onSelectLab(lab);
          }
        }}
        onSelectDiscussion={(title) => {
          if (onSelectDiscussion) {
            onSelectDiscussion(title);
          } else {
            setActiveCategory('AI Community');
          }
        }}
      />
    </nav>
  );
}
