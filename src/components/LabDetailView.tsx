/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Building2,
  MapPin,
  Calendar,
  Sparkles,
  Users,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Mail,
  ShieldCheck,
  ArrowLeft,
  Bookmark,
} from 'lucide-react';
import { ResearchLab } from '../data/mockLabs';

interface LabDetailViewProps {
  lab: ResearchLab;
  onBack: () => void;
  onExpressInterest: (lab: ResearchLab) => void;
  savedLabIds?: string[];
  onToggleSaveLab?: (labId: string) => void;
}

export default function LabDetailView({
  lab,
  onBack,
  onExpressInterest,
  savedLabIds = [],
  onToggleSaveLab,
}: LabDetailViewProps) {
  const isSaved = savedLabIds.includes(lab.id);

  return (
    <div className="min-h-screen pt-28 pb-24 px-4 sm:px-6 lg:px-12 bg-black text-white">
      <div className="max-w-5xl mx-auto">
        {/* Back navigation */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors mb-8 cursor-pointer group"
        >
          <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Teams</span>
        </button>

        {/* Hero Header */}
        <header className="border-b border-white/10 pb-10 mb-12">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full bg-white/10 text-neutral-200 text-xs font-medium border border-white/10">
              {lab.domain}
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {lab.capacityStatus}
            </span>
            {lab.badge && (
              <span className="px-3 py-1 rounded-full bg-white/5 text-neutral-300 text-xs font-medium border border-white/10">
                {lab.badge}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white tracking-tight mb-4 font-normal">
            {lab.name}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-xs text-neutral-400 mb-6">
            <div className="flex items-center gap-1.5">
              <Building2 size={15} className="text-neutral-500" />
              <span className="text-neutral-200 font-medium">{lab.institution}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin size={15} className="text-neutral-500" />
              <span>{lab.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar size={15} className="text-neutral-500" />
              <span>Est. {lab.establishedYear}</span>
            </div>
          </div>

          <p className="text-neutral-300 text-base leading-relaxed max-w-4xl mb-8">
            {lab.summary}
          </p>

          {/* Action button: Express Interest, Bookmark, Contact */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => onExpressInterest(lab)}
              className="px-6 py-3 bg-white hover:bg-neutral-200 text-black font-semibold text-xs rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Sparkles size={15} />
              <span>Express Interest</span>
            </button>

            {onToggleSaveLab && (
              <button
                type="button"
                onClick={() => onToggleSaveLab(lab.id)}
                className={`px-5 py-3 rounded-xl border font-semibold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                  isSaved
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : 'bg-[#18181b] hover:bg-neutral-800 text-white border-white/10'
                }`}
              >
                <Bookmark size={15} className={isSaved ? 'fill-amber-400 text-amber-400' : ''} />
                <span>{isSaved ? 'Saved' : 'Save Lab'}</span>
              </button>
            )}

            <a
              href={`mailto:${lab.contactEmail}`}
              className="px-5 py-3 bg-[#18181b] hover:bg-neutral-800 text-white font-semibold text-xs rounded-xl border border-white/10 transition-all flex items-center gap-2"
            >
              <Mail size={15} />
              <span>Contact Lab Secretariat</span>
            </a>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main 2-column detailed section */}
          <div className="lg:col-span-2 space-y-12">
            {/* Full Biography / Facility Scope */}
            <section className="space-y-4">
              <h2 className="text-xl font-serif text-white tracking-tight">
                About the Laboratory & Infrastructure
              </h2>
              <div className="text-neutral-300 text-sm leading-relaxed space-y-3">
                <p>{lab.fullBio}</p>
              </div>
            </section>

            {/* Currently Accepting Creative Directions (可承接创意方向) */}
            <section className="space-y-4 p-6 sm:p-7 rounded-2xl bg-[#121215] border border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-amber-400" />
                <h2 className="text-lg font-serif text-white tracking-tight">
                  Accepting Frontier Proposals & Creative Directions
                </h2>
              </div>
              <p className="text-neutral-400 text-xs leading-relaxed">
                The laboratory is actively welcoming partnership inquiries and collaborative scientific notes in the following problem spaces:
              </p>
              <div className="space-y-3 pt-2">
                {lab.acceptingCreativeDirections.map((dir, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-start gap-3 hover:border-white/20 transition-all"
                  >
                    <div className="w-5 h-5 rounded-full bg-amber-400/10 text-amber-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <span className="text-xs text-neutral-200 leading-relaxed font-medium">
                      {dir}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Past Realized Projects (过往落地项目) */}
            <section className="space-y-4">
              <h2 className="text-xl font-serif text-white tracking-tight">
                Past Realized Projects & Translational Outcomes
              </h2>
              <div className="space-y-4">
                {lab.pastProjects.map((proj, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-neutral-950 border border-white/10 hover:border-white/20 transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-sm font-bold text-white">{proj.title}</h3>
                      <span className="px-2.5 py-0.5 rounded-md bg-white/10 text-white/80 text-[11px] font-mono shrink-0">
                        {proj.year}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      {proj.outcome}
                    </p>
                    <div className="pt-1">
                      <span className="text-[10px] text-neutral-500 font-mono tracking-wider uppercase">
                        Domain focus: {proj.tag}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar: Team & Research Pillars */}
          <div className="space-y-8">
            {/* Research Directions Pillars */}
            <div className="p-6 rounded-2xl bg-[#121215] border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white tracking-tight">
                Research Directions
              </h3>
              <div className="flex flex-wrap gap-2">
                {lab.researchDirections.map((dir, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-neutral-300 text-xs font-medium"
                  >
                    {dir}
                  </span>
                ))}
              </div>
            </div>

            {/* Team Members */}
            <div className="p-6 rounded-2xl bg-[#121215] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Team & Faculty
                </h3>
                <span className="text-xs text-neutral-500">{lab.teamMembers.length} Members</span>
              </div>
              <div className="space-y-4">
                {lab.teamMembers.map((member, idx) => (
                  <div key={idx} className="flex items-start gap-3.5 pt-2 first:pt-0">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-white/10 shrink-0"
                    />
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-white">{member.name}</h4>
                      <p className="text-[11px] text-neutral-400 font-medium">{member.role}</p>
                      {member.bio && (
                        <p className="text-[11px] text-neutral-500 leading-relaxed">{member.bio}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Lab Verification Info */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-neutral-400 space-y-2.5">
              <div className="flex items-center gap-2 text-neutral-300 font-semibold">
                <ShieldCheck size={16} className="text-emerald-400" />
                <span>Verified Scientific Entity</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                All physical laboratory facilities, compliance documentation, and experimental capabilities have been verified by SynbioAI Palantir.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
