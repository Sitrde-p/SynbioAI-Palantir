/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquare,
  Heart,
  Share2,
  Plus,
  Search,
  Users,
  Send,
  X,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Tag,
  Edit2,
  Trash2,
  Check,
} from 'lucide-react';
import { UserAccount, CommunitySection, CommunityPost, CommunityReply } from '../types';

interface CommunityViewProps {
  currentUser?: UserAccount | null;
  onRequireAuth?: () => void;
}

const INITIAL_POSTS: CommunityPost[] = [
  {
    id: 'comm-post-1',
    section: 'Discussion',
    title: 'Will continuous microfluidic cell-free protein synthesis replace traditional bioreactors for rapid antibody screening?',
    content:
      'We recently set up a continuous-exchange cell-free transcription-translation (CFPS) micro-perfusion system in our lab. Yields have surpassed 1.2 mg/mL within 6 hours without having to manage host cell viability or metabolic diversion. Given recent breakthroughs in coupled lyophilized lysates, does the community see this as the primary paradigm shift for early-stage epitope screening?',
    author: {
      name: 'Dr. Elena Rostova',
      role: 'Principal Investigator',
      institution: 'Max Planck Institute for Terrestrial Microbiology',
    },
    authorEmail: 'elena.rostova@synbio.org',
    tags: ['Cell-Free Synthesis', 'Microfluidics', 'Antibody Engineering', 'Protein Production'],
    likes: 48,
    isLiked: false,
    repliesCount: 2,
    replies: [
      {
        id: 'reply-1-1',
        author: {
          name: 'Prof. Marcus Vance',
          role: 'Bio-foundry Lead',
          institution: 'Imperial College London',
        },
        authorEmail: 'marcus.vance@imperial.ac.uk',
        content:
          'Completely agree for screening libraries under 10,000 variants. The main bottleneck remains the cost of energy regeneration substrates (PEP, creatine phosphate) at 50L scale, but for 96-well format it is unmatched.',
        createdAt: '3 hours ago',
      },
      {
        id: 'reply-1-2',
        author: {
          name: 'Calista Peng',
          role: 'Postdoctoral Researcher',
          institution: 'Stanford Bio-X',
        },
        authorEmail: 'calista.peng@stanford.edu',
        content:
          'We saw similar benefits when coupling micro-perfusion with automated capillary electrophoresis. Post-translational modifications (specifically high-mannose glycosylation) still require tailored chaperone co-expression however.',
        createdAt: '1 hour ago',
      },
    ],
    createdAt: '5 hours ago',
    statusBadge: 'Hot Topic',
  },
  {
    id: 'comm-post-2',
    section: 'Discussion',
    title: 'How do you mitigate non-specific cell adhesion in PDMS microchannels without altering laminar shear velocity?',
    content:
      'We are manufacturing 50μm constriction microfluidic channels to test mammalian cellular deformability. Even after Pluronic F-127 treatment (1% w/v for 2 hours), neuroblastoma cells begin sticking around the throat geometries after 35 minutes of laminar flow. What silanization or PEG-grafting protocols have worked reliably for you without swelling the PDMS?',
    author: {
      name: 'Julian Thorne',
      role: 'PhD Candidate',
      institution: 'ETH Zürich Bio-Engineering',
    },
    authorEmail: 'julian.thorne@ethz.ch',
    tags: ['PDMS Surface Chem', 'Microfluidics', 'Cell Mechanics', 'Protocol'],
    likes: 31,
    isLiked: false,
    repliesCount: 1,
    replies: [
      {
        id: 'reply-2-1',
        author: {
          name: 'Dr. Jennifer Martinez',
          role: 'Microfluidics Director',
          institution: 'Harvard Wyss Institute',
        },
        authorEmail: 'jennifer.martinez@wyss.harvard.edu',
        content:
          'Try oxygen plasma exposure (50W, 45s) immediately followed by vapor-phase grafting of 2-[methoxy(polyethyleneoxy)propyl]trimethoxysilane at 70°C for 2h in a desiccator. It yields contact angles < 15° with zero delamination up to 2.5 Pa shear.',
        createdAt: '6 hours ago',
      },
    ],
    createdAt: '10 hours ago',
    statusBadge: 'Answered',
  },
  {
    id: 'comm-post-3',
    section: 'Discussion',
    title: 'Idea Sketch: CRISPR-Cas12a coupled to graphene field-effect transistors for real-time viral capsid telemetry in saliva',
    content:
      'Raw idea seeking feedback: Instead of optical fluorescence readout which requires fluorescent reporters and plate readers, what if we tether single-stranded DNA probes directly across the conduction channel of a graphene FET? Once target pathogen RNA activates Cas12a collateral cleavage, the ssDNA bridging the channel is severed, causing an instantaneous Dirac point shift and impedance change. Looking for feedback on target sensitivity limits and Debye screening length challenges in physiological buffers.',
    author: {
      name: 'Aiden Vance',
      role: 'Biotech Co-founder',
      institution: 'Frontier Biosensing Lab',
    },
    authorEmail: 'aiden.vance@frontier.org',
    tags: ['CRISPR-Diagnostics', 'Graphene FET', 'Bio-Electronics', 'Early Concept'],
    likes: 67,
    isLiked: false,
    repliesCount: 1,
    replies: [
      {
        id: 'reply-3-1',
        author: {
          name: 'Dr. Liam Sterling',
          role: 'Nanoscale Physics Fellow',
          institution: 'MIT Media Lab',
        },
        authorEmail: 'liam.sterling@mit.edu',
        content:
          'The Debye length in saliva (~0.7 nm) will shield any cleavage event that occurs further than a few base pairs from the graphene surface. You will either need desalting filtration or engineered short hairpin linkers.',
        createdAt: 'Yesterday',
      },
    ],
    createdAt: 'Yesterday',
    statusBadge: 'Seeking Feedback',
  },
  {
    id: 'comm-post-4',
    section: 'Seeking',
    title: '[Recruitment] Looking for a computational structural biologist experienced with RFdiffusion for our DNA origami nano-cage project',
    content:
      'Our team at Kyoto Nano-Bio Lab is constructing synthetic icosahedral DNA origami cages designed to encapsulate targeted oncolytic peptides. We need a computational partner to model and optimize the peptide binding affinity along the interior facets using RFdiffusion or ProteinMPNN. We can provide validated cryo-EM structural datasets and wet-lab binding validation.',
    author: {
      name: 'Prof. Kenji Takahashi',
      role: 'Laboratory Director',
      institution: 'Kyoto Institute of Bio-Nanotechnology',
    },
    authorEmail: 'kenji.takahashi@kyoto-u.ac.jp',
    tags: ['Recruitment', 'RFdiffusion', 'DNA Origami', 'Cryo-EM', 'Targeted Delivery'],
    likes: 54,
    isLiked: false,
    repliesCount: 1,
    replies: [
      {
        id: 'reply-4-1',
        author: {
          name: 'Dr. Arthur Penhaligon',
          role: 'Computational Lead',
          institution: 'Oxford SynBio Group',
        },
        authorEmail: 'arthur.penhaligon@ox.ac.uk',
        content:
          'Our group has an active pipeline for symmetric cage interior docking using ColabDesign. Sent you a DM with our latest preprint link.',
        createdAt: '2 days ago',
      },
    ],
    createdAt: '2 days ago',
    statusBadge: 'Seeking Partners',
  },
  {
    id: 'comm-post-5',
    section: 'Discussion',
    title: 'Standardizing metabolic flux metadata: Should we enforce open JSON-LD schemas across dry-lab and wet-lab handoffs?',
    content:
      'One major friction in synthetic metabolic engineering is the loss of phenotypic context between LC-MS metabolomics runs and kinetic flux modeling pipelines. Should the community converge on an open, machine-readable JSON-LD ontology for labeling microbial growth conditions and isotope tracing experiments?',
    author: {
      name: 'Dr. Chloe Aris',
      role: 'Bioinformatics Lead',
      institution: 'Broad Institute',
    },
    authorEmail: 'chloe.aris@broadinstitute.org',
    tags: ['Data Standards', 'Metabolic Engineering', 'Bioinformatics', 'Flux Analysis'],
    likes: 39,
    isLiked: false,
    repliesCount: 0,
    replies: [],
    createdAt: '3 days ago',
  },
];

