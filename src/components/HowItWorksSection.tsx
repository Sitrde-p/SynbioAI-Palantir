/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface HowItWorksSectionProps {
  onExploreInspirations: () => void;
  onShareYourIdea: () => void;
  onExploreTeams?: () => void;
  onExploreCommunity?: () => void;
  onSelectFirstNote?: () => void;
  onToast?: (msg: string) => void;
}

const STEPS = [
  {
    id: 'inspiration',
    title: 'Inspiration Square',
    subtitle: 'Explore the boldest, most cutting-edge ideas from the global research community.',
    panelTitle: 'Trending Ideas',
    data: [
      { id: 1, title: 'AI-Optimized Protein Degraders', likes: '5.6k', author: 'Dr. Sarah Jenkins', date: 'Sep 01' },
      { id: 2, title: 'Self-Assembling Neural Scaffolds', likes: '3.4k', author: 'Dr. Elena Vance', date: 'Sep 03' },
      { id: 3, title: 'Bioluminescent Urban Flora', likes: '2.1k', author: 'Prof. Kenji T.', date: 'Sep 05' },
    ],
    linkText: 'Explore all ideas',
    target: 'inspiration',
  },
  {
    id: 'teams',
    title: 'Research Teams',
    subtitle: 'Find the top labs and research teams that can turn your ideas into reality.',
    panelTitle: 'Lab Network',
    data: [
      { id: 1, name: 'Wyss Bio-Robotics', joined: 'Sep 06', domain: 'Synthetic Bio', bio: 'Living Materials' },
      { id: 2, name: 'Tsinghua NanoLab', joined: 'Sep 05', domain: 'Nanotech', bio: 'Silicon Interfaces' },
      { id: 3, name: 'MIT Synthetic Lab', joined: 'Sep 03', domain: 'Synthetic Bio', bio: 'CRISPR Therapeutics' },
    ],
    linkText: 'Browse all labs',
    target: 'teams',
  },
  {
    id: 'community',
    title: 'Community Hub',
    subtitle: 'Connect with like-minded researchers, spark discussions, and find your next collaborator.',
    panelTitle: 'Live Feed',
    data: [
      { id: 1, title: 'How can off-target effects of in-vivo CRISPR be resolved?', replies: '42', author: 'Dr. Elena Vance', date: 'Sep 05' },
      { id: 2, title: 'What will AI-driven drug discovery look like in 5 years?', replies: '38', author: 'Dr. Sarah Jenkins', date: 'Sep 04' },
      { id: 3, title: 'Seeking research partners in brain-computer interfaces', replies: '25', author: 'Ming Zhang', date: 'Sep 02' },
    ],
    linkText: 'Join the discussion',
    target: 'community',
  },
];

