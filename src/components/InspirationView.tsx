/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import {
  Plus,
  Sparkles,
  TrendingUp,
  Clock,
  Search,
  Filter,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { ImaginationNote, DomainCategory } from '../types';
import ImaginationCard from './ImaginationCard';

interface InspirationViewProps {
  notes: ImaginationNote[];
  onPostIdea: () => void;
  onCollaborate: (note: ImaginationNote) => void;
  onSelectNote: (note: ImaginationNote) => void;
  onToggleLike: (noteId: string) => void;
  onToggleSave?: (noteId: string) => void;
}

const DOMAIN_OPTIONS = [
  'All Domains',
  'Biomedicine',
  'AI & Computing',
  'Synthetic Biology',
  'Neurotech',
  'Clean Biomanufacturing',
];

export default function InspirationView({
  notes,
  onPostIdea,
  onCollaborate,
  onSelectNote,
  onToggleLike,
  onToggleSave,
}: InspirationViewProps) {
  const [filter, setFilter] = useState<'Popular' | 'Latest'>('Popular');
  const [selectedDomain, setSelectedDomain] = useState<string>('All Domains');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Infinite scroll mock pagination (initial 6, loading more up to all 10+ items)
  const [visibleCount, setVisibleCount] = useState<number>(6);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // Filter and sort notes
  const filteredNotes = useMemo(() => {
    let result = [...notes];

    // Filter by domain
    if (selectedDomain !== 'All Domains') {
      result = result.filter((n) => n.domain === selectedDomain);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.description.toLowerCase().includes(q) ||
          n.author.name.toLowerCase().includes(q) ||
          n.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sort by Popular or Latest
    if (filter === 'Popular') {
      result.sort((a, b) => b.likes - a.likes);
    } else {
      result.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return result;
  }, [notes, filter, selectedDomain, searchQuery]);

  const displayedNotes = filteredNotes.slice(0, visibleCount);
  const hasMore = visibleCount < filteredNotes.length;

  // Infinite scroll observer
  useEffect(() => {
    if (!hasMore || isLoadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !isLoadingMore) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setVisibleCount((prev) => Math.min(prev + 4, filteredNotes.length));
            setIsLoadingMore(false);
          }, 450);
        }
      },
      { threshold: 0.1 }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [hasMore, isLoadingMore, filteredNotes.length]);

  return (
    <div className="min-h-screen pt-28 pb-24 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto bg-black text-white">
      {/* Header formatted exactly like Teams & Community */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif text-white tracking-tight font-normal">
            Inspiration Square
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base max-w-2xl mt-2 leading-relaxed">
            Explore the most inspiring ideas from the Square.
          </p>
        </div>

        {/* Primary Action Button: + Post Idea */}
        <div className="shrink-0">
          <button
            onClick={onPostIdea}
            className="px-6 py-3.5 bg-white hover:bg-neutral-200 text-black font-semibold text-xs rounded-2xl transition-all shadow-lg active:scale-95 flex items-center gap-2.5 cursor-pointer"
          >
            <Plus size={16} strokeWidth={2.4} className="shrink-0" />
            <span>Post Idea</span>
          </button>
        </div>
      </header>

      {/* Filter and Tab Controls Bar */}
      <div className="space-y-6 mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Filter Tab: Popular / Latest */}
          <div className="flex items-center gap-1.5 p-1 bg-white/5 rounded-full border border-white/10 self-start">
            <button
              onClick={() => {
                setFilter('Popular');
                setVisibleCount(6);
              }}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                filter === 'Popular'
                  ? 'bg-white text-black shadow-lg'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <TrendingUp size={13} />
              <span>Popular</span>
            </button>
            <button
              onClick={() => {
                setFilter('Latest');
                setVisibleCount(6);
              }}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                filter === 'Latest'
                  ? 'bg-white text-black shadow-lg'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Clock size={13} />
              <span>Latest</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(6);
              }}
              placeholder="Search hypotheses, tags, or authors..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs outline-none focus:border-white/30 transition-all placeholder:text-neutral-600"
            />
          </div>
        </div>

        {/* Domain Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {DOMAIN_OPTIONS.map((domain) => (
            <button
              key={domain}
              onClick={() => {
                setSelectedDomain(domain);
                setVisibleCount(6);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedDomain === domain
                  ? 'bg-white text-black shadow-md'
                  : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              {domain}
            </button>
          ))}
        </div>
      </div>

      {/* Main Full Idea Card Grid */}
      {displayedNotes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedNotes.map((note) => (
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
      ) : (
        <div className="py-24 text-center text-neutral-500 bg-[#0d0d10] rounded-3xl border border-dashed border-white/10">
          No research proposals found matching your criteria.
        </div>
      )}

      {/* Infinite Scroll Loader / End Indicator */}
      <div
        ref={loaderRef}
        className="mt-14 py-6 flex flex-col items-center justify-center text-center text-xs text-neutral-500"
      >
        {isLoadingMore && (
          <div className="flex items-center gap-2 text-neutral-400">
            <Loader2 size={18} className="animate-spin text-white" />
            <span>Loading more research inspirations...</span>
          </div>
        )}

        {!hasMore && displayedNotes.length > 0 && (
          <div className="text-neutral-500 text-xs">
            Showing all {filteredNotes.length} scientific frontier ideas in Inspiration Square.
          </div>
        )}

        {hasMore && !isLoadingMore && (
          <button
            onClick={() => {
              setIsLoadingMore(true);
              setTimeout(() => {
                setVisibleCount((prev) => Math.min(prev + 4, filteredNotes.length));
                setIsLoadingMore(false);
              }, 300);
            }}
            className="px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 text-xs font-medium transition-all"
          >
            Load More Ideas
          </button>
        )}
      </div>
    </div>
  );
}
