/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Building2,
  MapPin,
  Sparkles,
  Filter,
  Search,
  Plus,
  ChevronRight,
  ShieldCheck,
  Bookmark,
} from 'lucide-react';
import { RESEARCH_LABS, ResearchLab } from '../data/mockLabs';

interface LabViewProps {
  onSelectLab: (lab: ResearchLab) => void;
  onApplyToJoin: () => void;
  onExpressInterest: (lab: ResearchLab) => void;
  savedLabIds?: string[];
  onToggleSaveLab?: (labId: string) => void;
}

export default function LabView({
  onSelectLab,
  onApplyToJoin,
  onExpressInterest,
  savedLabIds = [],
  onToggleSaveLab,
}: LabViewProps) {
  const [selectedDomain, setSelectedDomain] = useState<string>('All Domains');
  const [selectedInstitution, setSelectedInstitution] = useState<string>('All Institutions');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Domain Options
  const domainOptions = [
    'All Domains',
    'Synthetic Biology',
    'Biomedicine',
    'AI & Computing',
    'Neurotech',
    'Clean Biomanufacturing',
  ];

  // Unique Institutions derived from data
  const institutionOptions = useMemo(() => {
    const list = Array.from(new Set(RESEARCH_LABS.map((l) => l.institution)));
    return ['All Institutions', ...list];
  }, []);

  // Filtered labs
  const filteredLabs = useMemo(() => {
    return RESEARCH_LABS.filter((lab) => {
      const matchDomain =
        selectedDomain === 'All Domains' || lab.domain === selectedDomain;
      const matchInstitution =
        selectedInstitution === 'All Institutions' ||
        lab.institution === selectedInstitution;
      const matchQuery =
        !searchQuery.trim() ||
        lab.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lab.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lab.researchDirections.some((d) =>
          d.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        lab.representativeProjects.some((p) =>
          p.toLowerCase().includes(searchQuery.toLowerCase())
        );

      return matchDomain && matchInstitution && matchQuery;
    });
  }, [selectedDomain, selectedInstitution, searchQuery]);

  return (
    <div className="min-h-screen pt-28 pb-24 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto bg-black text-white">
      {/* Header with Apply to Join button */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif text-white tracking-tight font-normal">
            Find Your Research Team
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base max-w-2xl mt-2 leading-relaxed">
            Find the right research team. Make it happen.
          </p>
        </div>

        {/* Primary Action Button: + Apply to Join */}
        <div className="shrink-0">
          <button
            onClick={onApplyToJoin}
            className="px-6 py-3.5 bg-white hover:bg-neutral-200 text-black font-semibold text-xs rounded-2xl transition-all shadow-lg active:scale-95 flex items-center gap-2.5 cursor-pointer"
          >
            <Plus size={16} strokeWidth={2.4} className="shrink-0" />
            <span>Apply to Join</span>
          </button>
        </div>
      </header>

        {/* Filter Controls Bar */}
        <div className="mb-10 p-4 rounded-2xl bg-[#0c0c0e] border border-white/10 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div className="flex flex-wrap items-center gap-3">
            {/* Domain Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-neutral-400 shrink-0">
                Domain:
              </span>
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs outline-none focus:border-white/30 transition-all"
              >
                {domainOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Institution Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-neutral-400 shrink-0">
                Institution:
              </span>
              <select
                value={selectedInstitution}
                onChange={(e) => setSelectedInstitution(e.target.value)}
                className="max-w-[220px] sm:max-w-[280px] px-3.5 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs outline-none focus:border-white/30 transition-all truncate"
              >
                {institutionOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search labs, directions, PIs..."
              className="w-full px-3.5 py-2 pl-9 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs outline-none focus:border-white/30 transition-all placeholder:text-neutral-600"
            />
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
            />
          </div>
        </div>

        {/* Minimal Frameless Cards Grid with Subtle Hover Glow Effect */}
        {filteredLabs.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <p className="text-neutral-400 text-sm">
              No laboratories match the selected filters.
            </p>
            <button
              onClick={() => {
                setSelectedDomain('All Domains');
                setSelectedInstitution('All Institutions');
                setSearchQuery('');
              }}
              className="text-xs text-white underline underline-offset-4 hover:text-neutral-300"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLabs.map((lab) => {
              const isSaved = savedLabIds.includes(lab.id);
              return (
                <div
                  key={lab.id}
                  onClick={() => onSelectLab(lab)}
                  className="group relative cursor-pointer rounded-2xl p-6 transition-all duration-300 bg-[#09090b]/80 hover:bg-[#111114] border border-transparent hover:border-white/15 hover:shadow-[0_0_35px_-8px_rgba(255,255,255,0.12)] flex flex-col justify-between"
                >
                  {/* Subtle top ambient line indicator on hover */}
                  <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/0 to-transparent group-hover:via-white/30 transition-all duration-500" />

                  <div>
                    {/* Top metadata tags & bookmark button */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                          {lab.domain}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-medium">
                          {lab.capacityStatus}
                        </span>
                      </div>

                      {onToggleSaveLab && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleSaveLab(lab.id);
                          }}
                          title={isSaved ? 'Remove from saved' : 'Save lab'}
                          className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                            isSaved
                              ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                              : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          <Bookmark size={13} className={isSaved ? 'fill-amber-400 text-amber-400' : ''} />
                        </button>
                      )}
                    </div>

                    {/* 实验室名称 (Lab Name) */}
                    <h3 className="text-lg font-serif text-white tracking-tight mb-2 group-hover:text-neutral-100 transition-colors line-clamp-2">
                      {lab.name}
                    </h3>

                    {/* 所属机构 (Institution) */}
                    <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-5">
                      <Building2 size={13} className="text-neutral-500 shrink-0" />
                      <span className="font-medium text-neutral-300 truncate">
                        {lab.institution}
                      </span>
                    </div>

                    {/* 研究方向 (Research Directions) */}
                    <div className="mb-5 space-y-1.5">
                      <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                        Research Directions
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {lab.researchDirections.slice(0, 3).map((dir, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-[11px] text-neutral-300 font-medium group-hover:border-white/10 transition-colors"
                          >
                            {dir}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* 代表项目 (Representative Projects) */}
                    <div className="space-y-1.5 mb-6">
                      <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                        Representative Projects
                      </span>
                      <ul className="space-y-1.5">
                        {lab.representativeProjects.slice(0, 2).map((proj, i) => (
                          <li
                            key={i}
                            className="text-xs text-neutral-400 line-clamp-1 flex items-start gap-1.5"
                          >
                            <span className="text-neutral-600 mt-0.5">•</span>
                            <span>{proj}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Card Footer with Quick Actions */}
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-neutral-400 group-hover:text-white transition-colors">
                      View Lab Profile &nbsp;&nbsp;&gt;
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onExpressInterest(lab);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white text-white hover:text-black text-[11px] font-semibold transition-all cursor-pointer"
                    >
                      Express Interest
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
    </div>
  );
}
