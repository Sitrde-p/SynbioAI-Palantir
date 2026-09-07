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
  Mail,
  UserCheck,
  CheckCircle2,
  Sparkles,
  Send,
  HelpCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { ResearchLab } from '../data/mockLabs';
import { UserInterest } from '../types';

interface ExpressInterestModalProps {
  lab: ResearchLab;
  onClose: () => void;
  onSuccessToast?: (msg: string) => void;
}

export default function ExpressInterestModal({
  lab,
  onClose,
  onSuccessToast,
}: ExpressInterestModalProps) {
  // Pre-fill from current user if available in localStorage
  const savedUser = (() => {
    try {
      const raw = localStorage.getItem('synbio_current_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  const [applicantName, setApplicantName] = useState(savedUser?.name || '');
  const [applicantEmail, setApplicantEmail] = useState(savedUser?.email || '');
  const [organization, setOrganization] = useState(savedUser?.affiliation || '');
  const [proposedProjectTitle, setProposedProjectTitle] = useState('');
  const [collaborationType, setCollaborationType] = useState('Joint Experimental Validation');
  const [projectSummary, setProjectSummary] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Strict validation for required fields
    if (!applicantName.trim()) {
      setErrorMessage('Please provide your full name.');
      return;
    }
    if (!applicantEmail.trim() || !applicantEmail.includes('@')) {
      setErrorMessage('Please provide a valid contact email.');
      return;
    }
    if (!collaborationType.trim()) {
      setErrorMessage('Please select a collaboration type.');
      return;
    }
    if (!proposedProjectTitle.trim()) {
      setErrorMessage('Please enter the proposed topic or idea title.');
      return;
    }
    if (!projectSummary.trim()) {
      setErrorMessage('Please detail your collaboration proposal & technical needs.');
      return;
    }

    setIsSubmitting(true);

    const newInterest: UserInterest = {
      id: `interest-${Date.now()}`,
      labId: lab.id,
      labName: lab.name,
      institution: lab.institution,
      matchScore: lab.matchScore || Math.floor(Math.random() * 8 + 90),
      status: 'Pending',
      proposedTopic: proposedProjectTitle.trim(),
      collaborationType: collaborationType.trim(),
      projectSummary: projectSummary.trim(),
      applicantName: applicantName.trim(),
      applicantEmail: applicantEmail.trim(),
      organization: organization.trim() || undefined,
      createdAt: new Date().toISOString(),
      timestampDisplay: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    };

    try {
      const stored = localStorage.getItem('synbio_user_interests');
      const list: UserInterest[] = stored ? JSON.parse(stored) : [];
      list.unshift(newInterest);
      localStorage.setItem('synbio_user_interests', JSON.stringify(list));
      window.dispatchEvent(new Event('synbio_interests_updated'));
    } catch (err) {
      console.error('Failed to persist user interest:', err);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      if (onSuccessToast) {
        onSuccessToast(`Collaboration interest sent to ${lab.name}!`);
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        className="relative z-10 w-full max-w-2xl bg-[#0e0e11] border border-white/15 rounded-3xl p-6 sm:p-8 text-white shadow-2xl overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 w-9 h-9 rounded-xl bg-transparent hover:bg-[#262626] flex items-center justify-center text-neutral-400 hover:text-white transition-all cursor-pointer z-20 group"
        >
          <X size={18} strokeWidth={2.2} />
        </button>

        {isSubmitted ? (
          <div className="py-12 flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-2xl font-serif text-white tracking-tight">
              Interest Expressed Successfully
            </h3>
            <p className="text-neutral-400 text-sm max-w-md leading-relaxed">
              Your inquiry has been dispatched to <span className="text-white font-semibold">{lab.name}</span>'s PI ({lab.leadPI}) and lab management team.
            </p>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-xs text-neutral-300 max-w-md w-full text-left space-y-1 mt-4">
              <div className="flex justify-between text-neutral-400">
                <span>Lab Contact:</span>
                <span className="text-white font-mono">{lab.contactEmail}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Estimated Response:</span>
                <span className="text-emerald-400 font-medium">Within 3-5 business days</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="mt-6 px-8 py-3 bg-white text-black font-semibold text-xs rounded-xl hover:bg-neutral-200 transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6 pr-8">
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400 mb-1">
                <Building2 size={14} className="text-neutral-500" />
                <span>{lab.institution}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif text-white tracking-tight">
                Express Interest to {lab.name}
              </h2>
              <p className="text-neutral-400 text-xs mt-1.5 leading-relaxed">
                Connect your frontier project with this lab's experimental infrastructure, researchers, and active wet-lab capabilities.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium">
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-300">
                    Your Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    required
                    value={applicantName}
                    onChange={(e) => {
                      setApplicantName(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="e.g. Dr. Calista Peng"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-white/30 transition-all placeholder:text-neutral-600"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-300">
                    Contact Email <span className="text-rose-400">*</span>
                  </label>
                  <input
                    required
                    type="email"
                    value={applicantEmail}
                    onChange={(e) => {
                      setApplicantEmail(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="you@institution.edu"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-white/30 transition-all placeholder:text-neutral-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-300">Affiliation / Organization</label>
                  <input
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="e.g. Stanford Bio-X / Biotech Startup"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-white/30 transition-all placeholder:text-neutral-600"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-300">
                    Collaboration Type <span className="text-rose-400">*</span>
                  </label>
                  <select
                    required
                    value={collaborationType}
                    onChange={(e) => {
                      setCollaborationType(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#18181b] border border-white/10 text-white text-xs outline-none focus:border-white/30 transition-all"
                  >
                    <option value="Joint Experimental Validation">Joint Experimental Validation</option>
                    <option value="Hardware / Microfluidic Capacity Access">Hardware / Microfluidic Capacity Access</option>
                    <option value="Computational Modeling & Screening">Computational Modeling & Screening</option>
                    <option value="Co-authored Grant Application">Co-authored Grant Application</option>
                    <option value="Industrial Sponsorship">Industrial Sponsorship</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-300">
                  Proposed Topic or Idea Title <span className="text-rose-400">*</span>
                </label>
                <input
                  required
                  value={proposedProjectTitle}
                  onChange={(e) => {
                    setProposedProjectTitle(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="e.g. In Vivo Validation of Self-Assembling Photo-crosslinkable Neuro-Hydrogel"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-white/30 transition-all placeholder:text-neutral-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-300">
                  Collaboration Proposal & Technical Needs <span className="text-rose-400">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={projectSummary}
                  onChange={(e) => {
                    setProjectSummary(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="Describe what biological problem you are solving, your current progress, and what specific capability of this lab you wish to leverage..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-white/30 transition-all placeholder:text-neutral-600 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl text-neutral-400 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-white hover:bg-neutral-200 text-black font-semibold text-xs rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    'Dispatching...'
                  ) : (
                    <>
                      <Send size={14} />
                      <span>Submit Expression of Interest</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
}
