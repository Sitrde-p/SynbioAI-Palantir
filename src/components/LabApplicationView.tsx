/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Building2,
  MapPin,
  Mail,
  User,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  FlaskConical,
  Phone,
  FileText,
  HelpCircle,
} from 'lucide-react';

interface LabApplicationViewProps {
  onBack: () => void;
  onSubmittedToast?: (msg: string) => void;
}

export default function LabApplicationView({
  onBack,
  onSubmittedToast,
}: LabApplicationViewProps) {
  const [labName, setLabName] = useState('');
  const [institution, setInstitution] = useState('');
  const [domain, setDomain] = useState('Synthetic Biology');
  const [researchDirections, setResearchDirections] = useState('');
  const [teamSummary, setTeamSummary] = useState('');
  const [pastProjects, setPastProjects] = useState('');
  const [leadPI, setLeadPI] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // UI placeholder per prompt requirement: 表单仅UI占位，提交功能暂不实现
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      if (onSubmittedToast) {
        onSubmittedToast('Laboratory onboarding application submitted for editorial review.');
      }
    }, 600);
  };

  return (
    <div className="min-h-screen pt-28 pb-24 px-4 sm:px-6 lg:px-12 bg-black text-white">
      <div className="max-w-3xl mx-auto">
        {/* Navigation back */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors mb-8 cursor-pointer group"
        >
          <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Teams</span>
        </button>

        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white tracking-tight mb-4 font-normal">
            Lab Application
          </h1>
          <p className="text-neutral-400 text-sm leading-relaxed max-w-2xl">
            Register your university laboratory, institute, or private foundry to join the SynbioAI Palantir ecosystem. Connect with global frontier proposals seeking experimental validation.
          </p>
        </header>

        {isSubmitted ? (
          <div className="p-8 sm:p-12 rounded-3xl bg-[#0f0f12] border border-white/10 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="text-2xl font-serif text-white tracking-tight">
              Application Received (Review Pending)
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
              Thank you for applying to onboard <span className="text-white font-semibold">{labName || 'your research lab'}</span>. Our scientific committee verifies facility credentials, biosafety certifications, and publication metrics.
            </p>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 max-w-md mx-auto text-xs text-neutral-300 text-left space-y-1">
              <div className="flex justify-between">
                <span className="text-neutral-500">Status:</span>
                <span className="text-amber-400 font-medium">Under Editorial Verification</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Estimated Review:</span>
                <span>3 - 7 business days</span>
              </div>
            </div>
            <div className="pt-4 flex justify-center gap-4">
              <button
                onClick={onBack}
                className="px-6 py-2.5 bg-white hover:bg-neutral-200 text-black text-xs font-semibold rounded-xl transition-all cursor-pointer"
              >
                Return to Network
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1: Lab & Affiliation */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0e0e11] border border-white/10 space-y-5">
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <Building2 size={16} className="text-neutral-400" />
                <span>Laboratory & Affiliation</span>
              </h2>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-300">
                    Laboratory Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    required
                    value={labName}
                    onChange={(e) => setLabName(e.target.value)}
                    placeholder="e.g. Center for Synthetic Genomics & Bio-Foundry"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-white/30 transition-all placeholder:text-neutral-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-300">
                      Affiliated Institution / University <span className="text-rose-400">*</span>
                    </label>
                    <input
                      required
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      placeholder="e.g. Oxford Institute of Molecular Medicine"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-white/30 transition-all placeholder:text-neutral-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-300">
                      Primary Scientific Domain <span className="text-rose-400">*</span>
                    </label>
                    <select
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#18181b] border border-white/10 text-white text-xs outline-none focus:border-white/30 transition-all"
                    >
                      <option value="Synthetic Biology">Synthetic Biology</option>
                      <option value="Biomedicine">Biomedicine</option>
                      <option value="AI & Computing">AI & Computing</option>
                      <option value="Neurotech">Neurotech</option>
                      <option value="Clean Biomanufacturing">Clean Biomanufacturing</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-300">
                    Research Directions & Core Capabilities <span className="text-rose-400">*</span>
                  </label>
                  <input
                    required
                    value={researchDirections}
                    onChange={(e) => setResearchDirections(e.target.value)}
                    placeholder="e.g. Directed Evolution, Deep Proteomics, Automated Acoustic Liquid Handling"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-white/30 transition-all placeholder:text-neutral-600"
                  />
                  <p className="text-[11px] text-neutral-500">
                    Comma separated list of research axes your lab specializes in.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2: Team & Past Projects */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0e0e11] border border-white/10 space-y-5">
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <FileText size={16} className="text-neutral-400" />
                <span>Team Profile & Past Projects</span>
              </h2>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-300">
                    Team Overview & Lab Scale <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={teamSummary}
                    onChange={(e) => setTeamSummary(e.target.value)}
                    placeholder="Briefly describe your principal investigators, staff scientists, postdoctoral fellows, and key wet-lab equipment..."
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-white/30 transition-all placeholder:text-neutral-600 resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-300">
                    Representative Past Projects & Publications
                  </label>
                  <textarea
                    rows={3}
                    value={pastProjects}
                    onChange={(e) => setPastProjects(e.target.value)}
                    placeholder="e.g. 1. De novo biosynthesis of taxadiene in engineered Y. lipolytica (Nature Biotech 2024)..."
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-white/30 transition-all placeholder:text-neutral-600 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Contact Details */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0e0e11] border border-white/10 space-y-5">
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <Mail size={16} className="text-neutral-400" />
                <span>Principal Contact & Coordination</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-300">
                    Lead Principal Investigator (PI) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    required
                    value={leadPI}
                    onChange={(e) => setLeadPI(e.target.value)}
                    placeholder="e.g. Prof. Jonathan Sterling"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-white/30 transition-all placeholder:text-neutral-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-300">
                    Institutional Contact Email <span className="text-rose-400">*</span>
                  </label>
                  <input
                    required
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="lab-pi@institution.edu"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-white/30 transition-all placeholder:text-neutral-600"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-300">Phone / Direct Line (Optional)</label>
                <input
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+1 (617) 555-0199"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-white/30 transition-all placeholder:text-neutral-600"
                />
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-[11px] text-neutral-500">
                Submissions are reviewed in accordance with open-science biological compliance protocols.
              </span>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onBack}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl text-neutral-400 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-7 py-3 bg-white hover:bg-neutral-200 text-black font-semibold text-xs rounded-xl transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting Application...' : 'Submit Lab Application'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
