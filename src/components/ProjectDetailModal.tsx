/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, MessageCircle, MapPin, Calendar, Send, User, CheckCircle2, Bookmark } from 'lucide-react';
import { ImaginationNote, CommentItem } from '../types';

interface ProjectDetailModalProps {
  note: ImaginationNote | null;
  isOpen: boolean;
  onClose: () => void;
  onCollaborate: (note: ImaginationNote) => void;
  onToggleLike: (noteId: string) => void;
  onToggleSave?: (noteId: string) => void;
  onAddComment: (noteId: string, comment: CommentItem) => void;
}

export default function ProjectDetailModal({
  note,
  isOpen,
  onClose,
  onCollaborate,
  onToggleLike,
  onToggleSave,
  onAddComment
}: ProjectDetailModalProps) {
  const [commentText, setCommentText] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentRole, setCommentRole] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessTip, setShowSuccessTip] = useState(false);

  if (!note) return null;

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return isoString;
    }
  };

  const getDomainColor = (domain: string) => {
    switch (domain) {
      case 'Biomedicine':
        return 'bg-[#200a12] text-rose-300 border-rose-500/70 shadow-md';
      case 'AI & Computing':
        return 'bg-[#081b2e] text-sky-300 border-sky-500/70 shadow-md';
      case 'Synthetic Biology':
        return 'bg-[#042017] text-emerald-300 border-emerald-500/70 shadow-md';
      case 'Neurotech':
        return 'bg-[#180a2b] text-purple-300 border-purple-500/70 shadow-md';
      case 'Clean Biomanufacturing':
        return 'bg-[#051f22] text-teal-300 border-teal-500/70 shadow-md';
      default:
        return 'bg-[#151518] text-neutral-200 border-white/20 shadow-md';
    }
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    const newComment: CommentItem = {
      id: `c_${Date.now()}`,
      author: commentAuthor.trim() || 'Visiting Fellow',
      role: commentRole.trim() || 'Frontier Researcher',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
      content: commentText.trim(),
      createdAt: new Date().toISOString()
    };

    setTimeout(() => {
      onAddComment(note.id, newComment);
      setCommentText('');
      setIsSubmitting(false);
      setShowSuccessTip(true);
      setTimeout(() => setShowSuccessTip(false), 2500);
    }, 200);
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
            className="fixed inset-0 bg-black/85 backdrop-blur-md z-[110]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[94vw] max-w-4xl max-h-[92vh] bg-[#0c0c0f] border border-white/10 rounded-[32px] shadow-2xl z-[111] overflow-hidden flex flex-col"
          >
            {/* Header with Close */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#0c0c0f]/90 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getDomainColor(note.domain)}`}>
                  {note.domain}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors text-neutral-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-8 custom-scrollbar">
              {/* Image & Title Header */}
              <div className="space-y-6">
                <div className="relative aspect-[21/9] w-full rounded-2xl overflow-hidden border border-white/10 bg-neutral-900">
                  <img
                    src={note.image}
                    alt={note.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-neutral-300">
                    <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                      <MapPin size={13} className="text-neutral-400" />
                      <span>{note.location}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                      <Calendar size={13} className="text-neutral-400" />
                      <span>{formatDate(note.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug mb-3">
                    {note.title}
                  </h2>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {note.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-neutral-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Author & Action Bar */}
              <div className="p-5 rounded-2xl bg-neutral-900/60 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={note.author.avatar}
                    alt={note.author.name}
                    className="w-12 h-12 rounded-full border border-white/15 object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="font-bold text-white text-base flex items-center gap-2">
                      {note.author.name}
                      <span className="text-xs font-normal text-neutral-400">({note.author.role})</span>
                    </div>
                    {note.author.institution && (
                      <p className="text-xs text-neutral-500 mt-0.5">{note.author.institution}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {onToggleSave && (
                    <button
                      type="button"
                      onClick={() => onToggleSave(note.id)}
                      className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                        note.isSaved
                          ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                          : 'bg-white/5 border-white/10 text-neutral-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Bookmark size={16} className={note.isSaved ? 'fill-amber-400 text-amber-400' : ''} />
                      <span>{note.isSaved ? 'Saved' : 'Save'}</span>
                    </button>
                  )}

                  <button
                    onClick={() => onToggleLike(note.id)}
                    className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                      note.isLiked
                        ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                        : 'bg-white/5 border-white/10 text-neutral-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Heart size={16} className={note.isLiked ? 'fill-rose-400 text-rose-400' : ''} />
                    <span>{note.likes}</span>
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      onCollaborate(note);
                    }}
                    className="flex-1 sm:flex-initial px-6 py-2.5 bg-white text-black font-bold text-sm rounded-xl hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-lg shadow-white/5 active:scale-95"
                  >
                    Collaborate
                  </button>
                </div>
              </div>

              {/* Research Description / Deep Dive */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-wider">
                  Project Scope & Research Roadmap
                </h3>
                <div className="p-6 rounded-2xl bg-neutral-900/30 border border-white/5 text-neutral-300 text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-4">
                  {note.fullDetails || note.description}
                </div>
              </div>

              {/* Comments Section */}
              <div className="pt-6 border-t border-white/10 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <MessageCircle size={18} className="text-neutral-400" />
                    Academic Peer Discussion & Inquiries ({note.commentsList ? note.commentsList.length : note.comments})
                  </h3>
                  {showSuccessTip && (
                    <span className="text-xs text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 size={13} /> Comment successfully posted
                    </span>
                  )}
                </div>

                {/* Comment Input Form */}
                <form onSubmit={handleSubmitComment} className="p-4 rounded-2xl bg-neutral-900/50 border border-white/10 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="relative">
                      <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                      <input
                        type="text"
                        placeholder="Your Name / Affiliation (e.g. Dr. Jennifer Vance · Oxford)"
                        value={commentAuthor}
                        onChange={(e) => setCommentAuthor(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-white/30 transition-all placeholder:text-neutral-500"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Your Research Focus (e.g. Catalytic Kinetics / Nanomaterials)"
                      value={commentRole}
                      onChange={(e) => setCommentRole(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-white/30 transition-all placeholder:text-neutral-500"
                    />
                  </div>

                  <div className="relative">
                    <textarea
                      rows={3}
                      placeholder="Share your peer-review inquiry, technical suggestion, or experimental collaboration intent..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="w-full p-3 text-sm bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-white/30 transition-all resize-none placeholder:text-neutral-500"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting || !commentText.trim()}
                      className="px-5 py-2 bg-white text-black rounded-xl font-bold text-xs hover:bg-neutral-200 transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                    >
                      {isSubmitting ? 'Posting...' : 'Post Comment'}
                      <Send size={13} />
                    </button>
                  </div>
                </form>

                {/* Comments List */}
                <div className="space-y-3">
                  {note.commentsList && note.commentsList.length > 0 ? (
                    note.commentsList.map((c) => (
                      <div
                        key={c.id}
                        className="p-4 rounded-xl bg-neutral-900/30 border border-white/5 space-y-2 hover:border-white/10 transition-colors"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={c.avatar}
                              alt={c.author}
                              className="w-6 h-6 rounded-full border border-white/10 object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <span className="font-bold text-white">{c.author}</span>
                            <span className="text-neutral-500">·</span>
                            <span className="text-neutral-400">{c.role}</span>
                          </div>
                          <span className="text-neutral-600 text-[11px]">{formatDate(c.createdAt)}</span>
                        </div>
                        <p className="text-sm text-neutral-300 leading-relaxed pl-8">{c.content}</p>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-xs text-neutral-500 bg-white/5 rounded-xl border border-dashed border-white/10">
                      No peer inquiries yet. Be the first to share your scientific perspective!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
