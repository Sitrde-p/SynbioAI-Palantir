/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserAccount, ImaginationNote, LabMatchRequest, UserInterest, InterestStatus } from '../types';
import ImaginationCard from './ImaginationCard';
import {
  Sparkles,
  Plus,
  Bookmark,
  ExternalLink,
  MessageSquare,
  Building2,
  CheckCircle2,
  Clock,
  Send,
  Trash2,
  Settings,
  Bell,
  User,
  Shield,
  Layers,
  FlaskConical,
  Mail,
  ChevronRight,
  ArrowRight,
  XCircle,
} from 'lucide-react';
import { RESEARCH_LABS, ResearchLab } from '../data/mockLabs';

interface DashboardViewProps {
  currentUser: UserAccount;
  savedNotes: ImaginationNote[];
  userSubmissions: ImaginationNote[];
  savedLabs?: ResearchLab[];
  onSelectNote: (note: ImaginationNote) => void;
  onToggleLike: (noteId: string) => void;
  onToggleSave?: (noteId: string) => void;
  onToggleSaveLab?: (labId: string) => void;
  onCollaborate: (note: ImaginationNote) => void;
  onBrowseIdeas: () => void;
  onBrowseLabs?: () => void;
  onPostIdea: () => void;
  onDeleteNote?: (noteId: string) => void;
  onSelectLab?: (lab: ResearchLab) => void;
  onUpdateProfile?: (updated: Partial<UserAccount>) => void;
}

type DashboardTab = 'my-ideas' | 'matches' | 'interests' | 'saved' | 'profile';

const INITIAL_MATCHES: LabMatchRequest[] = [
  {
    id: 'match-1',
    labId: 'lab-1',
    labName: 'Wyss Bio-Robotics & Synthetic Morphogenesis Group',
    institution: 'Harvard University / Wyss Institute',
    ideaId: 'user-idea-1',
    ideaTitle: 'Photo-Crosslinkable Neuro-Hydrogel Scaffolding',
    matchScore: 94,
    status: 'In Discussion',
    labMessage: 'Our microfluidic bioprinting team reviewed your neural scaffold proposal. We have vacant slots in our high-density organoid perfusion suite next month and would welcome exploratory discussions.',
    contactPerson: 'Dr. Jennifer Martinez (Microfluidics Lead)',
    timestamp: '2 hours ago',
  },
  {
    id: 'match-2',
    labId: 'lab-2',
    labName: 'Broad Institute Center for Cell Circuitry & Genomic Design',
    institution: 'Broad Institute of MIT and Harvard',
    ideaId: 'user-idea-2',
    ideaTitle: 'Generative De Novo Allosteric Enzyme Design',
    matchScore: 88,
    status: 'Pending Review',
    labMessage: 'Our deep learning and pooled perturbation cluster is keen to evaluate your sequence-generation priors on our automated acoustic assay platforms.',
    contactPerson: 'Dr. Alexey Morozov (Computational Lead)',
    timestamp: 'Yesterday',
  },
];

