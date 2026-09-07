/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  onPost: () => void;
}

export default function Hero({ onPost }: HeroProps) {
  // Try local first, with a fallback to the network CDN
  const [videoSrc, setVideoSrc] = useState('./Agent-wave.mp4');

  const handleVideoError = () => {
    const networkFallback = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260818_072341_50851634-bbc3-4c33-9acc-7647d4db44aa.mp4';
    if (videoSrc !== networkFallback) {
      console.warn('Local video failed to load. Falling back to CDN video.');
      setVideoSrc(networkFallback);
    }
  };

  return (
    <section className="relative h-screen min-h-[640px] w-full px-4 text-center overflow-hidden bg-black flex items-center justify-center">
      {/* Background Video extending all the way to the top of the page */}
      <video
        key={videoSrc}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        src={videoSrc}
        onError={handleVideoError}
      />

      {/* Vertical gradient overlay: linear-gradient(to bottom, rgba(0,0,0,0.32), rgba(0,0,0,0)) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/[0.32] to-transparent pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="relative z-10 max-w-5xl mx-auto"
      >
        <h1 className="text-5xl md:text-7xl font-serif text-white mb-8 leading-[1.1] selection:bg-white selection:text-black italic drop-shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
          From Idea to Impact
        </h1>
        
        <p className="text-lg text-neutral-300 max-w-3xl mx-auto mb-16 leading-relaxed font-medium drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
          The global marketplace for scientific imagination. <br className="hidden md:block" />
          Connecting visionary minds with world-class research teams.
        </p>

        <div className="flex items-center justify-center">
          <button 
            onClick={() => onPost()}
            className="px-10 py-4 bg-white text-black rounded-full font-bold hover:bg-neutral-200 transition-all shadow-2xl shadow-white/10 flex items-center justify-center gap-2 group cursor-pointer"
          >
            Post Idea
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </motion.div>
    </section>
  );
}
