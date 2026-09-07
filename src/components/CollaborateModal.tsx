/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Globe, User, Mail, Building2, Phone, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { ImaginationNote } from '../types';

interface CollaborateModalProps {
  note: ImaginationNote | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess?: () => void;
}

export default function CollaborateModal({
  note,
  isOpen,
  onClose,
  onSubmitSuccess
}: CollaborateModalProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    institution: '',
    contact: '',
    interestReason: '',
    resourceContribution: 'Compute & AI Model Architecture'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!note) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      if (onSubmitSuccess) onSubmitSuccess();
      setTimeout(() => {
        setIsSubmitted(false);
        onClose();
      }, 2000);
    }, 800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md z-[120]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-xl bg-[#0c0c0f] border border-white/10 rounded-[32px] shadow-2xl z-[121] overflow-hidden flex flex-col max-h-[92vh]"
          >
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#0c0c0f]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Globe size={16} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">Request Research Collaboration</h3>
                  <p className="text-[11px] text-neutral-500">Connect with the project lead and explore joint research</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-neutral-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
              {isSubmitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                    <CheckCircle2 size={36} />
                  </div>
                  <h4 className="text-xl font-bold text-white">Collaboration Request Delivered!</h4>
                  <p className="text-sm text-neutral-400 max-w-sm mx-auto leading-relaxed">
                    Your research proposal and contact details have been forwarded to{' '}
                    <span className="text-white font-semibold">{note.author.name}</span>'s team. The project lead will reach out via email.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Target project brief */}
                  <div className="p-4 rounded-2xl bg-neutral-900/70 border border-white/10 flex items-start gap-3.5">
                    <img
                      src={note.author.avatar}
                      alt={note.author.name}
                      className="w-10 h-10 rounded-full border border-white/10 object-cover shrink-0 mt-0.5"
                      referrerPolicy="no-referrer"
                    />
                    <div className="text-xs space-y-1">
                      <p className="text-neutral-400">
                        Applying to join the research project led by <span className="text-white font-bold">{note.author.name}</span>:
                      </p>
                      <p className="font-semibold text-white line-clamp-1">{note.title}</p>
                      <p className="text-[11px] text-neutral-500">{note.location}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                          <User size={13} className="text-neutral-500" /> Full Name <span className="text-rose-400">*</span>
                        </label>
                        <input
                          required
                          type="text"
                          placeholder="e.g. Dr. Arthur Vance"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-xs bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-white/30 transition-all placeholder:text-neutral-600"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                          <Mail size={13} className="text-neutral-500" /> Email Address <span className="text-rose-400">*</span>
                        </label>
                        <input
                          required
                          type="email"
                          placeholder="academic@university.edu"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-xs bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-white/30 transition-all placeholder:text-neutral-600"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                          <Building2 size={13} className="text-neutral-500" /> Institution / Laboratory
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Stanford Department of Bioengineering"
                          value={formData.institution}
                          onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-xs bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-white/30 transition-all placeholder:text-neutral-600"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                          <Phone size={13} className="text-neutral-500" /> Contact Info (WeChat / Phone / Telegram)
                        </label>
                        <input
                          type="text"
                          placeholder="Phone number, handle, or ID"
                          value={formData.contact}
                          onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-xs bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-white/30 transition-all placeholder:text-neutral-600"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                        <Sparkles size={13} className="text-neutral-500" /> Resource Contribution Type
                      </label>
                      <select
                        value={formData.resourceContribution}
                        onChange={(e) => setFormData({ ...formData, resourceContribution: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-neutral-900 border border-white/10 rounded-xl text-white outline-none focus:border-white/30 transition-all"
                      >
                        <option value="Compute & AI Model Architecture">Compute & AI Model Architecture Support</option>
                        <option value="Wet-Lab High-Throughput Foundry Capacity">Wet-Lab High-Throughput Biofoundry Capacity</option>
                        <option value="Animal Models & Clinical Translation">Animal Models & Clinical Translation Pipeline</option>
                        <option value="Principal Investigator Joint Grant Application">Principal Investigator Joint Grant Application</option>
                        <option value="Angel Capital & Incubation Pipeline">Angel Capital & Incubation Pipeline</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-300">
                        Why are you interested in this project? What academic/engineering contributions can you offer? <span className="text-rose-400">*</span>
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Briefly state your research background, technical perspective on the hypothesis, and prospective division of work (e.g. experimental validation, algorithmic modeling, co-authorship)..."
                        value={formData.interestReason}
                        onChange={(e) => setFormData({ ...formData, interestReason: e.target.value })}
                        className="w-full p-3.5 text-xs bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-white/30 transition-all resize-none placeholder:text-neutral-600 leading-relaxed"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-5 py-2.5 text-xs font-semibold text-neutral-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2 disabled:opacity-50 active:scale-95"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Collaboration Request'}
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
