import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-[101]"
          >
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-white transition-colors" size={24} />
              <input
                autoFocus
                type="text"
                placeholder="Search prompts by name or keyword..."
                className="w-full bg-neutral-900/50 border border-white/10 rounded-2xl py-6 pl-16 pr-8 text-xl text-white outline-none focus:border-white/20 focus:bg-neutral-900 transition-all placeholder:text-neutral-600"
              />
              <button 
                onClick={onClose}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-full text-neutral-400 hover:text-white transition-all"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-[4/3] rounded-xl bg-neutral-900 border border-white/5 overflow-hidden group cursor-pointer hover:border-white/20 transition-all">
                  <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-black p-4 flex flex-col justify-end">
                    <p className="text-xs font-bold text-neutral-500 group-hover:text-white transition-colors">RECENT SEARCH {i}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
