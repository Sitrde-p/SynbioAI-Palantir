/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, ArrowRight } from 'lucide-react';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignUpModal({ isOpen, onClose }: SignUpModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-8 bg-neutral-950 border border-white/5 rounded-[32px] z-[101] shadow-2xl"
          >
            <button 
              onClick={onClose}
              className="absolute right-6 top-6 p-2 hover:bg-white/5 rounded-full text-neutral-500 hover:text-white transition-all"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-white tracking-tighter mb-2">Create Account</h2>
              <p className="text-neutral-500 text-sm">Join the global scientific imagination marketplace.</p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600" size={18} />
                <input 
                  type="text" 
                  placeholder="Full Name"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-white/20 transition-all placeholder:text-neutral-600"
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600" size={18} />
                <input 
                  type="email" 
                  placeholder="Email Address"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-white/20 transition-all placeholder:text-neutral-600"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600" size={18} />
                <input 
                  type="password" 
                  placeholder="Password"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-white/20 transition-all placeholder:text-neutral-600"
                />
              </div>

              <button className="w-full py-4 bg-white text-black rounded-2xl font-bold hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 group mt-4">
                Sign Up
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-xs text-neutral-600">
                Already have an account? <button className="text-white hover:underline">Log in</button>
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