export default function DashboardView({
  currentUser,
  savedNotes,
  userSubmissions,
  savedLabs = [],
  onSelectNote,
  onToggleLike,
  onToggleSave,
  onToggleSaveLab,
  onCollaborate,
  onBrowseIdeas,
  onBrowseLabs,
  onPostIdea,
  onDeleteNote,
  onSelectLab,
  onUpdateProfile,
}: DashboardViewProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>('my-ideas');
  const [matches, setMatches] = useState<LabMatchRequest[]>(INITIAL_MATCHES);

  // Profile Settings State
  const [profileName, setProfileName] = useState(currentUser.name || 'Calista Peng');
  const [profileBio, setProfileBio] = useState(
    currentUser.bio ||
      'Synthetic biology researcher focused on computational design, targeted biomaterials, and regenerative medicine interfaces.'
  );
  const [profileAffiliation, setProfileAffiliation] = useState(
    currentUser.affiliation || 'Department of Bioengineering · Fellow'
  );
  const [identityTag, setIdentityTag] = useState(currentUser.identityTag || 'Principal Investigator');
  const [notifyEmail, setNotifyEmail] = useState(currentUser.notifications?.emailUpdates ?? true);
  const [notifyMatches, setNotifyMatches] = useState(currentUser.notifications?.labMatches ?? true);
  const [notifyCollab, setNotifyCollab] = useState(
    currentUser.notifications?.collaborationRequests ?? true
  );
  const [notifyWeekly, setNotifyWeekly] = useState(currentUser.notifications?.weeklyDigest ?? false);
  const [profileSavedToast, setProfileSavedToast] = useState(false);

  // User Interests State & Persistence
  const [userInterests, setUserInterests] = useState<UserInterest[]>(() => {
    try {
      const stored = localStorage.getItem('synbio_user_interests');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load interests from storage', e);
    }
    // Seed initial demo data so tab showcases statuses immediately
    const initial: UserInterest[] = [
      {
        id: 'interest-seed-1',
        labId: 'lab-1',
        labName: 'Wyss Bio-Robotics & Synthetic Morphogenesis Group',
        institution: 'Harvard University / Wyss Institute',
        matchScore: 94,
        status: 'Pending',
        proposedTopic: 'Photo-Crosslinkable Neuro-Hydrogel In Vivo Perfusion Validation',
        collaborationType: 'Joint Experimental Validation',
        projectSummary: 'Requesting access to the high-density organoid perfusion suite and micro-rheology rigs to test hydrogel crosslinking kinetics under in-vivo fluid shear stress.',
        applicantName: currentUser.name || 'Calista Peng',
        applicantEmail: currentUser.email || 'calista.peng@stanford.edu',
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        timestampDisplay: '4 hours ago',
      },
      {
        id: 'interest-seed-2',
        labId: 'lab-2',
        labName: 'Broad Institute Center for Cell Circuitry & Genomic Design',
        institution: 'Broad Institute of MIT and Harvard',
        matchScore: 89,
        status: 'In Discussion',
        proposedTopic: 'Generative De Novo Allosteric Enzyme Screening Pipeline',
        collaborationType: 'Computational Modeling & Screening',
        projectSummary: 'Joint evaluation of AI-generated catalytic motifs on Broad automated acoustic liquid handlers.',
        applicantName: currentUser.name || 'Calista Peng',
        applicantEmail: currentUser.email || 'calista.peng@stanford.edu',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        timestampDisplay: '2 days ago',
      },
    ];
    try {
      localStorage.setItem('synbio_user_interests', JSON.stringify(initial));
    } catch {}
    return initial;
  });

  // Listen for storage and custom events to update interests reactively
  useEffect(() => {
    const handleUpdate = () => {
      try {
        const stored = localStorage.getItem('synbio_user_interests');
        if (stored) {
          setUserInterests(JSON.parse(stored));
        }
      } catch (e) {
        console.error(e);
      }
    };
    window.addEventListener('synbio_interests_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('synbio_interests_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleWithdrawInterest = (id: string) => {
    setUserInterests((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, status: 'Withdrawn' as InterestStatus } : item
      );
      try {
        localStorage.setItem('synbio_user_interests', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const getInterestStatusBadge = (status: InterestStatus) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px] font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Pending
          </span>
        );
      case 'In Discussion':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-[11px] font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            In Discussion
          </span>
        );
      case 'Accepted':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Accepted
          </span>
        );
      case 'Rejected':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[11px] font-semibold">
            Rejected
          </span>
        );
      case 'Withdrawn':
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-neutral-800 text-neutral-400 border border-neutral-700 text-[11px] font-semibold">
            Withdrawn
          </span>
        );
    }
  };

  // Filter Submissions: user-authored ideas
  const myIdeas = userSubmissions.map((note, index) => {
    // Ensure idea has a status badge if not already defined
    const statuses: ('Draft' | 'Under Review' | 'Connecting')[] = [
      'Connecting',
      'Under Review',
      'Draft',
    ];
    return {
      ...note,
      status: note.status || statuses[index % statuses.length],
    };
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateProfile) {
      onUpdateProfile({
        name: profileName,
        bio: profileBio,
        affiliation: profileAffiliation,
        identityTag,
        notifications: {
          emailUpdates: notifyEmail,
          labMatches: notifyMatches,
          collaborationRequests: notifyCollab,
          weeklyDigest: notifyWeekly,
        },
      });
    }
    setProfileSavedToast(true);
    setTimeout(() => setProfileSavedToast(false), 3000);
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'Draft':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-neutral-800 text-neutral-400 border border-neutral-700 text-[11px] font-semibold">
            Draft
          </span>
        );
      case 'Under Review':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px] font-semibold">
            Under Review
          </span>
        );
      case 'Connecting':
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Connecting
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-24 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto">
      {/* Header matching requirements */}
      <div className="mb-10">
        <h1 className="text-4xl sm:text-5xl font-serif text-white tracking-tight mb-2 font-normal">
          Hi, {currentUser.name || 'Calista Peng'}
        </h1>
        <p className="text-neutral-400 text-sm font-medium">
          Manage your ideas, matches & collaborations
        </p>
      </div>

      {/* Tab Navigation: My Ideas, My Interests, Matches, Saved, Profile Settings */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-10">
        <button
          onClick={() => setActiveTab('my-ideas')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'my-ideas'
              ? 'bg-[#e5e5e7] text-black shadow-sm'
              : 'bg-[#18181b] text-neutral-400 hover:text-white border border-white/5'
          }`}
        >
          My Ideas
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] ${
              activeTab === 'my-ideas' ? 'bg-black/10 text-black' : 'bg-white/10 text-neutral-400'
            }`}
          >
            {myIdeas.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('interests')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'interests'
              ? 'bg-[#e5e5e7] text-black shadow-sm'
              : 'bg-[#18181b] text-neutral-400 hover:text-white border border-white/5'
          }`}
        >
          My Interests
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] ${
              activeTab === 'interests' ? 'bg-black/10 text-black' : 'bg-white/10 text-neutral-400'
            }`}
          >
            {userInterests.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('matches')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'matches'
              ? 'bg-[#e5e5e7] text-black shadow-sm'
              : 'bg-[#18181b] text-neutral-400 hover:text-white border border-white/5'
          }`}
        >
          Matches
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] ${
              activeTab === 'matches' ? 'bg-black/10 text-black' : 'bg-white/10 text-neutral-400'
            }`}
          >
            {matches.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'saved'
              ? 'bg-[#e5e5e7] text-black shadow-sm'
              : 'bg-[#18181b] text-neutral-400 hover:text-white border border-white/5'
          }`}
        >
          Saved
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] ${
              activeTab === 'saved' ? 'bg-black/10 text-black' : 'bg-white/10 text-neutral-400'
            }`}
          >
            {savedNotes.length + savedLabs.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-[#e5e5e7] text-black shadow-sm'
              : 'bg-[#18181b] text-neutral-400 hover:text-white border border-white/5'
          }`}
        >
          Profile Settings
        </button>
      </div>

      {/* Tab 1: My Ideas */}
      {activeTab === 'my-ideas' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-serif text-white tracking-tight">
              Published Ideas & Proposals
            </h2>
          </div>

          {myIdeas.length === 0 ? (
            <div className="p-12 sm:p-16 rounded-3xl bg-[#0e0e11] border border-white/10 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 text-neutral-400 flex items-center justify-center mx-auto">
                <Layers size={24} />
              </div>
              <h3 className="text-lg font-serif text-white">No ideas published yet</h3>
              <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
                Share your frontier idea to attract AI-directed lab matches and collaborative partners.
              </p>
              <div className="pt-2">
                <button
                  onClick={onPostIdea}
                  className="px-6 py-3 bg-white hover:bg-neutral-200 text-black text-xs font-semibold rounded-xl transition-all shadow-sm inline-flex items-center gap-2.5 cursor-pointer"
                >
                  <Plus size={16} strokeWidth={2.4} className="shrink-0" />
                  <span>Post Idea</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {myIdeas.map((note) => (
                <div
                  key={note.id}
                  className="p-5 sm:p-6 rounded-2xl bg-[#0c0c0f] border border-white/10 hover:border-white/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div
                    onClick={() => onSelectNote(note)}
                    className="cursor-pointer space-y-2 max-w-3xl"
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                        {note.domain}
                      </span>
                      {getStatusBadge(note.status)}
                      <span className="text-xs text-neutral-500">•</span>
                      <span className="text-xs text-neutral-500">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-white hover:text-neutral-200 transition-colors">
                      {note.title}
                    </h3>

                    <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                      {note.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/5">
                    <button
                      onClick={() => onSelectNote(note)}
                      className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-neutral-300 hover:text-white transition-colors cursor-pointer"
                    >
                      View Details &gt;
                    </button>
                    {onDeleteNote && (
                      <button
                        onClick={() => onDeleteNote(note.id)}
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 transition-colors cursor-pointer"
                        title="Delete Idea"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Matches */}
      {activeTab === 'matches' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-serif text-white tracking-tight">
                AI-Matched Laboratories & Inbound Inquiries
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Laboratories whose experimental axes align with your published research proposals.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold self-start sm:self-auto">
              Auto-Matching Active
            </span>
          </div>

          <div className="space-y-4">
            {matches.map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-2xl bg-[#0c0c0f] border border-white/10 hover:border-white/20 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
                  <div>
                    <h3 className="text-sm font-bold text-white">{item.labName}</h3>
                    <div className="flex items-center gap-2 text-xs text-neutral-400 mt-1">
                      <Building2 size={12} className="text-neutral-500" />
                      <span>{item.institution}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                      {item.matchScore}% Match
                    </span>
                    <span className="text-xs text-neutral-500 font-medium">
                      {item.timestamp}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs text-neutral-400">
                    <span className="text-neutral-500">Matched Proposal:</span>{' '}
                    <span className="text-neutral-200 font-semibold">{item.ideaTitle}</span>
                  </div>

                  {/* 实验室意向留言 (Lab Message) */}
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-xs text-neutral-300 leading-relaxed">
                    <div className="flex items-center gap-1.5 text-neutral-400 mb-1.5 font-bold">
                      <MessageSquare size={13} className="text-neutral-500" />
                      <span>Lab Inquiry Message from {item.contactPerson}:</span>
                    </div>
                    <p className="italic text-neutral-200">"{item.labMessage}"</p>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-neutral-400 font-medium flex items-center gap-1.5">
                    <Clock size={13} className="text-amber-400" />
                    <span>Status: {item.status}</span>
                  </span>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        const targetLab = RESEARCH_LABS.find((l) => l.id === item.labId);
                        if (targetLab && onSelectLab) {
                          onSelectLab(targetLab);
                        }
                      }}
                      className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                    >
                      View Lab Profile &nbsp;&nbsp;&gt;
                    </button>
                    <a
                      href={`mailto:contact@lab.org?subject=Collaboration inquiry regarding ${encodeURIComponent(item.ideaTitle)}`}
                      className="px-4 py-2 bg-white hover:bg-neutral-200 text-black text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                    >
                      <Mail size={13} />
                      <span>Reply to Lab</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: My Interests */}
      {activeTab === 'interests' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-serif text-white tracking-tight">
                My Outbound Interest Expressions
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Collaborative proposals and capacity requests you have dispatched to partner laboratories.
              </p>
            </div>
            <span className="text-xs text-neutral-500 font-medium">
              {userInterests.length} {userInterests.length === 1 ? 'expression' : 'expressions'}
            </span>
          </div>

          {userInterests.length === 0 ? (
            <div className="p-12 sm:p-16 rounded-3xl bg-[#0e0e11] border border-white/10 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 text-neutral-400 flex items-center justify-center mx-auto">
                <Send size={24} />
              </div>
              <h3 className="text-lg font-serif text-white">No active interest expressions</h3>
              <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
                You haven't initiated any interest expressions yet, go explore the Inspiration Square →
              </p>
              <div className="pt-2">
                <button
                  onClick={onBrowseIdeas}
                  className="px-6 py-3 bg-white hover:bg-neutral-200 text-black text-xs font-semibold rounded-xl transition-all shadow-sm inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Explore Inspiration Square &rarr;</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {userInterests.map((item) => (
                <div
                  key={item.id}
                  className="p-6 rounded-2xl bg-[#0c0c0f] border border-white/10 hover:border-white/20 transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
                    <div>
                      <h3 className="text-sm font-bold text-white">{item.labName}</h3>
                      <div className="flex items-center gap-2 text-xs text-neutral-400 mt-1">
                        <Building2 size={12} className="text-neutral-500" />
                        <span>{item.institution}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                        {item.matchScore}% Match
                      </span>
                      {getInterestStatusBadge(item.status)}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs text-neutral-400">
                      <span className="text-neutral-500 font-medium">Proposed Topic:</span>{' '}
                      <span className="text-neutral-200 font-semibold">{item.proposedTopic}</span>
                    </div>

                    <div className="text-xs text-neutral-400">
                      <span className="text-neutral-500 font-medium">Collaboration Type:</span>{' '}
                      <span className="text-neutral-300">{item.collaborationType}</span>
                    </div>

                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-xs text-neutral-300 leading-relaxed">
                      <div className="text-neutral-400 mb-1 font-bold">
                        Submitted Proposal & Technical Needs:
                      </div>
                      <p className="text-neutral-200">{item.projectSummary}</p>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs text-neutral-500 font-medium flex items-center gap-1.5">
                      <Clock size={13} className="text-neutral-500" />
                      <span>
                        Initiated {item.timestampDisplay || new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </span>

                    <div className="flex items-center gap-3">
                      {item.status === 'Pending' && (
                        <button
                          onClick={() => handleWithdrawInterest(item.id)}
                          className="px-3.5 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 border border-white/5 hover:border-rose-500/20 transition-all cursor-pointer"
                          title="Withdraw expression of interest"
                        >
                          Withdraw
                        </button>
                      )}
                      <button
                        onClick={() => {
                          const targetLab = RESEARCH_LABS.find(
                            (l) => l.id === item.labId || l.name === item.labName
                          );
                          if (targetLab && onSelectLab) {
                            onSelectLab(targetLab);
                          }
                        }}
                        className="px-4 py-2 bg-white hover:bg-neutral-200 text-black text-xs font-semibold rounded-xl transition-all shadow-sm cursor-pointer"
                      >
                        View Lab Profile &nbsp;&nbsp;&gt;
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Saved (收藏灵感 / 实验室) */}
      {activeTab === 'saved' && (
        <div className="space-y-10">
          {/* Saved Ideas */}
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-serif text-white tracking-tight">
                  Bookmarked Scientific Ideas
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Proposals and research notes you have bookmarked from the Inspiration Square.
                </p>
              </div>
              <span className="text-xs text-neutral-500 font-medium">
                {savedNotes.length} saved
              </span>
            </div>

            {savedNotes.length === 0 ? (
              <div className="p-10 rounded-2xl bg-[#0c0c0f] border border-white/10 text-center space-y-3">
                <Bookmark size={20} className="text-neutral-500 mx-auto" />
                <p className="text-xs text-neutral-400">You haven't bookmarked any ideas yet.</p>
                <button
                  onClick={onBrowseIdeas}
                  className="text-xs text-white underline underline-offset-4 hover:text-neutral-300 cursor-pointer"
                >
                  Explore Inspiration Square &rarr;
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedNotes.map((note) => {
                  const isMyNote =
                    note.isUserSubmitted ||
                    (note.authorEmail &&
                      currentUser.email &&
                      note.authorEmail.toLowerCase() === currentUser.email.toLowerCase()) ||
                    (note.author?.name &&
                      currentUser.name &&
                      note.author.name.toLowerCase() === currentUser.name.toLowerCase());

                  return (
                    <ImaginationCard
                      key={note.id}
                      note={note}
                      onCollaborate={onCollaborate}
                      onSelectNote={onSelectNote}
                      onToggleLike={onToggleLike}
                      onToggleSave={onToggleSave}
                      onDeleteNote={isMyNote ? onDeleteNote : undefined}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Saved Laboratories */}
          <div className="space-y-5 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-serif text-white tracking-tight">
                  Saved Research Laboratories
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Laboratories and engineering centers you follow for capacity and partnerships.
                </p>
              </div>
              <span className="text-xs text-neutral-500 font-medium">
                {savedLabs.length} saved
              </span>
            </div>

            {savedLabs.length === 0 ? (
              <div className="p-10 rounded-2xl bg-[#0c0c0f] border border-white/10 text-center space-y-3">
                <Building2 size={20} className="text-neutral-500 mx-auto" />
                <p className="text-xs text-neutral-400">You haven't saved any research teams yet.</p>
                <button
                  onClick={onBrowseLabs}
                  className="text-xs text-white underline underline-offset-4 hover:text-neutral-300 cursor-pointer"
                >
                  Explore Teams &rarr;
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {savedLabs.map((lab) => (
                  <div
                    key={lab.id}
                    onClick={() => onSelectLab && onSelectLab(lab)}
                    className="p-5 rounded-2xl bg-[#0c0c0f] border border-white/10 hover:border-white/20 transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                            {lab.domain}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-medium">
                            {lab.capacityStatus}
                          </span>
                        </div>

                        {onToggleSaveLab && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleSaveLab(lab.id);
                            }}
                            title="Remove from saved"
                            className="p-1.5 rounded-lg border bg-amber-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500/30 transition-all cursor-pointer"
                          >
                            <Bookmark size={13} className="fill-amber-400 text-amber-400" />
                          </button>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-white group-hover:text-neutral-200 transition-colors">
                        {lab.name}
                      </h3>

                      <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                        <Building2 size={13} className="text-neutral-500" />
                        <span>{lab.institution}</span>
                      </div>

                      <p className="text-xs text-neutral-400 line-clamp-2 pt-1 leading-relaxed">
                        {lab.summary}
                      </p>
                    </div>

                    <div className="pt-4 mt-3 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-neutral-300 group-hover:text-white transition-colors">
                      <span>View Lab Profile</span>
                      <span className="text-neutral-400 group-hover:text-white">&gt;</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Profile Settings */}
      {activeTab === 'profile' && (
        <div className="max-w-3xl space-y-8">
          <header>
            <h2 className="text-xl font-serif text-white tracking-tight">
              Profile & Account Settings
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Update your scientific identity, institutional affiliation, and notification preferences.
            </p>
          </header>

          {profileSavedToast && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>Profile settings saved successfully!</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-6">
            {/* General Information */}
            <div className="p-6 sm:p-7 rounded-2xl bg-[#0c0c0f] border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <User size={16} className="text-neutral-400" />
                <span>Personal Information</span>
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-300">Display Name</label>
                    <input
                      required
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-white/30 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-300">Registered Email</label>
                    <input
                      disabled
                      value={currentUser.email}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-neutral-500 text-xs cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-300">
                    Institutional Affiliation
                  </label>
                  <input
                    value={profileAffiliation}
                    onChange={(e) => setProfileAffiliation(e.target.value)}
                    placeholder="e.g. Stanford University / Bio-X Institute"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-white/30 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-300">Scientific Bio</label>
                  <textarea
                    rows={3}
                    value={profileBio}
                    onChange={(e) => setProfileBio(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-white/30 transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Identity Tag */}
            <div className="p-6 sm:p-7 rounded-2xl bg-[#0c0c0f] border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Shield size={16} className="text-neutral-400" />
                <span>Identity Tag & Role</span>
              </h3>
              <p className="text-xs text-neutral-400">
                Select your primary scientific persona to calibrate AI lab recommendations.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                {[
                  'Principal Investigator',
                  'Postdoctoral Fellow',
                  'PhD Candidate',
                  'Biotech Founder',
                ].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setIdentityTag(tag)}
                    className={`px-3 py-2.5 rounded-xl text-xs font-semibold text-center transition-all cursor-pointer border ${
                      identityTag === tag
                        ? 'bg-white text-black border-white shadow-sm'
                        : 'bg-white/5 text-neutral-400 border-white/10 hover:text-white'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Notification Settings */}
            <div className="p-6 sm:p-7 rounded-2xl bg-[#0c0c0f] border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Bell size={16} className="text-neutral-400" />
                <span>Notification Settings</span>
              </h3>

              <div className="space-y-3 pt-1">
                {[
                  {
                    id: 'notify-matches',
                    label: 'Lab Matching Alerts',
                    desc: 'Notify when an accredited laboratory expresses interest in your proposal.',
                    checked: notifyMatches,
                    onChange: setNotifyMatches,
                  },
                  {
                    id: 'notify-collab',
                    label: 'Collaboration Inquiries',
                    desc: 'Receive instant alerts for co-author and team partnership requests.',
                    checked: notifyCollab,
                    onChange: setNotifyCollab,
                  },
                  {
                    id: 'notify-email',
                    label: 'Direct Email Alerts',
                    desc: 'Forward inbound notifications directly to your primary registered email.',
                    checked: notifyEmail,
                    onChange: setNotifyEmail,
                  },
                  {
                    id: 'notify-weekly',
                    label: 'Weekly Frontier Digest',
                    desc: 'Receive a curated digest of the highest-rated scientific ideas each Monday.',
                    checked: notifyWeekly,
                    onChange: setNotifyWeekly,
                  },
                ].map((item) => (
                  <label
                    key={item.id}
                    className="flex items-start justify-between gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors cursor-pointer"
                  >
                    <div className="space-y-0.5">
                      <span className="text-xs font-semibold text-white block">
                        {item.label}
                      </span>
                      <span className="text-[11px] text-neutral-400 block">
                        {item.desc}
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={(e) => item.onChange(e.target.checked)}
                      className="w-4 h-4 rounded bg-[#18181b] border-white/20 text-white focus:ring-0 cursor-pointer accent-white mt-1 shrink-0"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-7 py-3 bg-white hover:bg-neutral-200 text-black font-semibold text-xs rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
              >
                Save Profile Settings
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
