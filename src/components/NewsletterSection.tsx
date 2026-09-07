/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Check, Copy, CheckCircle2, QrCode, X } from 'lucide-react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSocialModal, setActiveSocialModal] = useState<'wechat' | 'qq' | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubscribed(true);
      setEmail('');
    }, 600);
  };

  const handleCopyQQ = () => {
    navigator.clipboard?.writeText('784920153');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative w-full bg-[#121216] border-y border-white/5 py-24 px-4 overflow-hidden">
      {/* Subtle background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-white/[0.02] blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-3xl mx-auto text-center relative z-10 space-y-8">
        {/* Pure icon matching top-left logo and Fig 6 - moderately sized */}
        <div className="inline-flex items-center justify-center">
          <div className="w-14 h-14 bg-neutral-900 rounded-xl flex items-center justify-center text-white border border-white/15 shadow-md">
            <div className="w-5 h-5 border-[2.5px] border-white rounded-full" />
          </div>
        </div>

        {/* Elegant Serif Title matching Fig 5 - sized comfortably larger than the subscription box */}
        <div className="space-y-4">
          <h2 className="text-3xl sm:text-4xl md:text-[42px] lg:text-[46px] font-serif text-white tracking-tight leading-[1.18] max-w-xl mx-auto font-normal">
            <span className="block">One email a week, with</span>
            <span className="block">the best of what came in</span>
          </h2>
        </div>

        {/* Email Subscription Box */}
        <div className="max-w-md mx-auto">
          {isSubscribed ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={18} />
              <span>Thank you for subscribing! The latest frontier issue has been sent to your inbox.</span>
            </motion.div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative flex items-center">
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3.5 bg-neutral-900/90 border border-white/10 rounded-xl text-white text-sm placeholder:text-neutral-500 outline-none focus:border-white/30 transition-all shadow-inner"
                />
              </div>

              {/* Terracotta Warm Accent Button matching Fig 5 */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-[#c24b2a] hover:bg-[#b03f20] active:bg-[#9d361b] text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-[#c24b2a]/20 flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                {isLoading ? (
                  <span>Subscribing...</span>
                ) : (
                  <span>Subscribe</span>
                )}
              </button>
            </form>
          )}

          <p className="text-xs text-neutral-500 mt-4 leading-relaxed">
            Want to bring your breakthrough to the global wet-lab network?{' '}
            <span className="text-neutral-400 underline underline-offset-2 cursor-pointer hover:text-white transition-colors">
              Explore our open research programs.
            </span>
          </p>
        </div>

        {/* Pure Text Social Links (matching Fig 5) - without boxes or icons */}
        <div className="pt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs sm:text-sm text-neutral-400 font-medium">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            X (Twitter)
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            Instagram
          </a>
          <button
            onClick={() => setActiveSocialModal('wechat')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            WeChat Official
          </button>
          <button
            onClick={() => setActiveSocialModal('qq')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            QQ Group
          </button>
        </div>
      </div>

      {/* Social Modal / QR Popups */}
      <AnimatePresence>
        {activeSocialModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveSocialModal(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[150]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-sm bg-[#0e0e12] border border-white/10 rounded-3xl p-6 shadow-2xl z-[151] text-center space-y-4"
            >
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <h4 className="text-sm font-bold text-white">
                  {activeSocialModal === 'wechat' ? 'Follow SynbioAI Official WeChat' : 'Join SynbioAI Research Group'}
                </h4>
                <button
                  onClick={() => setActiveSocialModal(null)}
                  className="p-1 hover:bg-white/10 rounded-full text-neutral-400 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {activeSocialModal === 'wechat' ? (
                <div className="space-y-3 py-2">
                  <div className="w-44 h-44 mx-auto bg-white p-3 rounded-2xl flex items-center justify-center shadow-lg">
                    {/* Stylized QR Code placeholder */}
                    <div className="w-full h-full border-4 border-black/80 p-2 flex flex-col justify-between items-center text-black">
                      <QrCode size={110} className="text-black mx-auto" />
                      <span className="text-[10px] font-mono font-bold tracking-wider">SCAN WITH WECHAT</span>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-400">
                    Search on WeChat: <span className="text-white font-mono font-bold">SynbioAI-Palantir</span>
                  </p>
                  <p className="text-[11px] text-neutral-400 leading-normal">
                    Welcome to follow us. Curated frontier research topics delivered weekly.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 py-3 text-center">
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <p className="text-xs text-neutral-400">Official Academic Exchange QQ Group:</p>
                    <p className="text-base font-mono font-medium text-neutral-300 tracking-wider">
                      (To be announced · In preparation)
                    </p>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed max-w-xs mx-auto">
                    The official exchange group is currently being organized. Once active, the group ID and entry verification guidelines will be posted here.
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