// Helper to normalize legacy sections (e.g. Q&A, Idea Incubation, Collaboration) to the 2 allowed sections
export const normalizeSection = (section?: string): CommunitySection => {
  if (section === 'Seeking' || section === 'Collaboration') {
    return 'Seeking';
  }
  return 'Discussion';
};

export default function CommunityView({ currentUser, onRequireAuth }: CommunityViewProps) {
  const [posts, setPosts] = useState<CommunityPost[]>(() => {
    try {
      const stored = localStorage.getItem('synbio_community_posts');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const cleaned: CommunityPost[] = parsed.map((p: any) => ({
            ...p,
            section: normalizeSection(p.section),
            statusBadge:
              p.statusBadge === 'Open for Collab'
                ? 'Seeking Partners'
                : p.statusBadge,
          }));
          try {
            localStorage.setItem('synbio_community_posts', JSON.stringify(cleaned));
          } catch {}
          return cleaned;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_POSTS;
  });

  const [activeSection, setActiveSection] = useState<'All' | CommunitySection>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Expanded replies state for each post
  const [expandedPostIds, setExpandedPostIds] = useState<Record<string, boolean>>({
    'comm-post-1': true,
  });
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});

  // New Post Modal State (2 types: Discussion | Seeking)
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [newPostSection, setNewPostSection] = useState<CommunitySection>('Discussion');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTags, setNewPostTags] = useState('');
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);

  // Edit Post Modal State
  const [editingPost, setEditingPost] = useState<CommunityPost | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editSection, setEditSection] = useState<CommunitySection>('Discussion');
  const [editTags, setEditTags] = useState('');

  // Inline Edit Reply State
  const [editingReplyKey, setEditingReplyKey] = useState<string | null>(null); // `${postId}-${replyId}`
  const [editReplyContent, setEditReplyContent] = useState('');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync with localStorage
  const savePostsToStorage = (updated: CommunityPost[]) => {
    setPosts(updated);
    try {
      localStorage.setItem('synbio_community_posts', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const isAuthor = (authorEmail?: string, authorName?: string) => {
    if (!currentUser) return false;
    if (authorEmail && currentUser.email && authorEmail.toLowerCase() === currentUser.email.toLowerCase()) {
      return true;
    }
    if (authorName && currentUser.name && authorName.toLowerCase() === currentUser.name.toLowerCase()) {
      return true;
    }
    return false;
  };

  const handleOpenNewPost = () => {
    if (!currentUser) {
      if (onRequireAuth) {
        onRequireAuth();
      }
      return;
    }
    setIsNewPostModalOpen(true);
  };

  const handleToggleLike = (postId: string) => {
    const updated = posts.map((post) => {
      if (post.id === postId) {
        const nextLiked = !post.isLiked;
        return {
          ...post,
          isLiked: nextLiked,
          likes: nextLiked ? post.likes + 1 : Math.max(0, post.likes - 1),
        };
      }
      return post;
    });
    savePostsToStorage(updated);
  };

  const handleToggleReplies = (postId: string) => {
    setExpandedPostIds((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleAddReply = (postId: string) => {
    const content = (replyInputs[postId] || '').trim();
    if (!content) return;

    if (!currentUser) {
      if (onRequireAuth) onRequireAuth();
      return;
    }

    const newReply: CommunityReply = {
      id: 'reply-' + Date.now(),
      author: {
        name: currentUser.name || 'Anonymous Researcher',
        role: currentUser.identityTag || 'Scientist',
        institution: currentUser.affiliation || 'Synthetic Biology Lab',
      },
      authorEmail: currentUser.email,
      content,
      createdAt: 'Just now',
    };

    const updated = posts.map((post) => {
      if (post.id === postId) {
        const replies = post.replies ? [...post.replies, newReply] : [newReply];
        return {
          ...post,
          replies,
          repliesCount: replies.length,
        };
      }
      return post;
    });

    savePostsToStorage(updated);
    setReplyInputs((prev) => ({ ...prev, [postId]: '' }));
    setExpandedPostIds((prev) => ({ ...prev, [postId]: true }));
    showToast('Reply posted to discussion');
  };

  const handleDeleteReply = (postId: string, replyId: string) => {
    const updated = posts.map((post) => {
      if (post.id === postId && post.replies) {
        const filteredReplies = post.replies.filter((r) => r.id !== replyId);
        return {
          ...post,
          replies: filteredReplies,
          repliesCount: filteredReplies.length,
        };
      }
      return post;
    });
    savePostsToStorage(updated);
    showToast('Reply deleted');
  };

  const handleStartEditReply = (postId: string, reply: CommunityReply) => {
    setEditingReplyKey(`${postId}-${reply.id}`);
    setEditReplyContent(reply.content);
  };

  const handleSaveEditReply = (postId: string, replyId: string) => {
    if (!editReplyContent.trim()) return;

    const updated = posts.map((post) => {
      if (post.id === postId && post.replies) {
        const updatedReplies = post.replies.map((r) =>
          r.id === replyId ? { ...r, content: editReplyContent.trim() } : r
        );
        return {
          ...post,
          replies: updatedReplies,
        };
      }
      return post;
    });

    savePostsToStorage(updated);
    setEditingReplyKey(null);
    setEditReplyContent('');
    showToast('Reply updated');
  };

  const handleDeletePost = (postId: string) => {
    const updated = posts.filter((p) => p.id !== postId);
    savePostsToStorage(updated);
    showToast('Post deleted');
  };

  const handleStartEditPost = (post: CommunityPost) => {
    setEditingPost(post);
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditSection(post.section);
    setEditTags(post.tags.join(', '));
  };

  const handleSaveEditPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost || !editTitle.trim() || !editContent.trim()) return;

    const tagsArray = editTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const updated = posts.map((p) => {
      if (p.id === editingPost.id) {
        return {
          ...p,
          title: editTitle.trim(),
          content: editContent.trim(),
          section: editSection,
          tags: tagsArray.length > 0 ? tagsArray : p.tags,
          statusBadge: editSection === 'Seeking' ? 'Seeking Partners' : 'Discussion',
        };
      }
      return p;
    });

    savePostsToStorage(updated);
    setEditingPost(null);
    showToast('Post updated successfully');
  };

  const handleSubmitNewPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    setIsSubmittingPost(true);

    const tagsArray = newPostTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const createdPost: CommunityPost = {
      id: 'comm-post-' + Date.now(),
      section: newPostSection,
      title: newPostTitle.trim(),
      content: newPostContent.trim(),
      author: {
        name: currentUser?.name || 'Dr. Researcher',
        role: currentUser?.identityTag || 'Investigator',
        institution: currentUser?.affiliation || 'Department of Bioengineering',
      },
      authorEmail: currentUser?.email,
      tags: tagsArray.length > 0 ? tagsArray : ['Synthetic Biology', 'Research'],
      likes: 1,
      isLiked: true,
      repliesCount: 0,
      replies: [],
      createdAt: 'Just now',
      statusBadge: newPostSection === 'Seeking' ? 'Seeking Partners' : 'Discussion',
    };

    const nextPosts = [createdPost, ...posts];
    savePostsToStorage(nextPosts);

    // Reset form
    setNewPostTitle('');
    setNewPostContent('');
    setNewPostTags('');
    setIsSubmittingPost(false);
    setIsNewPostModalOpen(false);
    showToast('Your post has been shared with the community');
  };

  // Filtered posts
  const filteredPosts = posts.filter((post) => {
    const matchesSection = activeSection === 'All' || post.section === activeSection;
    const matchesSearch =
      searchQuery === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTag = !selectedTag || post.tags.includes(selectedTag);

    return matchesSection && matchesSearch && matchesTag;
  });

  const getSectionBadgeStyle = (section: CommunitySection) => {
    switch (section) {
      case 'Discussion':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Seeking':
        return 'bg-violet-500/10 text-violet-400 border-violet-500/20';
      default:
        return 'bg-white/10 text-white border-white/20';
    }
  };

  const getSectionIcon = (section: CommunitySection) => {
    switch (section) {
      case 'Discussion':
        return <MessageSquare size={13} />;
      case 'Seeking':
        return <Users size={13} />;
    }
  };

  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags))).slice(0, 10);

  return (
    <div className="min-h-screen pt-28 pb-24 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto bg-black text-white">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[200] max-w-md bg-neutral-900 border border-white/15 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header matching Teams (Partners) exactly */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif text-white tracking-tight font-normal">
            Where Researchers Connect
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base max-w-2xl mt-2 leading-relaxed">
            Start discussions, share insights and find partners.
          </p>
        </div>

        {/* Primary Action Button: + New Post */}
        <div className="shrink-0">
          <button
            onClick={handleOpenNewPost}
            className="px-6 py-3.5 bg-white hover:bg-neutral-200 text-black font-semibold text-xs rounded-2xl transition-all shadow-lg active:scale-95 flex items-center gap-2.5 cursor-pointer"
          >
            <Plus size={16} strokeWidth={2.4} className="shrink-0" />
            <span>New Post</span>
          </button>
        </div>
      </header>

      {/* Filter and Section Bar */}
      <div className="space-y-6 mb-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* 3 Filter Tabs: [All] [Discussion] [Seeking] */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {(
              [
                { id: 'All', label: 'All', icon: MessageSquare },
                { id: 'Discussion', label: 'Discussion', icon: MessageSquare },
                { id: 'Seeking', label: 'Seeking', icon: Users },
              ] as const
            ).map((tab) => {
              const Icon = tab.icon;
              const count =
                tab.id === 'All'
                  ? posts.length
                  : posts.filter((p) => p.section === tab.id).length;
              const isSelected = activeSection === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveSection(tab.id);
                    setSelectedTag(null);
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-white text-black shadow-sm font-bold'
                      : 'bg-[#121216] text-neutral-400 hover:text-white border border-white/5'
                  }`}
                >
                  <Icon size={14} className={isSelected ? 'text-black' : 'text-neutral-400'} />
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                      isSelected ? 'bg-black/10 text-black' : 'bg-white/10 text-neutral-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search input */}
          <div className="relative min-w-[240px] sm:min-w-[300px]">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search discussions, partners, tags..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-white/30 transition-all placeholder:text-neutral-600"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white text-xs"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Popular Tags Row */}
        {allTags.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs text-neutral-400 scrollbar-none">
            <span className="font-semibold text-neutral-500 shrink-0 flex items-center gap-1 mr-1">
              <Tag size={12} /> Topics:
            </span>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer whitespace-nowrap border ${
                  selectedTag === tag
                    ? 'bg-white/20 text-white border-white/40'
                    : 'bg-white/5 text-neutral-400 border-white/5 hover:text-white hover:border-white/20'
                }`}
              >
                #{tag}
              </button>
            ))}
            {selectedTag && (
              <button
                onClick={() => setSelectedTag(null)}
                className="px-2 py-1 text-xs text-rose-400 hover:underline cursor-pointer"
              >
                Clear tag filter
              </button>
            )}
          </div>
        )}
      </div>

      {/* Conversations Feed */}
      <div className="space-y-6">
        {filteredPosts.length === 0 ? (
          <div className="p-16 rounded-3xl bg-[#0c0c0f] border border-white/10 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 text-neutral-400 flex items-center justify-center mx-auto">
              <MessageSquare size={24} />
            </div>
            <h3 className="text-lg font-serif text-white">No discussions found</h3>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
              No posts match your current filter. Start the first thread or broaden your query.
            </p>
            <div className="pt-2">
              <button
                onClick={handleOpenNewPost}
                className="px-6 py-2.5 bg-white text-black font-semibold text-xs rounded-xl hover:bg-neutral-200 transition-all cursor-pointer inline-flex items-center gap-2.5"
              >
                <Plus size={16} strokeWidth={2.4} className="shrink-0" />
                <span>New Post</span>
              </button>
            </div>
          </div>
        ) : (
          filteredPosts.map((post) => {
            const isExpanded = expandedPostIds[post.id] ?? false;
            const replies = post.replies || [];
            const userOwnsPost = isAuthor(post.authorEmail, post.author.name);

            return (
              <article
                key={post.id}
                className="p-6 sm:p-8 rounded-3xl bg-[#0c0c0f] border border-white/10 hover:border-white/20 transition-all space-y-5"
              >
                {/* Post Top Metadata */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/10 flex items-center justify-center text-white font-serif font-bold text-sm">
                      {post.author.name[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-white">
                          {post.author.name}
                        </h4>
                        <span className="text-[11px] text-neutral-400">· {post.author.role}</span>
                      </div>
                      {post.author.institution && (
                        <p className="text-[11px] text-neutral-500 font-medium">
                          {post.author.institution}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-semibold border flex items-center gap-1.5 ${getSectionBadgeStyle(
                        normalizeSection(post.section)
                      )}`}
                    >
                      {getSectionIcon(normalizeSection(post.section))}
                      <span>{normalizeSection(post.section)}</span>
                    </span>

                    {post.statusBadge && (
                      <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-neutral-300 font-mono">
                        {post.statusBadge}
                      </span>
                    )}

                    <span className="text-xs text-neutral-500 pl-1">{post.createdAt}</span>

                    {/* Post Owner Controls: Edit & Delete */}
                    {userOwnsPost && (
                      <div className="flex items-center gap-1 ml-2 border-l border-white/10 pl-2">
                        <button
                          onClick={() => handleStartEditPost(post)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                          title="Edit your post"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Delete your post"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Post Main Body */}
                <div className="space-y-3">
                  <h2 className="text-lg sm:text-xl font-serif text-white font-normal tracking-tight leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal whitespace-pre-line">
                    {post.content}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {post.tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-[11px] text-neutral-400 hover:text-white transition-colors cursor-pointer"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>

                {/* Actions & Counters */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleToggleLike(post.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        post.isLiked
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/5'
                      }`}
                    >
                      <Heart size={14} className={post.isLiked ? 'fill-rose-400' : ''} />
                      <span>{post.likes}</span>
                    </button>

                    <button
                      onClick={() => handleToggleReplies(post.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/5 transition-all cursor-pointer"
                    >
                      <MessageSquare size={14} />
                      <span>{post.repliesCount} Replies</span>
                      {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(window.location.href);
                      showToast('Discussion link copied to clipboard');
                    }}
                    className="p-2 rounded-xl text-neutral-500 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                    title="Share link"
                  >
                    <Share2 size={15} />
                  </button>
                </div>

                {/* Expanded Discussion Replies */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-4 bg-white/[0.02] p-4 sm:p-6 rounded-2xl">
                    <div className="space-y-3">
                      {replies.length === 0 ? (
                        <p className="text-xs text-neutral-500 italic py-2">
                          No replies yet. Be the first to share your perspective.
                        </p>
                      ) : (
                        replies.map((reply) => {
                          const userOwnsReply = isAuthor(reply.authorEmail, reply.author.name);
                          const isEditingThisReply = editingReplyKey === `${post.id}-${reply.id}`;

                          return (
                            <div
                              key={reply.id}
                              className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-2"
                            >
                              <div className="flex items-center justify-between text-[11px]">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-white">{reply.author.name}</span>
                                  {reply.author.institution && (
                                    <span className="text-neutral-500">
                                      · {reply.author.institution}
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className="text-neutral-500">{reply.createdAt}</span>

                                  {/* Reply Owner Controls: Edit & Delete */}
                                  {userOwnsReply && !isEditingThisReply && (
                                    <div className="flex items-center gap-1 border-l border-white/10 pl-2">
                                      <button
                                        onClick={() => handleStartEditReply(post.id, reply)}
                                        className="p-1 rounded text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                                        title="Edit reply"
                                      >
                                        <Edit2 size={11} />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteReply(post.id, reply.id)}
                                        className="p-1 rounded text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                                        title="Delete reply"
                                      >
                                        <Trash2 size={11} />
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {isEditingThisReply ? (
                                <div className="space-y-2 pt-1">
                                  <textarea
                                    value={editReplyContent}
                                    onChange={(e) => setEditReplyContent(e.target.value)}
                                    rows={2}
                                    className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/20 text-white text-xs outline-none focus:border-white/40 transition-all resize-none"
                                  />
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      type="button"
                                      onClick={() => setEditingReplyKey(null)}
                                      className="px-2.5 py-1 rounded-md text-[11px] text-neutral-400 hover:text-white cursor-pointer"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleSaveEditReply(post.id, reply.id)}
                                      className="px-3 py-1 rounded-md bg-white text-black text-[11px] font-semibold hover:bg-neutral-200 cursor-pointer flex items-center gap-1"
                                    >
                                      <Check size={11} />
                                      <span>Save</span>
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-xs text-neutral-300 leading-relaxed font-normal">
                                  {reply.content}
                                </p>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Add Reply Input */}
                    <div className="pt-2 flex items-center gap-2">
                      <input
                        type="text"
                        value={replyInputs[post.id] || ''}
                        onChange={(e) =>
                          setReplyInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddReply(post.id);
                          }
                        }}
                        placeholder="Contribute scientific feedback or partner inquiry..."
                        className="flex-grow px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-white/30 transition-all placeholder:text-neutral-600"
                      />
                      <button
                        onClick={() => handleAddReply(post.id)}
                        className="px-4 py-2 bg-white text-black font-semibold text-xs rounded-xl hover:bg-neutral-200 transition-all cursor-pointer shrink-0 flex items-center gap-1.5"
                      >
                        <Send size={12} />
                        <span>Reply</span>
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>

      {/* Start New Post Modal (2 types: Discussion | Seeking) */}
      <AnimatePresence>
        {isNewPostModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-2xl bg-[#0f0f13] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
            >
              <button
                onClick={() => setIsNewPostModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="mb-6 pr-8">
                <h2 className="text-2xl font-serif text-white tracking-tight">
                  Create New Post
                </h2>
                <p className="text-neutral-400 text-xs mt-1 leading-relaxed">
                  Share a scientific discussion or recruit research partners across the network.
                </p>
              </div>

              <form onSubmit={handleSubmitNewPost} className="space-y-4">
                {/* 2-Type Selector: Discussion | Seeking */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-300">
                    Post Type <span className="text-rose-400">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setNewPostSection('Discussion')}
                      className={`p-3 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer border flex items-center gap-2.5 ${
                        newPostSection === 'Discussion'
                          ? 'bg-white text-black border-white shadow-sm font-bold'
                          : 'bg-white/5 text-neutral-400 border-white/10 hover:text-white'
                      }`}
                    >
                      <MessageSquare size={16} />
                      <div>
                        <div className="text-xs font-bold">Discussion</div>
                        <div className={`text-[10px] ${newPostSection === 'Discussion' ? 'text-neutral-600' : 'text-neutral-500'}`}>
                          Debate methods, share insights & QA
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setNewPostSection('Seeking')}
                      className={`p-3 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer border flex items-center gap-2.5 ${
                        newPostSection === 'Seeking'
                          ? 'bg-white text-black border-white shadow-sm font-bold'
                          : 'bg-white/5 text-neutral-400 border-white/10 hover:text-white'
                      }`}
                    >
                      <Users size={16} />
                      <div>
                        <div className="text-xs font-bold">Seeking</div>
                        <div className={`text-[10px] ${newPostSection === 'Seeking' ? 'text-neutral-600' : 'text-neutral-500'}`}>
                          Recruit partners, team members & skills
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-300">
                    Title <span className="text-rose-400">*</span>
                  </label>
                  <input
                    required
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    placeholder={
                      newPostSection === 'Seeking'
                        ? 'e.g. [Recruitment] Seeking computational biologist for enzyme design...'
                        : 'e.g. Can we leverage cell-free lysates for continuous RNA circuit sensing?'
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-white/30 transition-all placeholder:text-neutral-600"
                  />
                </div>

                {/* Content */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-300">
                    Content & Details <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder={
                      newPostSection === 'Seeking'
                        ? 'Describe the role requirements, project goals, required domain expertise, and how partners can reach out...'
                        : 'Provide scientific background, experimental context, or the core question you want to discuss...'
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-white/30 transition-all placeholder:text-neutral-600 resize-none"
                  />
                </div>

                {/* Tags */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-300">
                    Keywords / Tags (comma separated)
                  </label>
                  <input
                    value={newPostTags}
                    onChange={(e) => setNewPostTags(e.target.value)}
                    placeholder="e.g. Microfluidics, Protein Design, Cryo-EM, Cell-Free"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-white/30 transition-all placeholder:text-neutral-600"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsNewPostModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl text-neutral-400 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingPost}
                    className="px-6 py-2.5 bg-white hover:bg-neutral-200 text-black font-semibold text-xs rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Send size={13} />
                    <span>{isSubmittingPost ? 'Publishing...' : 'Publish Post'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Post Modal */}
      <AnimatePresence>
        {editingPost && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-2xl bg-[#0f0f13] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
            >
              <button
                onClick={() => setEditingPost(null)}
                className="absolute top-6 right-6 p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="mb-6 pr-8">
                <h2 className="text-2xl font-serif text-white tracking-tight">
                  Edit Post
                </h2>
                <p className="text-neutral-400 text-xs mt-1 leading-relaxed">
                  Update the title, category, or content of your published post.
                </p>
              </div>

              <form onSubmit={handleSaveEditPost} className="space-y-4">
                {/* 2-Type Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-300">
                    Post Type <span className="text-rose-400">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setEditSection('Discussion')}
                      className={`p-3 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer border flex items-center gap-2.5 ${
                        editSection === 'Discussion'
                          ? 'bg-white text-black border-white shadow-sm font-bold'
                          : 'bg-white/5 text-neutral-400 border-white/10 hover:text-white'
                      }`}
                    >
                      <MessageSquare size={16} />
                      <div>
                        <div className="text-xs font-bold">Discussion</div>
                        <div className={`text-[10px] ${editSection === 'Discussion' ? 'text-neutral-600' : 'text-neutral-500'}`}>
                          Debate methods, share insights & QA
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditSection('Seeking')}
                      className={`p-3 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer border flex items-center gap-2.5 ${
                        editSection === 'Seeking'
                          ? 'bg-white text-black border-white shadow-sm font-bold'
                          : 'bg-white/5 text-neutral-400 border-white/10 hover:text-white'
                      }`}
                    >
                      <Users size={16} />
                      <div>
                        <div className="text-xs font-bold">Seeking</div>
                        <div className={`text-[10px] ${editSection === 'Seeking' ? 'text-neutral-600' : 'text-neutral-500'}`}>
                          Recruit partners, team members & skills
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-300">
                    Title <span className="text-rose-400">*</span>
                  </label>
                  <input
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-white/30 transition-all"
                  />
                </div>

                {/* Content */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-300">
                    Content <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-white/30 transition-all resize-none"
                  />
                </div>

                {/* Tags */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-300">
                    Keywords / Tags (comma separated)
                  </label>
                  <input
                    value={editTags}
                    onChange={(e) => setEditTags(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-white/30 transition-all"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingPost(null)}
                    className="px-5 py-2.5 rounded-xl text-neutral-400 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-white hover:bg-neutral-200 text-black font-semibold text-xs rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                  >
                    <Check size={13} />
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