export default function HowItWorksSection({
  onExploreInspirations,
  onExploreTeams,
  onExploreCommunity,
}: HowItWorksSectionProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const currentIdx = hoverIdx !== null ? hoverIdx : activeIdx;

  // Local state for sequential mounting animation
  const [visibleRows, setVisibleRows] = useState<any[]>([]);

  // Orchestrate item sequential loading AND automatic section switching
  useEffect(() => {
    // 1. Reset currently visible rows for the active/hovered section
    setVisibleRows([]);
    const fullData = STEPS[currentIdx].data;
    let currentCount = 0;
    let nextSectionTimeout: NodeJS.Timeout | null = null;

    // 2. Incremental load interval: 200ms per row
    const loadInterval = setInterval(() => {
      if (currentCount < fullData.length) {
        const nextItem = fullData[currentCount];
        setVisibleRows((prev) => [...prev, nextItem]);
        currentCount++;
      } else {
        // Once all rows are loaded, clear the loader interval
        clearInterval(loadInterval);

        // 3. Pause for 2.5 seconds (between 2 and 3 seconds) then cycle to next section
        // ONLY trigger auto-switch if the user is not actively hovering
        if (hoverIdx === null) {
          nextSectionTimeout = setTimeout(() => {
            setActiveIdx((prev) => (prev + 1) % STEPS.length);
          }, 2500);
        }
      }
    }, 200);

    return () => {
      clearInterval(loadInterval);
      if (nextSectionTimeout) {
        clearTimeout(nextSectionTimeout);
      }
    };
  }, [currentIdx, hoverIdx]);

  const handleManualSelect = (idx: number) => {
    setActiveIdx(idx);
  };

  const handleLinkClick = (target: string) => {
    if (target === 'inspiration') onExploreInspirations();
    else if (target === 'teams') onExploreTeams?.();
    else if (target === 'community') onExploreCommunity?.();
  };

  return (
    <section className="relative py-24 border-t border-white/5 bg-black">
      {/* Exquisite custom inline CSS animation keyframes */}
      <style>{`
        @keyframes fadeInUpCustom {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up-custom {
          opacity: 0;
          animation: fadeInUpCustom 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Background soft glowing blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/[0.015] rounded-full blur-[140px] pointer-events-none" />

      {/* Grid aligned directly to identical layout padding of the landing sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 relative z-10">
        
        {/* Responsive Grid Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Heading and Progressive Steps */}
          <div className="lg:col-span-5 space-y-12">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white tracking-tight font-normal">
                How it works
              </h2>
            </div>

            <div className="relative pr-4 space-y-0">
              {/* Vertical Path Connector */}
              <div className="absolute left-[6px] top-6 bottom-6 w-[1px] bg-white/[0.08]" />

              {STEPS.map((step, idx) => {
                const isActive = currentIdx === idx;
                return (
                  <div
                    key={step.id}
                    onMouseEnter={() => setHoverIdx(idx)}
                    onMouseLeave={() => setHoverIdx(null)}
                    onClick={() => handleManualSelect(idx)}
                    className="relative group cursor-pointer py-6 transition-all duration-300"
                  >
                    {/* Path Anchor Point */}
                    <div
                      className={`absolute left-0 top-[31px] w-[13px] h-[13px] transition-all duration-300 z-10 ${
                        isActive
                          ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)] scale-110'
                          : 'bg-white/[0.12] scale-100 group-hover:bg-white/30'
                      }`}
                    >
                      <div className="w-full h-full border border-black/30" />
                    </div>

                    {/* Step description text */}
                    <div className="pl-8">
                      <h3
                        className={`text-lg font-medium tracking-[0.03em] transition-all duration-300 ${
                          isActive ? 'text-white translate-x-1' : 'text-white/25 group-hover:text-white/40'
                        }`}
                      >
                        {step.title}
                      </h3>

                      <AnimatePresence initial={false}>
                        {isActive && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className="overflow-hidden"
                          >
                            <p className="mt-2 text-xs text-neutral-400 leading-relaxed max-w-sm translate-x-1">
                              {step.subtitle}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Full width detailed table with sequential animations */}
          <div className="lg:col-span-7 pt-0 lg:pt-2">
            {/* Extended width to fill entire right column space beautifully */}
            <div className="w-full border border-white/10 rounded-xl p-6 bg-[#070708] backdrop-blur-md shadow-2xl flex flex-col justify-between min-h-[360px]">
              
              <div>
                {/* Panel Label */}
                <div className="flex items-center gap-2 mb-6">
                  <span className="w-1 h-3.5 bg-white/30 rounded-full" />
                  <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/50">
                    {STEPS[currentIdx].panelTitle}
                  </span>
                </div>

                {/* Exquisite Financial Table Container */}
                <div className="w-full overflow-hidden mb-6">
                  {/* Table Header Row */}
                  <div className="border-b border-white/10 pb-2.5 mb-2">
                    {currentIdx === 0 && (
                      <div className="grid grid-cols-12 gap-3 text-[10px] font-mono uppercase tracking-wider text-[#8b8ba3]">
                        <div className="col-span-5 text-left">Title</div>
                        <div className="col-span-2 text-left">Likes</div>
                        <div className="col-span-3 text-left">Author</div>
                        <div className="col-span-2 text-left">Date</div>
                      </div>
                    )}
                    {currentIdx === 1 && (
                      <div className="grid grid-cols-12 gap-3 text-[10px] font-mono uppercase tracking-wider text-[#8b8ba3]">
                        <div className="col-span-4 text-left">Name</div>
                        <div className="col-span-2 text-left">Joined</div>
                        <div className="col-span-3 text-left">Domain</div>
                        <div className="col-span-3 text-left">Bio</div>
                      </div>
                    )}
                    {currentIdx === 2 && (
                      <div className="grid grid-cols-12 gap-3 text-[10px] font-mono uppercase tracking-wider text-[#8b8ba3]">
                        <div className="col-span-5 text-left">Title</div>
                        <div className="col-span-2 text-left">Replies</div>
                        <div className="col-span-3 text-left">Author</div>
                        <div className="col-span-2 text-left">Date</div>
                      </div>
                    )}
                  </div>

                  {/* Fixed Static Rows with animation isolated only to the inner content */}
                  <div className="divide-y divide-white/5 min-h-[150px]">
                    {STEPS[currentIdx].data.map((row: any, i) => {
                      const isVisible = visibleRows.some((vr) => vr.id === row.id);
                      return (
                        <div
                          key={`${row.id}-${currentIdx}`}
                          className="py-3 hover:bg-white/[0.01] transition-colors min-h-[45px] flex items-center relative"
                        >
                          {isVisible ? (
                            <div className="w-full animate-fade-in-up-custom">
                              {currentIdx === 0 && (
                                <div className="grid grid-cols-12 gap-3 items-center text-[11px]">
                                  {/* Title (Full length, no cut-off) */}
                                  <div className="col-span-5 text-left text-white font-medium">
                                    {row.title}
                                  </div>
                                  {/* Likes (Highlight Field, left-aligned) */}
                                  <div className="col-span-2 text-left">
                                    <span className="bg-gradient-to-r from-violet-400 to-indigo-300 bg-clip-text text-transparent font-semibold font-mono tracking-wide">
                                      {row.likes}
                                    </span>
                                  </div>
                                  {/* Author (Left-aligned) */}
                                  <div className="col-span-3 text-left text-[#8b8ba3] truncate">
                                    {row.author}
                                  </div>
                                  {/* Date (Left-aligned, unified English month format) */}
                                  <div className="col-span-2 text-left text-[#8b8ba3] font-mono">
                                    {row.date}
                                  </div>
                                </div>
                              )}

                              {currentIdx === 1 && (
                                <div className="grid grid-cols-12 gap-3 items-center text-[11px]">
                                  {/* Name (Left-aligned) */}
                                  <div className="col-span-4 text-left text-white font-medium truncate">
                                    {row.name}
                                  </div>
                                  {/* Joined (Highlight Field, left-aligned) */}
                                  <div className="col-span-2 text-left">
                                    <span className="bg-gradient-to-r from-violet-400 to-indigo-300 bg-clip-text text-transparent font-semibold font-mono tracking-wide">
                                      {row.joined}
                                    </span>
                                  </div>
                                  {/* Domain (Left-aligned) */}
                                  <div className="col-span-3 text-left text-[#8b8ba3] truncate">
                                    {row.domain}
                                  </div>
                                  {/* Bio (Left-aligned, spacious and complete) */}
                                  <div className="col-span-3 text-left text-[#8b8ba3] truncate" title={row.bio}>
                                    {row.bio}
                                  </div>
                                </div>
                              )}

                              {currentIdx === 2 && (
                                <div className="grid grid-cols-12 gap-3 items-center text-[11px]">
                                  {/* Title (Left-aligned, English only) */}
                                  <div className="col-span-5 text-left text-white font-medium pr-1" title={row.title}>
                                    {row.title}
                                  </div>
                                  {/* Replies (Highlight Field, left-aligned) */}
                                  <div className="col-span-2 text-left">
                                    <span className="bg-gradient-to-r from-violet-400 to-indigo-300 bg-clip-text text-transparent font-semibold font-mono tracking-wide">
                                      {row.replies}
                                    </span>
                                  </div>
                                  {/* Author (Left-aligned) */}
                                  <div className="col-span-3 text-left text-[#8b8ba3] truncate">
                                    {row.author}
                                  </div>
                                  {/* Date (Left-aligned) */}
                                  <div className="col-span-2 text-left text-[#8b8ba3] font-mono">
                                    {row.date}
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            // Stable height placeholder with zero-opacity text
                            <div className="w-full opacity-0 pointer-events-none text-[11px]">
                              <div className="grid grid-cols-12 gap-3 items-center">
                                <div className="col-span-12">&nbsp;</div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                </div>
              </div>

              {/* Bottom Action Row (White text left, White button wrapper on the right) */}
              <div className="pt-4 border-t border-white/10">
                <div
                  onClick={() => handleLinkClick(STEPS[currentIdx].target)}
                  className="flex items-center justify-between p-3.5 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/[0.06] hover:border-white/15 transition-all cursor-pointer group"
                >
                  <span className="text-xs font-semibold text-white transition-colors">
                    {STEPS[currentIdx].linkText}
                  </span>
                  <div className="w-5 h-5 rounded bg-white/10 flex items-center justify-center text-white group-hover:bg-white/20 transition-all text-xs font-mono font-bold">
                    &gt;
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
