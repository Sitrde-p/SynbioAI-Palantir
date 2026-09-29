/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Sparkles, Building2, MessageSquare } from 'lucide-react';
import { ImaginationNote } from '../types';
import { RESEARCH_LABS, ResearchLab } from '../data/mockLabs';
import { INITIAL_NOTES } from '../data/mockNotes';

export type SearchCategory = 'All' | 'Ideas' | 'Labs' | 'Discussions';

export interface SearchResultItem {
  id: string;
  type: 'idea' | 'lab' | 'discussion';
  title: string;
  description: string;
  categoryLabel: string;
  image?: string;
  rawNote?: ImaginationNote;
  rawLab?: ResearchLab;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectIdea?: (note: ImaginationNote) => void;
  onSelectLab?: (lab: ResearchLab) => void;
  onSelectDiscussion?: (discussionTitle: string) => void;
}

const STATIC_DISCUSSIONS = [
  {
    id: 'disc-1',
    title: 'How to mitigate off-target effects in CRISPR editing?',
    description: 'Exploring high-fidelity Cas12a variants vs base editing strategies in human primary cells.',
    categoryLabel: 'Discussion',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=240',
  },
  {
    id: 'disc-2',
    title: 'Will continuous microfluidic cell-free protein synthesis replace traditional bioreactors?',
    description: 'Recent yields surpass 1.2 mg/mL within 6 hours without managing host cell viability.',
    categoryLabel: 'Discussion',
    image: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=240',
  },
  {
    id: 'disc-3',
    title: 'Standardizing acoustic dispensing protocols for combinatorial assembly',
    description: 'Best practices for calibrating droplet ejection parameters across viscous polymer buffers.',
    categoryLabel: 'Discussion',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=240',
  },
  {
    id: 'disc-4',
    title: 'AI diffusion models for de novo binders: screening benchmarks',
    description: 'Comparing RFdiffusion vs AlphaFold3 predictions against experimental SPR kinetic data.',
    categoryLabel: 'Discussion',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=240',
  },
];

