/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Heart, MessageCircle, MapPin, Calendar, Trash2, Bookmark } from 'lucide-react';
import { ImaginationNote } from '../types';

interface ImaginationCardProps {
  note: ImaginationNote;
  onCollaborate: (note: ImaginationNote) => void;
  onSelectNote: (note: ImaginationNote) => void;
  onToggleLike: (noteId: string) => void;
  onToggleSave?: (noteId: string) => void;
  onDeleteNote?: (noteId: string) => void;
}

const ImaginationCard: React.FC<ImaginationCardProps> = ({
  note,
  onCollaborate,
  onSelectNote,
  onToggleLike,
  onToggleSave,
  onDeleteNote
}) => {
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

  const formatShortDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return isoString;
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      onClick={() => onSelectNote(note)}
      className="bg-[#0b0b0e] rounded-[22px] overflow-hidden border border-white/10 hover:border-white/25 transition-all duration-300 group flex flex-col h-full cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-white/[0.03]"
    >
      {/* Cover Image & Overlay */}
      <div className="relative aspect-[16/10] overflow-hidden bg-neutral-900">
        <img
          src={note.image}
          alt={note.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        {/* Top Badges: Domain badge on the left */}
        <div className="absolute top-3 left-3 flex items-center">
          <span className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-tight border ${getDomainColor(note.domain)}`}>
            {note.domain}
          </span>
        </div>

        {/* Delete Button on Cover (if onDeleteNote is provided) */}
        {onDeleteNote && (
          <button
            type="button"
            title="Delete this idea"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteNote(note.id);
            }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/70 hover:bg-rose-600/90 text-neutral-400 hover:text-white flex items-center justify-center border border-white/10 hover:border-rose-500/50 backdrop-blur-md transition-all shadow-md active:scale-95 group/del z-10 opacity-75 group-hover:opacity-100"
          >
            <Trash2 size={13} className="group-hover/del:scale-110 transition-transform" />
          </button>
        )}

        {/* Quick Collaborate Action Overlay on Hover */}
        <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCollaborate(note);
            }}
            className="w-full py-2.5 bg-white text-black rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-neutral-200 transition-all shadow-lg active:scale-95"
          >
            Collaborate
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-grow space-y-3">
        {/* Professional Sub-tags */}
        <div className="flex flex-wrap gap-1.5">
          {note.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-medium text-neutral-400 bg-white/5 px-2 py-0.5 rounded-md border border-white/5"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-white leading-snug line-clamp-2 tracking-tight group-hover:text-blue-300 transition-colors">
          {note.title}
        </h3>

        {/* Short Abstract */}
        <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
          {note.description}
        </p>

        {/* Location & Time Stamp */}
        <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-1">
          <div className="flex items-center gap-1 truncate max-w-[65%]">
            <MapPin size={11} className="shrink-0 text-neutral-600" />
            <span className="truncate">{note.location}</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Calendar size={11} className="text-neutral-600" />
            <span>{formatShortDate(note.createdAt)}</span>
          </div>
        </div>

        {/* Card Footer */}
        <div className="mt-auto pt-3.5 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src={note.author.avatar}
              alt={note.author.name}
              className="w-6 h-6 rounded-full border border-white/10 object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-neutral-200 leading-none">{note.author.name}</span>
              <span className="text-[9px] text-neutral-500 mt-0.5 truncate max-w-[130px]">{note.author.role}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-neutral-500">
            {onToggleSave && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSave(note.id);
                }}
                title={note.isSaved ? 'Remove from saved' : 'Save to bookmarks'}
                className={`flex items-center gap-1 p-1 rounded-md transition-colors cursor-pointer ${
                  note.isSaved ? 'text-amber-400' : 'hover:text-white'
                }`}
              >
                <Bookmark
                  size={14}
                  className={note.isSaved ? 'fill-amber-400 text-amber-400' : ''}
                />
              </button>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleLike(note.id);
              }}
              className={`flex items-center gap-1 p-1 rounded-md transition-colors ${
                note.isLiked ? 'text-rose-400' : 'hover:text-white'
              }`}
            >
              <Heart
                size={14}
                className={note.isLiked ? 'fill-rose-500 text-rose-500' : ''}
              />
              <span className="text-[11px] font-medium">{note.likes}</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectNote(note);
              }}
              className="flex items-center gap-1 p-1 rounded-md hover:text-white transition-colors"
            >
              <MessageCircle size={14} />
              <span className="text-[11px] font-medium">
                {note.commentsList ? note.commentsList.length : note.comments}
              </span>
            </button>

            {onDeleteNote && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteNote(note.id);
                }}
                title="Delete this idea"
                className="flex items-center p-1 rounded-md text-neutral-500 hover:text-rose-400 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ImaginationCard;
