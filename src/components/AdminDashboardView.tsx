/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Shield,
  FileCheck2,
  Building2,
  Users,
  Check,
  X,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import {
  UserAccount,
  AdminIdeaItem,
  AdminLabApplication,
  AdminUserItem,
} from '../types';

interface AdminDashboardViewProps {
  currentUser: UserAccount;
  onBackToMain: () => void;
  onToast: (msg: string) => void;
}

type AdminTab = 'ideas' | 'labs' | 'users';

const DEFAULT_ADMIN_IDEAS: AdminIdeaItem[] = [
  {
    id: 'idea-rev-1',
    title: 'Engineered Rhizobia for Autonomous Nitrogen Secretion',
    submitterName: 'Dr. Aris Thorne',
    submitterEmail: 'athorne@stanford.bio.edu',
    domain: 'Synthetic Biology',
    submittedAt: 'Today at 09:30 AM',
    status: 'Pending',
    description:
      'CRISPR-directed modular operon rewiring to decouple biological nitrogen fixation from downstream ammonia feedback inhibition.',
  },
  {
    id: 'idea-rev-2',
    title: 'AI-Guided De Novo Nanobody Scaffolding Against Cryo-EM Epitopes',
    submitterName: 'Elena Rostova',
    submitterEmail: 'e.rostova@oxford.ac.uk',
    domain: 'Biomedicine',
    submittedAt: 'Yesterday at 04:15 PM',
    status: 'Pending',
    description:
      'Diffusion-based protein folding model generating 12-residue CDR3 hypervariable loops with sub-nanomolar target binding affinities.',
  },
  {
    id: 'idea-rev-3',
    title: 'Microfluidic Cell-Free Enzymatic Biopolymer Assembler',
    submitterName: 'Kenji Sato',
    submitterEmail: 'sato@tokyo-biotech.org',
    domain: 'Clean Biomanufacturing',
    submittedAt: '2 days ago',
    status: 'Approved',
    description:
      'Continuous droplet microfluidics for scalable cell-free polymerization of high-tensile structural biomaterials.',
  },
  {
    id: 'idea-rev-4',
    title: 'Optogenetic Opto-Kinase Switches for Neuronal Spiking Tracking',
    submitterName: 'Dr. Chloe Monet',
    submitterEmail: 'cmonet@pasteur.fr',
    domain: 'Neurotech',
    submittedAt: '3 days ago',
    status: 'Rejected',
    description:
      'Red-shifted rhodopsin kinase fusion constructs enabling two-photon interrogation of dendritic signal integration.',
  },
];

const DEFAULT_ADMIN_LABS: AdminLabApplication[] = [
  {
    id: 'lab-app-1',
    labName: 'Oxford Biomolecular Robotics Foundry',
    institution: 'University of Oxford',
    researchDirections: 'High-throughput DNA assembly, automated acoustic droplet dispensing, automated cloning',
    domain: 'Synthetic Biology',
    leadPI: 'Prof. Alistair Finch',
    contactEmail: 'finch-lab@ox.ac.uk',
    submittedAt: 'Today at 11:20 AM',
    status: 'Pending',
  },
  {
    id: 'lab-app-2',
    labName: 'DeepProtein Structural Genomics Core',
    institution: 'Broad Institute & MIT',
    researchDirections: 'Protein design validation, cryo-EM screening, binding kinetic assays via SPR',
    domain: 'Biomedicine',
    leadPI: 'Dr. Rebecca Sterling',
    contactEmail: 'rsterling@broadinstitute.org',
    submittedAt: 'Yesterday at 02:45 PM',
    status: 'Pending',
  },
  {
    id: 'lab-app-3',
    labName: 'Pacific Marine Synbio Institute',
    institution: 'UC San Diego',
    researchDirections: 'Cyanobacterial metabolic engineering, marine biopolymer synthesis, carbon fixation',
    domain: 'Clean Biomanufacturing',
    leadPI: 'Dr. Harrison Vance',
    contactEmail: 'hvance@ucsd.edu',
    submittedAt: '4 days ago',
    status: 'Approved',
  },
];

const DEFAULT_ADMIN_USERS: AdminUserItem[] = [
  {
    id: 'usr-1',
    name: 'Calista Peng',
    email: 'calistapeng7@gmail.com',
    role: 'Creator',
    registeredAt: 'Sep 02, 2026',
    status: 'Active',
  },
  {
    id: 'usr-2',
    name: 'Dr. Aris Thorne',
    email: 'athorne@stanford.bio.edu',
    role: 'Researcher',
    registeredAt: 'Aug 28, 2026',
    status: 'Active',
  },
  {
    id: 'usr-3',
    name: 'Elena Rostova',
    email: 'e.rostova@oxford.ac.uk',
    role: 'Researcher',
    registeredAt: 'Aug 22, 2026',
    status: 'Active',
  },
  {
    id: 'usr-4',
    name: 'Kenji Sato',
    email: 'sato@tokyo-biotech.org',
    role: 'Creator',
    registeredAt: 'Aug 14, 2026',
    status: 'Active',
  },
  {
    id: 'usr-5',
    name: 'System Admin',
    email: 'admin@synbio.org',
    role: 'Admin',
    registeredAt: 'Jan 01, 2026',
    status: 'Active',
  },
];

