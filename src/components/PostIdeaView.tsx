/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Sparkles,
  MapPin,
  Tag,
  Microscope,
  Send,
  HelpCircle,
  CheckCircle2,
  Atom,
} from 'lucide-react';
import { DomainCategory, UserAccount } from '../types';

interface PostIdeaViewProps {
  currentUser: UserAccount | null;
  onBack: () => void;
  onSubmitIdea: (newIdea: {
    title: string;
    domain: DomainCategory;
    authorName: string;
    location: string;
    tags: string;
    description: string;
  }) => void;
  onRequireAuth?: () => void;
}

const DOMAIN_OPTIONS: DomainCategory[] = [
  'Biomedicine',
  'AI & Computing',
  'Synthetic Biology',
  'Neurotech',
  'Clean Biomanufacturing',
];

export default function PostIdeaView({
  currentUser,
  onBack,
  onSubmitIdea,
  onRequireAuth,
}: PostIdeaViewProps) {
  const [title, setTitle] = useState('');
  const [domain, setDomain] = useState<DomainCategory>('Biomedicine');
  const [authorName, setAuthorName] = useState(
    currentUser ? currentUser.name : ''
  );
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title.trim()) {
      setErrorMsg('Please enter a proposal title.');
      return;
    }
    if (!description.trim()) {
      setErrorMsg('Please provide your scientific hypothesis and breakthrough vision.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onSubmitIdea({
        title: title.trim(),
        domain,
        authorName: authorName.trim() || (currentUser ? currentUser.name : 'Independent Researcher'),
        location: location.trim() || 'Global Scientific Network',
        tags: tags.trim(),
        description: description.trim(),
      });
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="min-h-screen pt-28 pb-28 px-4 sm:px-6 lg:px-12 bg-black text-white selection:bg-white selection:text-black">
      <div className="max-w-3xl mx-auto">
        {/* Back navigation button */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors cursor-pointer group"
          >
            <ArrowLeft
              size={15}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span>Back to Inspiration Square</span>
          </button>
        </div>

        {/* Page Title & Intro */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white tracking-tight font-normal mb-3">
            Share Your Frontier Idea
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed max-w-2xl">
            Publish your speculative hypothesis, computational model, or wet-lab concept to gain visibility and match with specialized research laboratories across the globe.
          </p>
        </motion.div>

        {/* Post Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          onSubmit={handleSubmit}
          className="space-y-8 bg-[#0e0e11] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl"
        >
          {errorMsg && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* 1. Proposal Title */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-neutral-200">
              Proposal Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Generative Diffusion-Driven De Novo Allosteric Enzyme Design"
              className="w-full px-4 py-3.5 bg-[#17171a] border border-white/10 rounded-2xl text-white text-sm outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all placeholder:text-neutral-600"
            />
            <p className="text-[11px] text-neutral-500">
              A clear, concise scientific title framing your hypothesis or methodology.
            </p>
          </div>

          {/* 2. Frontier Domain Selection */}
          <div className="space-y-2.5">
            <label className="block text-sm font-semibold text-neutral-200">
              Frontier Research Domain <span className="text-rose-400">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {DOMAIN_OPTIONS.map((opt) => {
                const isSelected = domain === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setDomain(opt)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white text-black shadow-md'
                        : 'bg-[#17171a] text-neutral-400 hover:text-white border border-white/5 hover:border-white/15'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Author & Affiliation / Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-neutral-200">
                Lead Investigator / Author
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder={currentUser ? currentUser.name : 'e.g. Dr. Arthur Vance'}
                className="w-full px-4 py-3 bg-[#17171a] border border-white/10 rounded-2xl text-white text-sm outline-none focus:border-white/30 transition-all placeholder:text-neutral-600"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-neutral-200 flex items-center gap-1.5">
                <MapPin size={14} className="text-neutral-500" />
                <span>Host Lab or Location</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Boston, MA · MIT Bio-Frontier Lab"
                className="w-full px-4 py-3 bg-[#17171a] border border-white/10 rounded-2xl text-white text-sm outline-none focus:border-white/30 transition-all placeholder:text-neutral-600"
              />
            </div>
          </div>

          {/* 4. Technical Keywords / Tags */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-neutral-200 flex items-center gap-1.5">
              <Tag size={14} className="text-neutral-500" />
              <span>Technical Keywords</span>
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. AllostericEnzymes, MolecularDynamics, CatalyticDesign, ProteinFolding"
              className="w-full px-4 py-3 bg-[#17171a] border border-white/10 rounded-2xl text-white text-sm outline-none focus:border-white/30 transition-all placeholder:text-neutral-600"
            />
            <p className="text-[11px] text-neutral-500">
              Comma or space separated terms helping researchers search and filter.
            </p>
          </div>

          {/* 5. Scientific Hypothesis & Breakthrough Vision */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-neutral-200">
              Scientific Hypothesis & Anticipated Breakthrough <span className="text-rose-400">*</span>
            </label>
            <textarea
              required
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail your scientific hypothesis, biological mechanisms, unresolved technical bottlenecks, and proposed wet-lab or computational validation strategies..."
              className="w-full p-4 bg-[#17171a] border border-white/10 rounded-2xl text-white text-sm outline-none focus:border-white/30 transition-all resize-none placeholder:text-neutral-600 leading-relaxed font-sans"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-neutral-500">
              Submissions undergo community and laboratory verification.
            </p>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onBack}
                className="w-full sm:w-auto px-5 py-3 text-xs font-semibold text-neutral-400 hover:text-white rounded-xl hover:bg-white/5 transition-all cursor-pointer text-center"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-neutral-200 text-black font-semibold text-xs rounded-2xl transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Publishing Idea...</span>
                ) : (
                  <>
                    <Send size={14} />
                    <span>Publish Idea</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
