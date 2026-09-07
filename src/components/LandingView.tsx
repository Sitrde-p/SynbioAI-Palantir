/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
} from 'lucide-react';
import { ImaginationNote } from '../types';
import ImaginationCard from './ImaginationCard';
import HowItWorksSection from './HowItWorksSection';
import NewsletterSection from './NewsletterSection';

interface LandingViewProps {
  notes: ImaginationNote[];
  onExploreInspirations: () => void;
  onShareYourIdea: () => void;
  onCollaborate: (note: ImaginationNote) => void;
  onSelectNote: (note: ImaginationNote) => void;
  onToggleLike: (noteId: string) => void;
  onToggleSave?: (noteId: string) => void;
  onExploreTeams?: () => void;
  onExploreCommunity?: () => void;
  onToast?: (msg: string) => void;
}

export default function LandingView({
  notes,
  onExploreInspirations,
  onShareYourIdea,
  onCollaborate,
  onSelectNote,
  onToggleLike,
  onToggleSave,
  onExploreTeams,
  onExploreCommunity,
  onToast,
}: LandingViewProps) {
  // Curate 6 featured inspiration cards
  const featuredNotes = notes.slice(0, 6);

  return (
    <div className="w-full bg-black text-white selection:bg-white selection:text-black">
      {/* 1. Hero Section */}
      <section className="relative h-screen min-h-[640px] w-full px-4 text-center overflow-hidden bg-black flex items-center justify-center">
        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260818_072341_50851634-bbc3-4c33-9acc-7647d4db44aa.mp4"
        />

        {/* Vertical gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/[0.45] via-black/[0.25] to-black pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="relative z-10 max-w-5xl mx-auto"
        >
          {/* Slogan (Slightly smaller title) */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif text-white mb-6 leading-[1.1] selection:bg-white selection:text-black italic drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
            From Idea to Impact
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto mb-10 sm:mb-12 leading-relaxed font-normal drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
            Where bold ideas meet the teams to make them real.
          </p>

          {/* Two Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onExploreInspirations}
              className="w-full sm:w-auto px-9 py-4 bg-white text-black rounded-full font-bold hover:bg-neutral-200 transition-all shadow-2xl shadow-white/10 flex items-center justify-center gap-2.5 group cursor-pointer text-sm"
            >
              <span>Explore Inspirations</span>
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
            <button
              onClick={onShareYourIdea}
              className="w-full sm:w-auto px-9 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md rounded-full font-bold transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <span>Share Your Idea</span>
            </button>
          </div>
        </motion.div>
      </section>

      {/* 2. How It Works Section (Sequential From Head to Tail & Real Platform Content) */}
      <HowItWorksSection
        onExploreInspirations={onExploreInspirations}
        onShareYourIdea={onShareYourIdea}
        onExploreTeams={onExploreTeams}
        onExploreCommunity={onExploreCommunity}
        onSelectFirstNote={() => {
          if (notes.length > 0) {
            onSelectNote(notes[0]);
          } else {
            onExploreInspirations();
          }
        }}
        onToast={onToast}
      />

      {/* 3. Featured Inspirations Section (精选灵感预览区) */}
      <section className="py-24 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto border-t border-white/5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white tracking-tight font-normal mb-2">
              Featured Inspirations
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base max-w-2xl leading-relaxed">
              Curated breakthrough proposals across synthetic biology, AI, and medicine.
            </p>
          </div>

          {/* View All Inspirations button */}
          <div className="shrink-0">
            <button
              onClick={onExploreInspirations}
              className="px-6 py-3.5 bg-white hover:bg-neutral-200 text-black font-semibold text-xs rounded-2xl transition-all shadow-lg active:scale-95 flex items-center gap-2 cursor-pointer group"
            >
              <span>View All Inspirations</span>
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
        </div>

        {/* 4-6 Featured Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredNotes.map((note) => (
            <ImaginationCard
              key={note.id}
              note={note}
              onCollaborate={onCollaborate}
              onSelectNote={onSelectNote}
              onToggleLike={onToggleLike}
              onToggleSave={onToggleSave}
            />
          ))}
        </div>

        {/* Bottom Call to Action banner */}
        <div className="mt-16 p-8 sm:p-12 rounded-3xl bg-[#0c0c0e] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-serif text-white">
              Have an unprecedented scientific hypothesis?
            </h3>
            <p className="text-neutral-400 text-xs sm:text-sm max-w-xl">
              Don't leave revolutionary concepts untested. Share them with global partner labs ready to conduct experiments.
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-3">
            <button
              onClick={onShareYourIdea}
              className="px-7 py-3.5 bg-white text-black font-semibold text-xs rounded-2xl hover:bg-neutral-200 transition-all shadow-lg active:scale-95 cursor-pointer"
            >
              Share Your Idea
            </button>
            <button
              onClick={onExploreInspirations}
              className="px-7 py-3.5 bg-white/10 text-white font-semibold text-xs rounded-2xl hover:bg-white/20 border border-white/10 transition-all cursor-pointer"
            >
              Browse All
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <NewsletterSection />
    </div>
  );
}
