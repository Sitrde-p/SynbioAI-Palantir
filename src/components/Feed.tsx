/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import ImaginationCard from './ImaginationCard';
import NewsletterSection from './NewsletterSection';
import { ImaginationNote } from '../types';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FeedProps {
  notes: ImaginationNote[];
  onCollaborate: (note: ImaginationNote) => void;
  onSelectNote: (note: ImaginationNote) => void;
  onToggleLike: (noteId: string) => void;
  onToggleSave?: (noteId: string) => void;
}

export default function Feed({
  notes,
  onCollaborate,
  onSelectNote,
  onToggleLike,
  onToggleSave
}: FeedProps) {
  const [filter, setFilter] = useState<'Latest' | 'Popular'>('Latest');
  const [selectedDomain, setSelectedDomain] = useState<string>('All Domains');
  const [visibleCount, setVisibleCount] = useState<number>(6);

  // If notes array grows with a newly posted idea, reset filter so it's directly visible
  const prevNotesLengthRef = React.useRef(notes.length);
  React.useEffect(() => {
    if (notes.length > prevNotesLengthRef.current) {
      setSelectedDomain('All Domains');
      setFilter('Latest');
      setVisibleCount((prev) => Math.max(prev, 6));
    }
    prevNotesLengthRef.current = notes.length;
  }, [notes.length]);

  const domainOptions = [
    'All Domains',
    'Biomedicine',
    'AI & Computing',
    'Synthetic Biology',
    'Neurotech',
    'Clean Biomanufacturing'
  ];

  const filteredNotes = useMemo(() => {
    let result = [...notes];

    // Filter by domain
    if (selectedDomain !== 'All Domains') {
      result = result.filter((n) => n.domain === selectedDomain);
    }

    // Sort by Latest or Popular
    if (filter === 'Popular') {
      result.sort((a, b) => b.likes - a.likes);
    } else {
      result.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return result;
  }, [notes, filter, selectedDomain]);

  const displayedNotes = filteredNotes.slice(0, visibleCount);
  const hasMore = visibleCount < filteredNotes.length;

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  const handleShowLess = () => {
    setVisibleCount(6);
    // Smooth scroll back to feed top
    const feedAnchor = document.getElementById('inspiration-feed-anchor');
    if (feedAnchor) {
      feedAnchor.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="inspiration-feed-anchor" className="w-full">
      {/* Feed Container */}
      <div className="max-w-7xl mx-auto px-4 pb-20 pt-10">
        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-white/5 pb-8">
          {/* Domain Badges */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {domainOptions.map((domain) => (
              <button
                key={domain}
                onClick={() => {
                  setSelectedDomain(domain);
                  setVisibleCount(6);
                }}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedDomain === domain
                    ? 'bg-white text-black shadow-lg'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {domain}
              </button>
            ))}
          </div>

          {/* Sorting Buttons: Latest / Popular */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <div className="flex gap-1.5 p-1 bg-white/5 rounded-full border border-white/10">
              <button
                onClick={() => setFilter('Latest')}
                className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  filter === 'Latest'
                    ? 'bg-white text-black shadow-lg'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Latest
              </button>
              <button
                onClick={() => setFilter('Popular')}
                className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  filter === 'Popular'
                    ? 'bg-white text-black shadow-lg'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Popular
              </button>
            </div>
          </div>
        </div>

        {/* Notes Grid */}
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
          <div className="py-20 text-center text-neutral-500 bg-white/[0.02] rounded-3xl border border-dashed border-white/10">
            No research proposal cards available in this domain.
          </div>
        )}

        {/* Show More / Show Less Button */}
        {filteredNotes.length > 6 && (
          <div className="mt-14 flex justify-center items-center">
            {hasMore ? (
              <button
                onClick={handleShowMore}
                className="px-10 py-3.5 bg-neutral-900/90 hover:bg-neutral-800 text-white rounded-xl font-semibold text-sm border border-white/10 hover:border-white/20 transition-all shadow-xl active:scale-95 flex items-center gap-2.5 group"
              >
                <span>Show More</span>
                <ChevronDown size={16} className="text-neutral-400 group-hover:translate-y-0.5 transition-transform" />
              </button>
            ) : (
              <button
                onClick={handleShowLess}
                className="px-8 py-3 bg-neutral-900/60 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-xl font-medium text-xs border border-white/10 transition-all flex items-center gap-2 group"
              >
                <span>Show Less</span>
                <ChevronUp size={15} className="group-hover:-translate-y-0.5 transition-transform" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Lighter contrast background section: Newsletter & Social links */}
      <NewsletterSection />
    </div>
  );
}