export default function SearchModal({
  isOpen,
  onClose,
  onSelectIdea,
  onSelectLab,
  onSelectDiscussion,
}: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('All');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [failedImageIds, setFailedImageIds] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  // Pool all items
  const allItems: SearchResultItem[] = useMemo(() => {
    const ideasList: SearchResultItem[] = INITIAL_NOTES.map((note) => ({
      id: `idea-${note.id}`,
      type: 'idea',
      title: note.title,
      description: note.description,
      categoryLabel: note.domain || 'Idea',
      image: note.image,
      rawNote: note,
    }));

    const prominentIdeas: SearchResultItem[] = [
      {
        id: 'prominent-idea-1',
        type: 'idea',
        title: 'AI-Optimized Protein Degraders',
        description: 'De novo generation of bifunctional PROTAC degrader molecules with target-selective E3 ligase recruiters.',
        categoryLabel: 'Biomedicine',
        image: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=240',
        rawNote: INITIAL_NOTES[0],
      },
      ...ideasList,
    ];

    const labsList: SearchResultItem[] = [
      {
        id: 'prominent-lab-wyss',
        type: 'lab',
        title: 'Wyss Bio-Robotics Group',
        description: 'Automated microfluidic bioreactors and living biological machines for cellular synthesis (Harvard University).',
        categoryLabel: 'Synthetic Biology',
        image: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=240',
        rawLab: RESEARCH_LABS[0],
      },
      ...RESEARCH_LABS.map((lab) => ({
        id: `lab-${lab.id}`,
        type: 'lab' as const,
        title: lab.name,
        description: `${lab.summary} (${lab.institution})`,
        categoryLabel: lab.domain || 'Laboratory',
        image: lab.institutionLogo || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=240',
        rawLab: lab,
      })),
    ];

    const discussionsList: SearchResultItem[] = STATIC_DISCUSSIONS.map((d) => ({
      id: d.id,
      type: 'discussion',
      title: d.title,
      description: d.description,
      categoryLabel: d.categoryLabel,
      image: d.image,
    }));

    return [...prominentIdeas, ...labsList, ...discussionsList];
  }, []);

  // Filter items based on active category and query
  const filteredItems = useMemo(() => {
    let list = allItems;

    // Filter by category
    if (activeCategory === 'Ideas') {
      list = list.filter((item) => item.type === 'idea');
    } else if (activeCategory === 'Labs') {
      list = list.filter((item) => item.type === 'lab');
    } else if (activeCategory === 'Discussions') {
      list = list.filter((item) => item.type === 'discussion');
    }

    const q = query.trim().toLowerCase();
    if (!q) {
      if (activeCategory === 'All') {
        const topIdeas = allItems.filter((i) => i.type === 'idea').slice(0, 3);
        const topLabs = allItems.filter((i) => i.type === 'lab').slice(0, 2);
        const topDiscussions = allItems.filter((i) => i.type === 'discussion').slice(0, 2);
        return [...topIdeas, ...topLabs, ...topDiscussions];
      }
      return list.slice(0, 8);
    }

    // Matching query
    return list.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.categoryLabel.toLowerCase().includes(q)
    );
  }, [allItems, activeCategory, query]);

  // Exclude any items whose images failed to load
  const displayItems = useMemo(() => {
    return filteredItems.filter((item) => !failedImageIds.has(item.id));
  }, [filteredItems, failedImageIds]);

  // Reset selected index when query or category changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, activeCategory]);

  // Lock scroll & auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 40);
    } else {
      document.body.style.overflow = 'unset';
      setQuery('');
      setActiveCategory('All');
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle item activation
  const handleActivateItem = (item: SearchResultItem) => {
    if (item.type === 'idea') {
      if (onSelectIdea && item.rawNote) {
        onSelectIdea(item.rawNote);
      }
    } else if (item.type === 'lab') {
      if (onSelectLab && item.rawLab) {
        onSelectLab(item.rawLab);
      }
    } else if (item.type === 'discussion') {
      if (onSelectDiscussion) {
        onSelectDiscussion(item.title);
      }
    }
    onClose();
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < displayItems.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : Math.max(0, displayItems.length - 1)));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (displayItems[selectedIndex]) {
          handleActivateItem(displayItems[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, displayItems, selectedIndex, onClose]);

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.querySelector(`[data-index="${selectedIndex}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  const categories: SearchCategory[] = ['All', 'Ideas', 'Labs', 'Discussions'];

  const getSectionTitle = () => {
    if (query.trim()) {
      return `Results (${displayItems.length})`;
    }
    if (activeCategory === 'All') {
      return 'Latest additions & recommendations';
    }
    if (activeCategory === 'Ideas') {
      return 'Featured ideas';
    }
    if (activeCategory === 'Labs') {
      return 'Featured labs';
    }
    if (activeCategory === 'Discussions') {
      return 'Featured discussions';
    }
    return `Featured ${activeCategory.toLowerCase()}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop: Dark Dim + Blur (20px) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-[20px] z-[100]"
          />

          {/* Search Floating Overlay Container (Max width 720px) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -16 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-[10%] sm:top-[13%] left-1/2 -translate-x-1/2 w-full max-w-[720px] px-4 z-[101]"
          >
            <div className="w-full rounded-[16px] bg-[#0e0e12] border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col max-h-[78vh]">
              {/* 1. Search Box Header */}
              <div className="relative flex items-center h-[50px] px-4 bg-white/[0.06] border-b border-white/[0.08]">
                <Search size={18} className="text-white/40 shrink-0 select-none pointer-events-none" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search ideas, labs and discussions..."
                  className="w-full h-full bg-transparent border-none outline-none text-sm text-white placeholder:text-neutral-500 pl-3 pr-8 font-normal"
                />
                {query.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('');
                      inputRef.current?.focus();
                    }}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-white/40 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    title="Clear search"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              {/* 2. Category Tabs */}
              <div className="flex items-center gap-1.5 px-4 py-2.5 bg-[#0a0a0d] border-b border-white/[0.06] overflow-x-auto scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1 rounded-[8px] text-xs transition-all whitespace-nowrap cursor-pointer ${
                      activeCategory === cat
                        ? 'bg-white/10 text-white font-medium shadow-sm'
                        : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* 3. Results & Suggestions Section (Scrollbar hidden) */}
              <div
                ref={listRef}
                className="flex-1 overflow-y-auto p-2 space-y-1 max-h-[50vh] scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                <div className="px-3 pt-2 pb-1 text-[11px] font-medium text-neutral-400">
                  {getSectionTitle()}
                </div>

                {displayItems.length > 0 ? (
                  displayItems.map((item, index) => {
                    const isSelected = index === selectedIndex;
                    return (
                      <div
                        key={item.id}
                        data-index={index}
                        onClick={() => handleActivateItem(item)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`group flex items-center justify-between gap-3.5 p-2.5 rounded-[10px] transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-white/[0.08] text-white shadow-sm'
                            : 'hover:bg-white/[0.04] text-neutral-300'
                        }`}
                      >
                        {/* Thumbnail / Icon Badge */}
                        <div className="w-12 h-9 rounded-md overflow-hidden bg-neutral-900 border border-white/10 shrink-0 flex items-center justify-center">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt=""
                              onError={() => {
                                setFailedImageIds((prev) => new Set(prev).add(item.id));
                              }}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : item.type === 'idea' ? (
                            <Sparkles size={16} className="text-violet-400" />
                          ) : item.type === 'lab' ? (
                            <Building2 size={16} className="text-emerald-400" />
                          ) : (
                            <MessageSquare size={16} className="text-blue-400" />
                          )}
                        </div>

                        {/* Title & Description */}
                        <div className="min-w-0 flex-1">
                          <h4
                            className={`text-xs font-semibold truncate ${
                              isSelected ? 'text-white' : 'text-neutral-200'
                            }`}
                          >
                            {item.title}
                          </h4>
                          <p className="text-[11px] text-neutral-400 truncate mt-0.5 leading-tight">
                            {item.description}
                          </p>
                        </div>

                        {/* Category Label */}
                        <div className="shrink-0 text-right">
                          <span className="text-[11px] font-medium text-neutral-500 group-hover:text-neutral-400">
                            {item.categoryLabel}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-12 text-center text-neutral-500 text-xs">
                    No results found for "{query}". Try another keyword.
                  </div>
                )}
              </div>

              {/* 4. Bottom Keyboard Shortcuts Hint */}
              <div className="px-4 py-2.5 bg-[#08080a] border-t border-white/[0.06] flex items-center justify-between text-[11px] text-neutral-400 font-mono select-none">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <span className="text-neutral-400 font-sans">↑↓</span>
                    <span>navigate</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="text-neutral-400 font-sans">↵</span>
                    <span>open</span>
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>esc close</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
