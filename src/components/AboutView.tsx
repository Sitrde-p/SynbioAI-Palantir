/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Microscope, Rocket, CheckCircle2, ArrowRight } from 'lucide-react';

interface AboutViewProps {
  onNavigateToInspiration?: () => void;
  onNavigateToTeams?: () => void;
}

export default function AboutView({
  onNavigateToInspiration,
  onNavigateToTeams,
}: AboutViewProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg('Please fill in all fields before sending your message.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setIsSent(false), 5000);
    }, 600);
  };

  return (
    <div className="min-h-screen pt-32 pb-28 px-4 sm:px-6 lg:px-12 bg-black text-white selection:bg-white selection:text-black">
      <div className="max-w-4xl mx-auto">
        {/* Section 1: Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 sm:mb-16"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-white tracking-tight mb-4 font-normal">
            Who we are
          </h1>
          <p className="text-xl sm:text-2xl text-neutral-400 font-light tracking-tight">
            Bringing bold ideas to life.
          </p>
        </motion.div>

        {/* Section 2: Mission Statement (Unboxed, clean natural typography) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-20 max-w-3xl mx-auto text-center"
        >
          <p className="text-lg sm:text-xl md:text-2xl text-neutral-300 font-normal leading-relaxed">
            SynbioAI Palantir builds the bridge between bold ideas and the research teams who can bring them to life. Anyone can submit a frontier idea. Partner labs take on promising concepts and turn them into real-world projects, experiments, and breakthroughs.
          </p>
        </motion.div>

        {/* Value Proposition Highlights (Preserved 3 Cards) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-28"
        >
          <div className="p-6 sm:p-7 bg-[#111114] border border-white/5 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white mb-4">
                <Sparkles size={18} />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">Open Frontier Ideas</h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                Anyone can submit a bold idea and gain visibility across the community.
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-7 bg-[#111114] border border-white/5 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white mb-4">
                <Microscope size={18} />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">Partner Laboratories</h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                Research teams evaluate promising proposals and provide the expertise to make them real.
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-7 bg-[#111114] border border-white/5 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white mb-4">
                <Rocket size={18} />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">From Idea to Impact</h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                We connect visionaries with the teams who can turn concepts into experiments, projects, and real-world outcomes.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Section 3: Contact Form (Unified Typography) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-4xl sm:text-5xl font-serif text-white tracking-tight font-normal">
              Contact Our Team
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base mt-3 leading-relaxed">
              Have a question or feedback? We'd love to hear from you.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMsg && (
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs font-medium">
                {errorMsg}
              </div>
            )}

            {isSent && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl text-xs sm:text-sm font-medium flex items-center gap-2.5">
                <CheckCircle2 size={18} className="shrink-0" />
                <span>Thank you! Your message has been sent to our team. We'll be in touch soon.</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-neutral-200 mb-2">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your name"
                className="w-full px-4 py-3.5 bg-[#1c1c1f] text-white placeholder-neutral-500 rounded-2xl border border-white/10 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/30 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-200 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
                className="w-full px-4 py-3.5 bg-[#1c1c1f] text-white placeholder-neutral-500 rounded-2xl border border-white/10 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/30 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-200 mb-2">
                Message
              </label>
              <textarea
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="What can we help you with?"
                className="w-full px-4 py-3.5 bg-[#1c1c1f] text-white placeholder-neutral-500 rounded-2xl border border-white/10 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/30 transition-all text-sm resize-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-white hover:bg-neutral-200 text-black font-semibold text-sm rounded-full transition-all shadow-lg active:scale-[0.99] disabled:opacity-50 cursor-pointer text-center"
              >
                {isSubmitting ? 'Sending Message...' : 'Send Message'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