export default function AdminDashboardView({
  currentUser,
  onBackToMain,
  onToast,
}: AdminDashboardViewProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('ideas');

  // 1. Idea Review State
  const [ideas, setIdeas] = useState<AdminIdeaItem[]>(() => {
    try {
      const stored = localStorage.getItem('synbio_admin_ideas');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_ADMIN_IDEAS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('synbio_admin_ideas', JSON.stringify(ideas));
    } catch (e) {
      console.error(e);
    }
  }, [ideas]);

  // 2. Lab Application State
  const [labApps, setLabApps] = useState<AdminLabApplication[]>(() => {
    try {
      const stored = localStorage.getItem('synbio_admin_lab_apps');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_ADMIN_LABS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('synbio_admin_lab_apps', JSON.stringify(labApps));
    } catch (e) {
      console.error(e);
    }
  }, [labApps]);

  // 3. User Management State
  const [users, setUsers] = useState<AdminUserItem[]>(() => {
    try {
      const registered = localStorage.getItem('synbio_registered_users');
      if (registered) {
        const parsed = JSON.parse(registered);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((u: any, idx: number) => ({
            id: u.id || `usr-${idx}`,
            name: u.name || 'Unnamed User',
            email: u.email || '',
            role:
              u.email === 'admin@synbio.org' || u.role === 'admin'
                ? 'Admin'
                : u.identityTag === 'Academic Researcher'
                ? 'Researcher'
                : 'Creator',
            registeredAt: u.createdAt
              ? new Date(u.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : 'Sep 01, 2026',
            status: 'Active',
          }));
        }
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_ADMIN_USERS;
  });

  // Action handlers for Ideas
  const handleApproveIdea = (id: string) => {
    setIdeas((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'Approved' } : item))
    );
    onToast('Idea approved and published to the frontier index.');
  };

  const handleRejectIdea = (id: string) => {
    setIdeas((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'Rejected' } : item))
    );
    onToast('Idea proposal marked as rejected.');
  };

  // Action handlers for Labs
  const handleApproveLab = (id: string) => {
    setLabApps((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'Approved' } : item))
    );
    onToast('Lab application approved. Onboarding credentials issued.');
  };

  const handleRejectLab = (id: string) => {
    setLabApps((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'Rejected' } : item))
    );
    onToast('Lab onboarding application rejected.');
  };

  // Counts for tabs
  const pendingIdeasCount = ideas.filter((i) => i.status === 'Pending').length;
  const pendingLabsCount = labApps.filter((l) => l.status === 'Pending').length;

  return (
    <div className="min-h-screen pt-28 pb-28 px-4 sm:px-6 lg:px-12 bg-black text-white selection:bg-white selection:text-black">
      <div className="max-w-6xl mx-auto">
        {/* Top Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2.5 mb-2.5">
              <span className="px-3 py-1 bg-white/10 text-white rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 border border-white/15">
                <Shield size={13} className="text-amber-400" />
                <span>Admin Dashboard</span>
              </span>
              <span className="text-xs text-neutral-400">
                Logged in as <strong className="text-white">{currentUser.name}</strong> ({currentUser.email})
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif text-white tracking-tight">
              Admin Management
            </h1>
            <p className="text-neutral-400 text-sm mt-1.5 max-w-2xl">
              Oversee community idea verification, vet partner laboratory applications, and manage platform memberships.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBackToMain}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white text-xs font-semibold rounded-xl border border-white/10 transition-all cursor-pointer"
            >
              Exit to App
            </button>
          </div>
        </div>

        {/* Tab Navigation: 1. Idea Review 2. Lab Application Review 3. User Management */}
        <div className="flex items-center gap-2 sm:gap-3 p-1.5 bg-[#111114] border border-white/10 rounded-2xl mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('ideas')}
            className={`px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'ideas'
                ? 'bg-white text-black shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FileCheck2 size={16} />
            <span>Idea Review</span>
            {pendingIdeasCount > 0 && (
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                  activeTab === 'ideas'
                    ? 'bg-black text-white'
                    : 'bg-white/20 text-white'
                }`}
              >
                {pendingIdeasCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('labs')}
            className={`px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'labs'
                ? 'bg-white text-black shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Building2 size={16} />
            <span>Lab Application Review</span>
            {pendingLabsCount > 0 && (
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                  activeTab === 'labs'
                    ? 'bg-black text-white'
                    : 'bg-white/20 text-white'
                }`}
              >
                {pendingLabsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'users'
                ? 'bg-white text-black shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users size={16} />
            <span>User Management</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                activeTab === 'users'
                  ? 'bg-black text-white'
                  : 'bg-white/20 text-white'
              }`}
            >
              {users.length}
            </span>
          </button>
        </div>

        {/* Tab 1: Idea Review (灵感审核) */}
        {activeTab === 'ideas' && (
          <motion.div
            key="tab-ideas"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between px-1 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Submitted Ideas ({ideas.length})
              </span>
              <span className="text-xs text-neutral-500">
                Action required on {pendingIdeasCount} proposal{pendingIdeasCount !== 1 ? 's' : ''}
              </span>
            </div>

            {ideas.length === 0 ? (
              <div className="p-16 text-center bg-[#0e0e11] border border-white/5 rounded-3xl">
                <FileCheck2 size={36} className="mx-auto text-neutral-600 mb-3" />
                <h3 className="text-base font-semibold text-neutral-300">No pending ideas</h3>
                <p className="text-xs text-neutral-500 mt-1">
                  All submitted proposals have been reviewed.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {ideas.map((idea) => {
                  const isPending = idea.status === 'Pending';
                  const isApproved = idea.status === 'Approved';
                  const isRejected = idea.status === 'Rejected';

                  return (
                    <div
                      key={idea.id}
                      className="p-5 sm:p-6 bg-[#0e0e11] border border-white/10 rounded-2xl hover:border-white/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
                    >
                      <div className="space-y-2 max-w-2xl">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <h3 className="text-base font-bold text-white tracking-tight">
                            {idea.title}
                          </h3>
                          {idea.domain && (
                            <span className="px-2.5 py-0.5 bg-white/5 text-neutral-300 text-[11px] font-medium rounded-full border border-white/10">
                              {idea.domain}
                            </span>
                          )}
                        </div>

                        {idea.description && (
                          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                            {idea.description}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400 pt-1">
                          <span className="flex items-center gap-1.5">
                            <span className="text-neutral-500">Submitter:</span>
                            <strong className="text-neutral-200">{idea.submitterName}</strong>
                            {idea.submitterEmail && (
                              <span className="text-neutral-500 font-mono text-[11px]">
                                ({idea.submitterEmail})
                              </span>
                            )}
                          </span>
                          <span className="flex items-center gap-1 text-neutral-500">
                            <Clock size={12} />
                            <span>{idea.submittedAt}</span>
                          </span>
                        </div>
                      </div>

                      {/* Status & Actions */}
                      <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                        {/* Status Badge */}
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                            isApproved
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : isRejected
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {isApproved && <CheckCircle2 size={13} />}
                          {isRejected && <XCircle size={13} />}
                          {isPending && <AlertCircle size={13} />}
                          <span>{idea.status}</span>
                        </span>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleApproveIdea(idea.id)}
                            disabled={isApproved}
                            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                              isApproved
                                ? 'bg-emerald-500/20 text-emerald-300 opacity-60 cursor-not-allowed'
                                : 'bg-white hover:bg-neutral-200 text-black shadow-sm active:scale-95'
                            }`}
                            title="Approve Idea"
                          >
                            <Check size={14} strokeWidth={2.5} />
                            <span>Approve</span>
                          </button>

                          <button
                            onClick={() => handleRejectIdea(idea.id)}
                            disabled={isRejected}
                            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                              isRejected
                                ? 'bg-rose-500/20 text-rose-300 opacity-60 cursor-not-allowed'
                                : 'bg-[#1c1c1f] hover:bg-rose-500/10 text-neutral-300 hover:text-rose-400 border border-white/10 hover:border-rose-500/30'
                            }`}
                            title="Reject Idea"
                          >
                            <X size={14} strokeWidth={2.5} />
                            <span>Reject</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* Tab 2: Lab Application Review (实验室入驻审核) */}
        {activeTab === 'labs' && (
          <motion.div
            key="tab-labs"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between px-1 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Partner Lab Onboarding Applications ({labApps.length})
              </span>
              <span className="text-xs text-neutral-500">
                {pendingLabsCount} application{pendingLabsCount !== 1 ? 's' : ''} awaiting review
              </span>
            </div>

            {labApps.length === 0 ? (
              <div className="p-16 text-center bg-[#0e0e11] border border-white/5 rounded-3xl">
                <Building2 size={36} className="mx-auto text-neutral-600 mb-3" />
                <h3 className="text-base font-semibold text-neutral-300">No pending lab applications</h3>
                <p className="text-xs text-neutral-500 mt-1">
                  There are currently no new laboratory onboarding requests.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {labApps.map((lab) => {
                  const isPending = lab.status === 'Pending';
                  const isApproved = lab.status === 'Approved';
                  const isRejected = lab.status === 'Rejected';

                  return (
                    <div
                      key={lab.id}
                      className="p-5 sm:p-6 bg-[#0e0e11] border border-white/10 rounded-2xl hover:border-white/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
                    >
                      <div className="space-y-2 max-w-2xl">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <h3 className="text-base font-bold text-white tracking-tight">
                            {lab.labName}
                          </h3>
                          <span className="px-2.5 py-0.5 bg-white/5 text-neutral-300 text-[11px] font-medium rounded-full border border-white/10">
                            {lab.institution}
                          </span>
                        </div>

                        <div className="text-xs sm:text-sm text-neutral-300 flex items-start gap-1.5">
                          <span className="text-neutral-500 shrink-0 font-medium">Research Focus:</span>
                          <span className="text-neutral-300 leading-relaxed">
                            {lab.researchDirections}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400 pt-1">
                          {lab.leadPI && (
                            <span>
                              <span className="text-neutral-500">Lead PI: </span>
                              <strong className="text-neutral-200">{lab.leadPI}</strong>
                            </span>
                          )}
                          {lab.contactEmail && (
                            <span className="font-mono text-neutral-400 text-[11px]">
                              {lab.contactEmail}
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-neutral-500">
                            <Clock size={12} />
                            <span>{lab.submittedAt}</span>
                          </span>
                        </div>
                      </div>

                      {/* Status & Actions */}
                      <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                        {/* Status Badge */}
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                            isApproved
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : isRejected
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {isApproved && <CheckCircle2 size={13} />}
                          {isRejected && <XCircle size={13} />}
                          {isPending && <AlertCircle size={13} />}
                          <span>{lab.status}</span>
                        </span>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleApproveLab(lab.id)}
                            disabled={isApproved}
                            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                              isApproved
                                ? 'bg-emerald-500/20 text-emerald-300 opacity-60 cursor-not-allowed'
                                : 'bg-white hover:bg-neutral-200 text-black shadow-sm active:scale-95'
                            }`}
                            title="Approve Lab Application"
                          >
                            <Check size={14} strokeWidth={2.5} />
                            <span>Approve Application</span>
                          </button>

                          <button
                            onClick={() => handleRejectLab(lab.id)}
                            disabled={isRejected}
                            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                              isRejected
                                ? 'bg-rose-500/20 text-rose-300 opacity-60 cursor-not-allowed'
                                : 'bg-[#1c1c1f] hover:bg-rose-500/10 text-neutral-300 hover:text-rose-400 border border-white/10 hover:border-rose-500/30'
                            }`}
                            title="Reject Lab Application"
                          >
                            <X size={14} strokeWidth={2.5} />
                            <span>Reject Application</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* Tab 3: User Management (用户管理) */}
        {activeTab === 'users' && (
          <motion.div
            key="tab-users"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between px-1 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Registered Platform Members ({users.length})
              </span>
              <span className="text-xs text-neutral-500">
                Showing all active credentials
              </span>
            </div>

            {users.length === 0 ? (
              <div className="p-16 text-center bg-[#0e0e11] border border-white/5 rounded-3xl">
                <Users size={36} className="mx-auto text-neutral-600 mb-3" />
                <h3 className="text-base font-semibold text-neutral-300">No users found</h3>
                <p className="text-xs text-neutral-500 mt-1">
                  No accounts are registered on the platform.
                </p>
              </div>
            ) : (
              <div className="overflow-hidden bg-[#0e0e11] border border-white/10 rounded-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-neutral-300">
                    <thead className="bg-[#141418] text-[11px] uppercase tracking-wider text-neutral-400 border-b border-white/10">
                      <tr>
                        <th scope="col" className="px-6 py-4 font-semibold">User</th>
                        <th scope="col" className="px-6 py-4 font-semibold">Role / Identity</th>
                        <th scope="col" className="px-6 py-4 font-semibold">Registration Date</th>
                        <th scope="col" className="px-6 py-4 font-semibold">Account Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-xs font-bold text-white uppercase">
                                {user.name.charAt(0)}
                              </div>
                              <div>
                                <div className="font-semibold text-white">{user.name}</div>
                                <div className="text-xs text-neutral-500 font-mono">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium border ${
                                user.role === 'Admin'
                                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                                  : user.role === 'Researcher'
                                  ? 'bg-blue-500/10 text-blue-300 border-blue-500/20'
                                  : 'bg-neutral-500/10 text-neutral-300 border-white/10'
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs text-neutral-400">
                            {user.registeredAt}
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              <span>{user.status}</span>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
