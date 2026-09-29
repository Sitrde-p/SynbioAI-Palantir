/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserAccount, ImaginationNote, LabMatchRequest, UserInterest, InterestStatus, CommunityPost, CommunitySection, DomainCategory } from '../types';
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
  Edit2,
  Tag,
  X,
  FileText,
  RotateCcw,
} from 'lucide-react';
import { RESEARCH_LABS, ResearchLab } from '../data/mockLabs';
import { supabase } from '../supabase';

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
  onApplyToJoinLab?: () => void;
  onGoToCommunity?: (options?: { openNewPost?: boolean; targetPostId?: string; editPost?: CommunityPost }) => void;
}

type DashboardTab = 'ideas' | 'posts' | 'labs' | 'matches' | 'saved' | 'profile';

export interface UserLabAppItem {
  id: string;
  dbId?: string;
  name: string;
  institution: string;
  domain: string;
  researchDirections: string;
  teamOverview?: string;
  pastProjects?: string;
  piName: string;
  contactEmail: string;
  phone?: string;
  status: 'pending' | 'approved' | 'rejected' | 'withdrawn' | string;
  joinedAt: string;
}

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
  onApplyToJoinLab,
  onGoToCommunity,
}: DashboardViewProps) {
  const isAdm =
    currentUser.role === 'admin' ||
    (currentUser.email && currentUser.email.toLowerCase() === 'admin@synbio.org') ||
    (currentUser.name && currentUser.name.toLowerCase() === 'admin') ||
    (currentUser.name && currentUser.name.toLowerCase() === 'system admin');

  const [activeTab, setActiveTab] = useState<DashboardTab>('ideas');
  const [matches, setMatches] = useState<LabMatchRequest[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Profile Settings State
  const [profileName, setProfileName] = useState(
    currentUser.name || (isAdm ? 'System Admin' : 'Researcher')
  );
  const [profileBio, setProfileBio] = useState(currentUser.bio || '');
  const [profileAffiliation, setProfileAffiliation] = useState(
    currentUser.affiliation || (isAdm ? 'Admin' : '')
  );
  const [identityTag, setIdentityTag] = useState(
    currentUser.identityTag || (isAdm ? 'System Administrator' : 'Creator')
  );
  const [notifyEmail, setNotifyEmail] = useState(currentUser.notifications?.emailUpdates ?? true);
  const [notifyMatches, setNotifyMatches] = useState(currentUser.notifications?.labMatches ?? true);
  const [notifyCollab, setNotifyCollab] = useState(
    currentUser.notifications?.collaborationRequests ?? true
  );
  const [notifyWeekly, setNotifyWeekly] = useState(currentUser.notifications?.weeklyDigest ?? false);

  useEffect(() => {
    setProfileName(currentUser.name || (isAdm ? 'System Admin' : 'Researcher'));
    setProfileBio(currentUser.bio || '');
    setProfileAffiliation(currentUser.affiliation || (isAdm ? 'Admin' : ''));
    setIdentityTag(currentUser.identityTag || (isAdm ? 'System Administrator' : 'Creator'));
  }, [currentUser, isAdm]);

  // 1. User Ideas State
  const [supabaseIdeas, setSupabaseIdeas] = useState<ImaginationNote[]>([]);
  const [editingIdea, setEditingIdea] = useState<ImaginationNote | null>(null);
  const [editIdeaTitle, setEditIdeaTitle] = useState('');
  const [editIdeaDesc, setEditIdeaDesc] = useState('');
  const [editIdeaDomain, setEditIdeaDomain] = useState<DomainCategory>('Biomedicine');
  const [editIdeaTags, setEditIdeaTags] = useState('');

  const fetchUserIdeas = async () => {
    if (!currentUser) {
      setSupabaseIdeas([]);
      return;
    }
    try {
      let query = supabase.from('ideas').select('*');
      if (currentUser.id) {
        query = query.eq('author_id', currentUser.id);
      } else if (currentUser.name) {
        query = query.eq('author_name', currentUser.name);
      }
      const { data, error } = await query.order('created_at', { ascending: false });
      if (!error && data) {
        const mapped: ImaginationNote[] = data.map((item: any) => {
          const rowId = item.id?.toString() || `note_${Date.now()}`;
          return {
            id: rowId,
            dbId: rowId,
            isMock: false,
            title: item.title,
            domain: item.domain || 'Biomedicine',
            description: item.hypothesis || '',
            fullDetails:
              item.hypothesis ||
              `## Project Vision & Scientific Scope\n${item.hypothesis}\n\n### Anticipated Breakthrough\nInitiated by ${item.author_name || 'Independent Researcher'} for collaborative validation.`,
            location: item.host_lab || 'Global Bio-Node',
            createdAt: item.created_at || new Date().toISOString(),
            author: {
              name: item.author_name || currentUser.name,
              role: 'Verified Investigator',
              avatar:
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=160',
              institution: item.host_lab || currentUser.affiliation || 'Open Science Frontier Collective',
            },
            image:
              'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=1200',
            tags: Array.isArray(item.keywords)
              ? item.keywords
              : item.keywords
              ? item.keywords.split(',')
              : [item.domain || 'Synthetic Biology'],
            stage: 'Idea',
            likes: item.likes || 0,
            comments: 0,
            commentsList: [],
            isLiked: false,
            isUserSubmitted: true,
            status: 'Connecting',
          };
        });
        setSupabaseIdeas(mapped);
      }
    } catch (err) {
      console.warn('Could not load user ideas from Supabase:', err);
    }
  };

  useEffect(() => {
    fetchUserIdeas();
  }, [currentUser]);

  // 2. User Posts State
  const [userPosts, setUserPosts] = useState<CommunityPost[]>([]);
  const [editingPost, setEditingPost] = useState<CommunityPost | null>(null);
  const [editPostTitle, setEditPostTitle] = useState('');
  const [editPostContent, setEditPostContent] = useState('');
  const [editPostSection, setEditPostSection] = useState<CommunitySection>('Discussion');
  const [editPostTags, setEditPostTags] = useState('');
  const [viewingPostDetail, setViewingPostDetail] = useState<CommunityPost | null>(null);

  const fetchUserPosts = async () => {
    if (!currentUser || !currentUser.id) {
      setUserPosts([]);
      return;
    }
    console.log('Fetching user posts for author_id =', currentUser.id);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('author_id', currentUser.id)
        .order('created_at', { ascending: false });

      console.log('User posts query result:', data, 'error:', error);
      if (error) {
        console.error('Error fetching user posts from Supabase:', error);
        return;
      }
      if (data) {
        const mapped: CommunityPost[] = data.map((item: any) => {
          const rowId = item.id?.toString() || `post-${Date.now()}`;
          return {
            id: rowId,
            dbId: rowId,
            isMock: false,
            section: (item.post_type === 'Seeking' ? 'Seeking' : 'Discussion') as CommunitySection,
            title: item.title,
            content: item.content,
            author: {
              name: currentUser.name || 'Verified Investigator',
              role: currentUser.identityTag || 'Researcher',
              institution: currentUser.affiliation || 'Department of Bioengineering',
            },
            authorEmail: currentUser.email,
            authorId: item.author_id || currentUser.id,
            tags: Array.isArray(item.tags)
              ? item.tags
              : item.tags
              ? item.tags.split(',')
              : ['Synthetic Biology'],
            likes: item.likes || 1,
            isLiked: false,
            repliesCount: Array.isArray(item.replies) ? item.replies.length : 0,
            replies: Array.isArray(item.replies) ? item.replies : [],
            createdAt: item.created_at
              ? new Date(item.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : 'Recent',
            statusBadge: item.post_type === 'Seeking' ? 'Seeking Partners' : 'Discussion',
          };
        });
        setUserPosts(mapped);
      }
    } catch (err) {
      console.warn('Could not load user posts from Supabase:', err);
    }
  };

  useEffect(() => {
    fetchUserPosts();

    const handleUpdate = () => {
      fetchUserPosts();
    };
    window.addEventListener('synbio_posts_updated', handleUpdate);
    return () => {
      window.removeEventListener('synbio_posts_updated', handleUpdate);
    };
  }, [currentUser]);

  // 3. User Interests State
  const [userInterests, setUserInterests] = useState<UserInterest[]>([]);
  const [editingInterest, setEditingInterest] = useState<UserInterest | null>(null);
  const [editInterestTopic, setEditInterestTopic] = useState('');
  const [editInterestType, setEditInterestType] = useState('Joint Experimental Validation');
  const [editInterestSummary, setEditInterestSummary] = useState('');
  const [viewingInterestDetail, setViewingInterestDetail] = useState<UserInterest | null>(null);

  const fetchUserInterests = async () => {
    if (!currentUser) {
      setUserInterests([]);
      return;
    }
    try {
      let query = supabase.from('interests').select('*');
      if (currentUser.id) {
        if (currentUser.email) {
          query = query.or(`user_id.eq.${currentUser.id},contact_email.eq.${currentUser.email}`);
        } else {
          query = query.eq('user_id', currentUser.id);
        }
      } else if (currentUser.email) {
        query = query.eq('contact_email', currentUser.email);
      } else if (currentUser.name) {
        query = query.eq('full_name', currentUser.name);
      }
      const { data, error } = await query.order('created_at', { ascending: false });
      if (!error && data) {
        const mapped: UserInterest[] = data.map((item: any) => {
          const matchedLab = RESEARCH_LABS.find((l) => l.id === item.lab_id || l.dbId === item.lab_id);
          const rowId = item.id?.toString() || `interest-${Date.now()}`;
          return {
            id: rowId,
            dbId: rowId,
            isMock: false,
            labId: item.lab_id,
            labName: matchedLab?.name || 'Partner Laboratory',
            institution: matchedLab?.institution || item.affiliation || 'Research Institute',
            matchScore: 95,
            status: item.status || 'pending',
            proposedTopic: item.proposed_topic || 'Collaboration Topic',
            collaborationType: item.collaboration_type || 'Joint Research',
            projectSummary: item.proposal_details || '',
            applicantName: item.full_name || currentUser.name,
            applicantEmail: item.contact_email || currentUser.email,
            organization: item.affiliation,
            createdAt: item.created_at || new Date().toISOString(),
            timestampDisplay: item.created_at
              ? new Date(item.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : 'Recent',
          };
        });
        setUserInterests(mapped);
      }
    } catch (err) {
      console.warn('Could not load interests from Supabase:', err);
    }
  };

  useEffect(() => {
    fetchUserInterests();

    const handleUpdate = () => {
      fetchUserInterests();
    };
    window.addEventListener('synbio_interests_updated', handleUpdate);
    return () => {
      window.removeEventListener('synbio_interests_updated', handleUpdate);
    };
  }, [currentUser]);

  // 4. User Lab Applications State
  const [userLabApplications, setUserLabApplications] = useState<UserLabAppItem[]>([]);
  const [viewingLabAppDetail, setViewingLabAppDetail] = useState<UserLabAppItem | null>(null);
  const [editingLabApp, setEditingLabApp] = useState<UserLabAppItem | null>(null);
  const [editLabName, setEditLabName] = useState('');
  const [editLabInstitution, setEditLabInstitution] = useState('');
  const [editLabDomain, setEditLabDomain] = useState('Synthetic Biology');
  const [editLabDirections, setEditLabDirections] = useState('');
  const [editLabTeamOverview, setEditLabTeamOverview] = useState('');
  const [editLabPastProjects, setEditLabPastProjects] = useState('');
  const [editLabPiName, setEditLabPiName] = useState('');
  const [editLabContactEmail, setEditLabContactEmail] = useState('');
  const [editLabPhone, setEditLabPhone] = useState('');

  const fetchUserLabApplications = async () => {
    if (!currentUser) {
      setUserLabApplications([]);
      return;
    }
    try {
      let query = supabase.from('labs').select('*');
      if (currentUser.id) {
        if (currentUser.email) {
          query = query.or(`user_id.eq.${currentUser.id},contact_email.eq.${currentUser.email}`);
        } else {
          query = query.eq('user_id', currentUser.id);
        }
      } else if (currentUser.email) {
        query = query.eq('contact_email', currentUser.email);
      } else if (currentUser.name) {
        query = query.eq('pi_name', currentUser.name);
      }
      const { data, error } = await query.order('joined_at', { ascending: false });
      if (!error && data) {
        const mapped: UserLabAppItem[] = data.map((item: any) => {
          const rowId = item.id?.toString() || `lab-app-${Date.now()}`;
          return {
            id: rowId,
            dbId: rowId,
            name: item.name,
            institution: item.institution || 'Research Institution',
            domain: item.domain || 'Synthetic Biology',
            researchDirections: Array.isArray(item.research_directions)
              ? item.research_directions.join(', ')
              : item.research_directions || '',
            teamOverview: item.team_overview || '',
            pastProjects: item.past_projects || '',
            piName: item.pi_name || currentUser.name,
            contactEmail: item.contact_email || currentUser.email,
            phone: item.phone,
            status: item.status || 'pending',
            joinedAt: item.joined_at
              ? new Date(item.joined_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : 'Recent',
          };
        });
        setUserLabApplications(mapped);
      }
    } catch (err) {
      console.warn('Could not load user lab applications:', err);
    }
  };

  useEffect(() => {
    fetchUserLabApplications();

    const handleLabsUpdated = () => {
      fetchUserLabApplications();
    };
    window.addEventListener('synbio_labs_updated', handleLabsUpdated);
    return () => {
      window.removeEventListener('synbio_labs_updated', handleLabsUpdated);
    };
  }, [currentUser]);

  // Ideas Tab Edit Handler
  const handleStartEditIdea = (note: ImaginationNote) => {
    setEditingIdea(note);
    setEditIdeaTitle(note.title);
    setEditIdeaDesc(note.description);
    setEditIdeaDomain(note.domain);
    setEditIdeaTags(note.tags.join(', '));
  };

  const handleSaveEditIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingIdea || !editIdeaTitle.trim() || !editIdeaDesc.trim()) return;

    const tagList = editIdeaTags
      .split(/[,，\s]+/)
      .map((t) => t.trim())
      .filter(Boolean);

    const targetDbId = editingIdea.dbId || editingIdea.id;
    console.log('Calling Supabase update on ideas...', targetDbId);

    try {
      const { error } = await supabase
        .from('ideas')
        .update({
          title: editIdeaTitle.trim(),
          hypothesis: editIdeaDesc.trim(),
          domain: editIdeaDomain,
          keywords: tagList.length > 0 ? tagList : [editIdeaDomain],
        })
        .eq('id', targetDbId);

      if (error) {
        console.error('Failed to update idea in Supabase:', error);
        showToast(`Failed to update idea: ${error.message || 'Database error'}`);
        return;
      }
    } catch (err: any) {
      console.error('Error updating idea:', err);
      showToast(`Failed to update idea: ${err?.message || 'Database error'}`);
      return;
    }

    setSupabaseIdeas((prev) =>
      prev.map((n) =>
        n.id === editingIdea.id
          ? {
              ...n,
              title: editIdeaTitle.trim(),
              description: editIdeaDesc.trim(),
              domain: editIdeaDomain,
              tags: tagList.length > 0 ? tagList : [editIdeaDomain],
            }
          : n
      )
    );

    setEditingIdea(null);
    showToast('Idea updated successfully');
  };

  // Posts Tab Handlers
  const handleStartEditPost = (post: CommunityPost) => {
    setEditingPost(post);
    setEditPostTitle(post.title);
    setEditPostContent(post.content);
    setEditPostSection(post.section);
    setEditPostTags(post.tags.join(', '));
  };

  const handleSaveEditPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost || !editPostTitle.trim() || !editPostContent.trim()) return;

    const tagList = editPostTags
      .split(/[,，\s]+/)
      .map((t) => t.trim())
      .filter(Boolean);

    const targetDbId = editingPost.dbId || editingPost.id;
    console.log('Calling Supabase update on posts...', targetDbId);

    try {
      const { error } = await supabase
        .from('posts')
        .update({
          title: editPostTitle.trim(),
          content: editPostContent.trim(),
          post_type: editPostSection,
          tags: tagList.length > 0 ? tagList : ['Synthetic Biology'],
        })
        .eq('id', targetDbId);

      if (error) {
        console.error('Failed to update post in Supabase:', error);
        showToast(`Failed to update post: ${error.message || 'Database error'}`);
        return;
      }
    } catch (err: any) {
      console.error('Error updating post:', err);
      showToast(`Failed to update post: ${err?.message || 'Database error'}`);
      return;
    }

    setUserPosts((prev) =>
      prev.map((p) =>
        p.id === editingPost.id
          ? {
              ...p,
              title: editPostTitle.trim(),
              content: editPostContent.trim(),
              section: editPostSection,
              tags: tagList.length > 0 ? tagList : ['Synthetic Biology'],
              statusBadge: editPostSection === 'Seeking' ? 'Seeking Partners' : 'Discussion',
            }
          : p
      )
    );

    setEditingPost(null);
    showToast('Post updated successfully');
  };

  const handleDeletePost = async (post: CommunityPost) => {
    const targetDbId = post.dbId || post.id;
    console.log('Calling Supabase delete on posts...', targetDbId);

    try {
      const { error } = await supabase.from('posts').delete().eq('id', targetDbId);
      if (error) {
        console.error('Failed to delete post in Supabase:', error);
        showToast(`Failed to delete post: ${error.message || 'Database error'}`);
        return;
      }
    } catch (err: any) {
      console.error('Error deleting post:', err);
      showToast(`Failed to delete post: ${err?.message || 'Database error'}`);
      return;
    }

    setUserPosts((prev) => prev.filter((p) => p.id !== post.id && p.dbId !== post.id));
    if (viewingPostDetail && viewingPostDetail.id === post.id) {
      setViewingPostDetail(null);
    }
    showToast('Post deleted successfully');
  };

  // Interests Handlers
  const handleStartEditInterest = (item: UserInterest) => {
    setEditingInterest(item);
    setEditInterestTopic(item.proposedTopic);
    setEditInterestType(item.collaborationType);
    setEditInterestSummary(item.projectSummary);
  };

  const handleSaveEditInterest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInterest || !editInterestTopic.trim() || !editInterestSummary.trim()) return;

    const targetDbId = editingInterest.dbId || editingInterest.id;
    console.log('Calling Supabase update on interests...', targetDbId);

    try {
      const { error } = await supabase
        .from('interests')
        .update({
          proposed_topic: editInterestTopic.trim(),
          collaboration_type: editInterestType.trim(),
          proposal_details: editInterestSummary.trim(),
        })
        .eq('id', targetDbId);

      if (error) {
        console.error('Failed to update interest in Supabase:', error);
        showToast(`Failed to update interest: ${error.message || 'Database error'}`);
        return;
      }
    } catch (err: any) {
      console.error('Error updating interest:', err);
      showToast(`Failed to update interest: ${err?.message || 'Database error'}`);
      return;
    }

    setUserInterests((prev) =>
      prev.map((item) =>
        item.id === editingInterest.id
          ? {
              ...item,
              proposedTopic: editInterestTopic.trim(),
              collaborationType: editInterestType.trim(),
              projectSummary: editInterestSummary.trim(),
            }
          : item
      )
    );

    setEditingInterest(null);
    showToast('Collaboration proposal updated successfully');
  };

  const handleToggleInterestWithdraw = async (item: UserInterest) => {
    const isCurrentlyWithdrawn =
      String(item.status).toLowerCase() === 'withdrawn';
    const nextStatus = isCurrentlyWithdrawn ? 'pending' : 'withdrawn';
    const targetDbId = item.dbId || item.id;
    console.log('Calling Supabase update on interests (status)...', targetDbId, nextStatus);

    try {
      const { error } = await supabase
        .from('interests')
        .update({ status: nextStatus })
        .eq('id', targetDbId);

      if (error) {
        console.error('Failed to update interest status:', error);
        showToast(`Failed to update status: ${error.message || 'Database error'}`);
        return;
      }
    } catch (err: any) {
      console.error('Error updating interest status:', err);
      showToast(`Failed to update status: ${err?.message || 'Database error'}`);
      return;
    }

    setUserInterests((prev) =>
      prev.map((i) =>
        i.id === item.id
          ? { ...i, status: (isCurrentlyWithdrawn ? 'Pending' : 'Withdrawn') as InterestStatus }
          : i
      )
    );

    showToast(
      isCurrentlyWithdrawn
        ? 'Expression of interest re-activated!'
        : 'Expression of interest withdrawn.'
    );
  };

  const handleDeleteInterest = async (item: UserInterest) => {
    const targetDbId = item.dbId || item.id;
    console.log('Calling Supabase delete on interests...', targetDbId);

    try {
      const { error } = await supabase.from('interests').delete().eq('id', targetDbId);
      if (error) {
        console.error('Failed to delete interest in Supabase:', error);
        showToast(`Failed to delete interest: ${error.message || 'Database error'}`);
        return;
      }
    } catch (err: any) {
      console.error('Error deleting interest:', err);
      showToast(`Failed to delete interest: ${err?.message || 'Database error'}`);
      return;
    }

    setUserInterests((prev) => prev.filter((i) => i.id !== item.id && i.dbId !== item.id));
    if (viewingInterestDetail && viewingInterestDetail.id === item.id) {
      setViewingInterestDetail(null);
    }
    window.dispatchEvent(new Event('synbio_interests_updated'));
    showToast('Expression of interest deleted');
  };

  // Lab Application Handlers
  const handleToggleLabAppWithdraw = async (labApp: UserLabAppItem) => {
    const isCurrentlyWithdrawn =
      labApp.status === 'withdrawn' || labApp.status === 'Withdrawn';
    const nextStatus = isCurrentlyWithdrawn ? 'pending' : 'withdrawn';
    const targetDbId = labApp.dbId || labApp.id;
    console.log('Calling Supabase update on labs (status)...', targetDbId, nextStatus);

    try {
      const { error } = await supabase
        .from('labs')
        .update({ status: nextStatus })
        .eq('id', targetDbId);

      if (error) {
        console.error('Failed to update lab application status:', error);
        showToast(`Failed to update application: ${error.message || 'Database error'}`);
        return;
      }
    } catch (err: any) {
      console.error('Error updating lab application status:', err);
      showToast(`Failed to update application: ${err?.message || 'Database error'}`);
      return;
    }

    setUserLabApplications((prev) =>
      prev.map((l) => (l.id === labApp.id ? { ...l, status: nextStatus } : l))
    );
    window.dispatchEvent(new Event('synbio_labs_updated'));
    showToast(
      isCurrentlyWithdrawn
        ? 'Lab onboarding application re-submitted!'
        : 'Lab onboarding application withdrawn.'
    );
  };

  const handleDeleteLabApp = async (labApp: UserLabAppItem) => {
    const targetDbId = labApp.dbId || labApp.id;
    console.log('Calling Supabase delete on labs...', targetDbId);

    try {
      const { error } = await supabase.from('labs').delete().eq('id', targetDbId);
      if (error) {
        console.error('Failed to delete lab application in Supabase:', error);
        showToast(`Failed to delete application: ${error.message || 'Database error'}`);
        return;
      }
    } catch (err: any) {
      console.error('Error deleting lab application:', err);
      showToast(`Failed to delete application: ${err?.message || 'Database error'}`);
      return;
    }

    setUserLabApplications((prev) =>
      prev.filter((l) => l.id !== labApp.id && l.dbId !== labApp.id)
    );
    if (viewingLabAppDetail && viewingLabAppDetail.id === labApp.id) {
      setViewingLabAppDetail(null);
    }
    window.dispatchEvent(new Event('synbio_labs_updated'));
    showToast('Lab application deleted');
  };

  const handleStartEditLabApp = (labApp: UserLabAppItem) => {
    setEditingLabApp(labApp);
    setEditLabName(labApp.name);
    setEditLabInstitution(labApp.institution);
    setEditLabDomain(labApp.domain);
    setEditLabDirections(labApp.researchDirections);
    setEditLabTeamOverview(labApp.teamOverview || '');
    setEditLabPastProjects(labApp.pastProjects || '');
    setEditLabPiName(labApp.piName);
    setEditLabContactEmail(labApp.contactEmail);
    setEditLabPhone(labApp.phone || '');
  };

  const handleSaveEditLabApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLabApp || !editLabName.trim() || !editLabInstitution.trim()) return;

    const targetDbId = editingLabApp.dbId || editingLabApp.id;
    console.log('Calling Supabase update on labs...', targetDbId);

    try {
      const { error } = await supabase
        .from('labs')
        .update({
          name: editLabName.trim(),
          institution: editLabInstitution.trim(),
          domain: editLabDomain,
          research_directions: editLabDirections.trim(),
          team_overview: editLabTeamOverview.trim(),
          past_projects: editLabPastProjects.trim(),
          pi_name: editLabPiName.trim(),
          contact_email: editLabContactEmail.trim(),
          phone: editLabPhone.trim(),
        })
        .eq('id', targetDbId);

      if (error) {
        console.error('Failed to update lab application in Supabase:', error);
        showToast(`Failed to update application: ${error.message || 'Database error'}`);
        return;
      }
    } catch (err: any) {
      console.error('Error updating lab application:', err);
      showToast(`Failed to update application: ${err?.message || 'Database error'}`);
      return;
    }

    setUserLabApplications((prev) =>
      prev.map((l) =>
        l.id === editingLabApp.id
          ? {
              ...l,
              name: editLabName.trim(),
              institution: editLabInstitution.trim(),
              domain: editLabDomain,
              researchDirections: editLabDirections.trim(),
              teamOverview: editLabTeamOverview.trim(),
              pastProjects: editLabPastProjects.trim(),
              piName: editLabPiName.trim(),
              contactEmail: editLabContactEmail.trim(),
              phone: editLabPhone.trim(),
            }
          : l
      )
    );

    setEditingLabApp(null);
    window.dispatchEvent(new Event('synbio_labs_updated'));
    showToast('Lab application updated successfully');
  };

  const getInterestStatusBadge = (status: InterestStatus | string) => {
    const normalized = (status || '').toLowerCase();
    switch (normalized) {
      case 'pending':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px] font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Pending
          </span>
        );
      case 'in discussion':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-[11px] font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            In Discussion
          </span>
        );
      case 'accepted':
      case 'approved':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[11px] font-semibold">
            Rejected
          </span>
        );
      case 'withdrawn':
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-neutral-800 text-neutral-400 border border-neutral-700 text-[11px] font-semibold">
            Withdrawn
          </span>
        );
    }
  };

  // Filter Submissions: user-authored ideas from Supabase or props
  const myIdeas = (
    supabaseIdeas.length > 0
      ? supabaseIdeas
      : userSubmissions.filter(
          (note) =>
            note.isUserSubmitted &&
            currentUser &&
            ((note.authorEmail &&
              currentUser.email &&
              note.authorEmail.toLowerCase() === currentUser.email.toLowerCase()) ||
              (note.author?.name &&
                currentUser.name &&
                note.author.name.toLowerCase() === currentUser.name.toLowerCase()))
        )
  ).map((note) => ({
    ...note,
    status: note.status || 'Connecting',
  }));

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
    showToast('Profile updated successfully');
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
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 bg-[#18181b] border border-white/20 text-white text-xs font-semibold rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header matching requirements */}
      <div className="mb-10">
        <h1 className="text-4xl sm:text-5xl font-serif text-white tracking-tight mb-2 font-normal">
          Hi, {isAdm ? 'System Admin' : (currentUser.name || 'Researcher')}
        </h1>
        <p className="text-neutral-400 text-sm font-medium">
          Manage your ideas, matches & collaborations.
        </p>
      </div>

      {/* Tab Navigation: Ideas | Posts | Labs | Matches | Saved | Profile Settings */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-10">
        <button
          onClick={() => setActiveTab('ideas')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'ideas'
              ? 'bg-[#e5e5e7] text-black shadow-sm'
              : 'bg-[#18181b] text-neutral-400 hover:text-white border border-white/5'
          }`}
        >
          Ideas
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] ${
              activeTab === 'ideas' ? 'bg-black/10 text-black' : 'bg-white/10 text-neutral-400'
            }`}
          >
            {myIdeas.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('posts')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'posts'
              ? 'bg-[#e5e5e7] text-black shadow-sm'
              : 'bg-[#18181b] text-neutral-400 hover:text-white border border-white/5'
          }`}
        >
          Posts
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] ${
              activeTab === 'posts' ? 'bg-black/10 text-black' : 'bg-white/10 text-neutral-400'
            }`}
          >
            {userPosts.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('labs')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'labs'
              ? 'bg-[#e5e5e7] text-black shadow-sm'
              : 'bg-[#18181b] text-neutral-400 hover:text-white border border-white/5'
          }`}
        >
          Labs
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] ${
              activeTab === 'labs' ? 'bg-black/10 text-black' : 'bg-white/10 text-neutral-400'
            }`}
          >
            {userInterests.length + userLabApplications.length}
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

      {/* Tab 1: Ideas */}
      {activeTab === 'ideas' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-serif text-white tracking-tight">
              Share your frontier ideas.
            </h2>
            <span className="text-xs text-neutral-500 font-medium">
              {myIdeas.length} {myIdeas.length === 1 ? 'idea' : 'ideas'}
            </span>
          </div>

          {myIdeas.length === 0 ? (
            <div className="p-12 sm:p-16 rounded-3xl bg-[#0e0e11] border border-white/10 text-center space-y-4">
              <h3 className="text-lg font-serif text-white">No ideas published yet</h3>
              <div className="pt-2">
                <button
                  onClick={onPostIdea}
                  className="px-6 py-3 bg-white hover:bg-neutral-200 text-black text-xs font-semibold rounded-xl transition-all shadow-sm inline-flex items-center gap-2 cursor-pointer"
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

                  <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/5">
                    <button
                      onClick={() => onSelectNote(note)}
                      className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-neutral-300 hover:text-white transition-colors cursor-pointer"
                    >
                      View Details &gt;
                    </button>
                    <button
                      onClick={() => handleStartEditIdea(note)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                      title="Edit Idea"
                    >
                      <Edit2 size={15} />
                    </button>
                    {onDeleteNote && (
                      <button
                        onClick={() => onDeleteNote(note.id)}
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 transition-colors cursor-pointer"
                        title="Delete Idea"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Posts (新增) */}
      {activeTab === 'posts' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-serif text-white tracking-tight">
              Discussions and inquiries you've shared.
            </h2>
            <span className="text-xs text-neutral-500 font-medium">
              {userPosts.length} {userPosts.length === 1 ? 'post' : 'posts'}
            </span>
          </div>

          {userPosts.length === 0 ? (
            <div className="p-12 sm:p-16 rounded-3xl bg-[#0e0e11] border border-white/10 text-center space-y-4">
              <h3 className="text-lg font-serif text-white">No posts published yet</h3>
              <div className="pt-2">
                <button
                  onClick={() => onGoToCommunity?.({ openNewPost: true })}
                  className="px-6 py-3 bg-white hover:bg-neutral-200 text-black text-xs font-semibold rounded-xl transition-all shadow-sm inline-flex items-center gap-2 cursor-pointer"
                >
                  <Plus size={16} strokeWidth={2.4} className="shrink-0" />
                  <span>New Post</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {userPosts.map((post) => (
                <div
                  key={post.id}
                  className="p-5 sm:p-6 rounded-2xl bg-[#0c0c0f] border border-white/10 hover:border-white/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div
                    onClick={() => {
                      if (onGoToCommunity) {
                        onGoToCommunity({ targetPostId: post.id });
                      } else {
                        setViewingPostDetail(post);
                      }
                    }}
                    className="cursor-pointer space-y-2 max-w-3xl"
                  >
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                          post.section === 'Seeking'
                            ? 'bg-violet-500/10 text-violet-400 border-violet-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }`}
                      >
                        {post.section}
                      </span>
                      <span className="text-xs text-neutral-500">•</span>
                      <span className="text-xs text-neutral-500">{post.createdAt}</span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-white hover:text-neutral-200 transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                      {post.content}
                    </p>

                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-neutral-400 font-mono"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/5">
                    <button
                      onClick={() => {
                        if (onGoToCommunity) {
                          onGoToCommunity({ targetPostId: post.id });
                        } else {
                          setViewingPostDetail(post);
                        }
                      }}
                      className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-neutral-300 hover:text-white transition-colors cursor-pointer"
                    >
                      View Post &gt;
                    </button>
                    <button
                      onClick={() => {
                        if (onGoToCommunity) {
                          onGoToCommunity({ editPost: post });
                        } else {
                          handleStartEditPost(post);
                        }
                      }}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                      title="Edit Post"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => handleDeletePost(post)}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 transition-colors cursor-pointer"
                      title="Delete Post"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Labs (合并了 Interests + Lab Applications) */}
      {activeTab === 'labs' && (
        <div className="space-y-12">
          {/* Section 1: Labs you've reached out to (Interests) */}
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-serif text-white tracking-tight">
                  Labs you've reached out to.
                </h2>
              </div>
              <span className="text-xs text-neutral-500 font-medium">
                {userInterests.length} {userInterests.length === 1 ? 'expression' : 'expressions'}
              </span>
            </div>

            {userInterests.length === 0 ? (
              <div className="p-12 sm:p-16 rounded-3xl bg-[#0e0e11] border border-white/10 text-center space-y-4">
                <h3 className="text-lg font-serif text-white">No interests expressed yet</h3>
                <div className="pt-2">
                  <button
                    onClick={onBrowseLabs || onBrowseIdeas}
                    className="px-6 py-3 bg-white hover:bg-neutral-200 text-black text-xs font-semibold rounded-xl transition-all shadow-sm inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span>Explore Labs &rarr;</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {userInterests.map((item) => {
                  const normalizedStatus = (item.status || 'pending').toLowerCase();
                  const isPending =
                    normalizedStatus === 'pending' || normalizedStatus === 'in discussion';
                  const isWithdrawn = normalizedStatus === 'withdrawn';
                  const isApproved =
                    normalizedStatus === 'approved' || normalizedStatus === 'accepted';
                  const isRejected = normalizedStatus === 'rejected';

                  return (
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
                          {getInterestStatusBadge(item.status)}
                        </div>
                      </div>

                      <div
                        onClick={() => setViewingInterestDetail(item)}
                        className="space-y-2 cursor-pointer"
                      >
                        <div className="text-xs text-neutral-400">
                          <span className="text-neutral-500 font-medium">Proposed Topic:</span>{' '}
                          <span className="text-neutral-200 font-semibold">{item.proposedTopic}</span>
                        </div>

                        <div className="text-xs text-neutral-400">
                          <span className="text-neutral-500 font-medium">Collaboration Type:</span>{' '}
                          <span className="text-neutral-300">{item.collaborationType}</span>
                        </div>

                        {item.projectSummary && (
                          <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-xs text-neutral-300 leading-relaxed">
                            <div className="text-neutral-400 mb-1 font-bold">
                              Submitted Proposal & Technical Needs:
                            </div>
                            <p className="text-neutral-200 line-clamp-3">{item.projectSummary}</p>
                          </div>
                        )}
                      </div>

                      <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                        <span className="text-xs text-neutral-500 font-medium flex items-center gap-1.5">
                          <Clock size={13} className="text-neutral-500" />
                          <span>
                            Initiated {item.timestampDisplay || new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </span>

                        <div className="flex items-center gap-2">
                          {/* 1. View Details >: always shown */}
                          <button
                            onClick={() => setViewingInterestDetail(item)}
                            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                          >
                            View Details &gt;
                          </button>

                          {/* 2. Withdraw: shown when pending */}
                          {isPending && (
                            <button
                              onClick={() => handleToggleInterestWithdraw(item)}
                              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 border border-white/5 hover:border-rose-500/20 transition-all cursor-pointer"
                              title="Withdraw"
                            >
                              Withdraw
                            </button>
                          )}

                          {/* 3. Re-apply: shown when withdrawn */}
                          {isWithdrawn && (
                            <button
                              onClick={() => handleToggleInterestWithdraw(item)}
                              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 transition-all cursor-pointer flex items-center gap-1.5"
                              title="Re-apply"
                            >
                              <RotateCcw size={13} />
                              <span>Re-apply</span>
                            </button>
                          )}

                          {/* 4. Edit: shown when withdrawn, approved, or rejected */}
                          {(isWithdrawn || isApproved || isRejected) && (
                            <button
                              onClick={() => handleStartEditInterest(item)}
                              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/5 transition-colors cursor-pointer flex items-center justify-center"
                              title="Edit"
                            >
                              <Edit2 size={14} />
                            </button>
                          )}

                          {/* 5. Delete: shown when withdrawn or rejected */}
                          {(isWithdrawn || isRejected) && (
                            <button
                              onClick={() => handleDeleteInterest(item)}
                              className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 transition-colors cursor-pointer flex items-center justify-center"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 2: Labs you've applied to join (Lab Applications) */}
          <div className="space-y-5 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-serif text-white tracking-tight">
                  Labs you've applied to join.
                </h2>
              </div>
              <span className="text-xs text-neutral-500 font-medium">
                {userLabApplications.length} {userLabApplications.length === 1 ? 'application' : 'applications'}
              </span>
            </div>

            {userLabApplications.length === 0 ? (
              <div className="p-12 sm:p-16 rounded-3xl bg-[#0e0e11] border border-white/10 text-center space-y-4">
                <h3 className="text-lg font-serif text-white">No lab applications yet</h3>
                <div className="pt-2">
                  <button
                    onClick={onApplyToJoinLab || onBrowseLabs}
                    className="px-6 py-3 bg-white hover:bg-neutral-200 text-black text-xs font-semibold rounded-xl transition-all shadow-sm inline-flex items-center gap-2 cursor-pointer"
                  >
                    <Plus size={16} strokeWidth={2.4} className="shrink-0" />
                    <span>Apply to Join</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {userLabApplications.map((labApp) => {
                  const normalizedStatus = (labApp.status || 'pending').toLowerCase();
                  const isPending =
                    normalizedStatus === 'pending' || normalizedStatus === 'in discussion';
                  const isWithdrawn = normalizedStatus === 'withdrawn';
                  const isApproved =
                    normalizedStatus === 'approved' || normalizedStatus === 'accepted';
                  const isRejected = normalizedStatus === 'rejected';

                  return (
                    <div
                      key={labApp.id}
                      className="p-6 rounded-2xl bg-[#0c0c0f] border border-white/10 hover:border-white/20 transition-all space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
                        <div>
                          <h3 className="text-base font-bold text-white">{labApp.name}</h3>
                          <div className="flex items-center gap-2 text-xs text-neutral-400 mt-1">
                            <Building2 size={12} className="text-neutral-500" />
                            <span>{labApp.institution}</span>
                            <span className="text-neutral-600">•</span>
                            <span className="text-neutral-300 font-medium">{labApp.domain}</span>
                          </div>
                        </div>

                        <div>{getInterestStatusBadge(labApp.status)}</div>
                      </div>

                      <div
                        onClick={() => setViewingLabAppDetail(labApp)}
                        className="space-y-2 cursor-pointer"
                      >
                        {labApp.researchDirections && (
                          <div className="text-xs text-neutral-300">
                            <span className="text-neutral-500 font-medium">Research Focus: </span>
                            <span>{labApp.researchDirections}</span>
                          </div>
                        )}
                        <div className="text-xs text-neutral-400">
                          <span className="text-neutral-500 font-medium">Lead PI: </span>
                          <span className="text-neutral-200 font-semibold">{labApp.piName}</span>
                          {labApp.contactEmail && (
                            <span className="text-neutral-500 font-mono ml-2">
                              ({labApp.contactEmail})
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                        <span className="text-xs text-neutral-500 font-medium flex items-center gap-1.5">
                          <Clock size={13} className="text-neutral-500" />
                          <span>Submitted {labApp.joinedAt}</span>
                        </span>

                        <div className="flex items-center gap-2">
                          {/* 1. View Details >: always shown */}
                          <button
                            onClick={() => setViewingLabAppDetail(labApp)}
                            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                          >
                            View Details &gt;
                          </button>

                          {/* 2. Withdraw: shown when pending */}
                          {isPending && (
                            <button
                              onClick={() => handleToggleLabAppWithdraw(labApp)}
                              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 border border-white/5 hover:border-rose-500/20 transition-all cursor-pointer"
                              title="Withdraw"
                            >
                              Withdraw
                            </button>
                          )}

                          {/* 3. Re-apply: shown when withdrawn */}
                          {isWithdrawn && (
                            <button
                              onClick={() => handleToggleLabAppWithdraw(labApp)}
                              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 transition-all cursor-pointer flex items-center gap-1.5"
                              title="Re-apply"
                            >
                              <RotateCcw size={13} />
                              <span>Re-apply</span>
                            </button>
                          )}

                          {/* 4. Edit: shown when withdrawn, approved, or rejected */}
                          {(isWithdrawn || isApproved || isRejected) && (
                            <button
                              onClick={() => handleStartEditLabApp(labApp)}
                              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/5 transition-colors cursor-pointer flex items-center justify-center"
                              title="Edit"
                            >
                              <Edit2 size={14} />
                            </button>
                          )}

                          {/* 5. Delete: shown when withdrawn or rejected */}
                          {(isWithdrawn || isRejected) && (
                            <button
                              onClick={() => handleDeleteLabApp(labApp)}
                              className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 transition-colors cursor-pointer flex items-center justify-center"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Matches */}
      {activeTab === 'matches' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-serif text-white tracking-tight">
              Labs that match your ideas.
            </h2>
            <span className="text-xs text-neutral-500 font-medium">
              {matches.length} {matches.length === 1 ? 'match' : 'matches'}
            </span>
          </div>

          {matches.length === 0 ? (
            <div className="p-12 sm:p-16 rounded-3xl bg-[#0e0e11] border border-white/10 text-center space-y-4">
              <h3 className="text-lg font-serif text-white">No matches yet</h3>
              <div className="pt-2">
                <button
                  onClick={onPostIdea}
                  className="px-6 py-3 bg-white hover:bg-neutral-200 text-black text-xs font-semibold rounded-xl transition-all shadow-sm inline-flex items-center gap-2 cursor-pointer"
                >
                  <Plus size={16} strokeWidth={2.4} className="shrink-0" />
                  <span>Post Idea</span>
                </button>
              </div>
            </div>
          ) : (
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
          )}
        </div>
      )}

      {/* Tab 5: Saved */}
      {activeTab === 'saved' && (
        <div className="space-y-10">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-serif text-white tracking-tight">
                  Ideas you've bookmarked.
                </h2>
              </div>
              <span className="text-xs text-neutral-500 font-medium">
                {savedNotes.length} saved
              </span>
            </div>

            {savedNotes.length === 0 ? (
              <div className="p-12 sm:p-16 rounded-3xl bg-[#0e0e11] border border-white/10 text-center space-y-4">
                <h3 className="text-lg font-serif text-white">No bookmarked ideas yet</h3>
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

          <div className="space-y-5 pt-8 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-serif text-white tracking-tight">
                  Labs you follow.
                </h2>
              </div>
              <span className="text-xs text-neutral-500 font-medium">
                {savedLabs.length} followed
              </span>
            </div>

            {savedLabs.length === 0 ? (
              <div className="p-12 sm:p-16 rounded-3xl bg-[#0e0e11] border border-white/10 text-center space-y-4">
                <h3 className="text-lg font-serif text-white">No saved laboratories yet</h3>
                <div className="pt-2">
                  <button
                    onClick={onBrowseLabs || onBrowseIdeas}
                    className="px-6 py-3 bg-white hover:bg-neutral-200 text-black text-xs font-semibold rounded-xl transition-all shadow-sm inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span>Explore Research Labs &rarr;</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedLabs.map((lab) => (
                  <div
                    key={lab.id}
                    className="p-6 rounded-2xl bg-[#0c0c0f] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                          {lab.domain}
                        </span>
                        {onToggleSaveLab && (
                          <button
                            onClick={() => onToggleSaveLab(lab.id)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors cursor-pointer"
                            title="Unfollow lab"
                          >
                            <Bookmark size={14} className="fill-white" />
                          </button>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-white hover:text-neutral-200 transition-colors">
                        {lab.name}
                      </h3>

                      <p className="text-xs text-neutral-400 line-clamp-3 leading-relaxed">
                        {lab.summary}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                      <span className="text-xs text-neutral-500 flex items-center gap-1.5">
                        <Building2 size={13} />
                        <span>{lab.institution}</span>
                      </span>

                      <button
                        onClick={() => onSelectLab && onSelectLab(lab)}
                        className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                      >
                        View &gt;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 6: Profile Settings */}
      {activeTab === 'profile' && (
        <div className="space-y-8 max-w-2xl">
          <div>
            <h2 className="text-xl font-serif text-white tracking-tight">
              Manage your identity and preferences.
            </h2>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="space-y-4 p-6 rounded-2xl bg-[#0c0c0f] border border-white/10">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider text-neutral-400">
                Scientific Identity
              </h3>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Full Name / Display Name
                </label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-black border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={currentUser.email || ''}
                  disabled
                  className="w-full px-4 py-2.5 bg-neutral-900/50 border border-white/5 rounded-xl text-neutral-500 text-sm cursor-not-allowed font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Primary Institutional Affiliation
                </label>
                <input
                  type="text"
                  value={profileAffiliation}
                  onChange={(e) => setProfileAffiliation(e.target.value)}
                  placeholder="e.g. Stanford University / Wyss Bio-Foundry"
                  className="w-full px-4 py-2.5 bg-black border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Scientific Identity Tag
                </label>
                <select
                  value={identityTag}
                  onChange={(e) => setIdentityTag(e.target.value)}
                  className="w-full px-4 py-2.5 bg-black border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-white/30 transition-colors"
                >
                  <option value="Academic Researcher">Academic Researcher</option>
                  <option value="Principal Investigator">Principal Investigator</option>
                  <option value="Postdoctoral Fellow">Postdoctoral Fellow</option>
                  <option value="PhD Candidate">PhD Candidate</option>
                  <option value="Biotech Founder">Biotech Founder</option>
                  <option value="Independent Scientist">Independent Scientist</option>
                  {isAdm && <option value="System Administrator">System Administrator</option>}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Research Bio / Statement
                </label>
                <textarea
                  value={profileBio}
                  onChange={(e) => setProfileBio(e.target.value)}
                  rows={3}
                  placeholder="Briefly state your experimental interests or technical expertise..."
                  className="w-full px-4 py-2.5 bg-black border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-white/30 transition-colors resize-none"
                />
              </div>
            </div>

            <div className="space-y-4 p-6 rounded-2xl bg-[#0c0c0f] border border-white/10">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider text-neutral-400">
                Notification Preferences
              </h3>

              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyEmail}
                    onChange={(e) => setNotifyEmail(e.target.checked)}
                    className="w-4 h-4 rounded bg-black border-white/20 text-white focus:ring-0"
                  />
                  <div>
                    <div className="text-xs font-medium text-white">Email Notifications</div>
                    <div className="text-[11px] text-neutral-500">
                      Receive alerts when labs match your research proposals
                    </div>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyMatches}
                    onChange={(e) => setNotifyMatches(e.target.checked)}
                    className="w-4 h-4 rounded bg-black border-white/20 text-white focus:ring-0"
                  />
                  <div>
                    <div className="text-xs font-medium text-white">Automated AI Match Alerts</div>
                    <div className="text-[11px] text-neutral-500">
                      Real-time notifications for high-confidence laboratory capacity matches
                    </div>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyCollab}
                    onChange={(e) => setNotifyCollab(e.target.checked)}
                    className="w-4 h-4 rounded bg-black border-white/20 text-white focus:ring-0"
                  />
                  <div>
                    <div className="text-xs font-medium text-white">Collaboration Inquiries</div>
                    <div className="text-[11px] text-neutral-500">
                      Receive direct dispatch messages from partner PIs
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-white hover:bg-neutral-200 text-black text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
              >
                Save Preferences
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Idea Modal */}
      {editingIdea && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121216] border border-white/15 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg font-serif text-white font-normal">Edit Published Idea</h3>
              <button
                onClick={() => setEditingIdea(null)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEditIdea} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Title</label>
                <input
                  type="text"
                  value={editIdeaTitle}
                  onChange={(e) => setEditIdeaTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-black/60 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-white/30"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Domain</label>
                <select
                  value={editIdeaDomain}
                  onChange={(e) => setEditIdeaDomain(e.target.value as DomainCategory)}
                  className="w-full px-4 py-2.5 bg-black/60 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-white/30"
                >
                  <option value="Biomedicine">Biomedicine</option>
                  <option value="Synthetic Biology">Synthetic Biology</option>
                  <option value="AI & Computing">AI & Computing</option>
                  <option value="Neurotech">Neurotech</option>
                  <option value="Clean Biomanufacturing">Clean Biomanufacturing</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Hypothesis / Description</label>
                <textarea
                  value={editIdeaDesc}
                  onChange={(e) => setEditIdeaDesc(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2.5 bg-black/60 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-white/30 resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Keywords / Tags (comma separated)</label>
                <input
                  type="text"
                  value={editIdeaTags}
                  onChange={(e) => setEditIdeaTags(e.target.value)}
                  className="w-full px-4 py-2.5 bg-black/60 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-white/30"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingIdea(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-white hover:bg-neutral-200 text-black text-xs font-bold rounded-xl transition-all shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Post Modal */}
      {editingPost && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121216] border border-white/15 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg font-serif text-white font-normal">Edit Post</h3>
              <button
                onClick={() => setEditingPost(null)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEditPost} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Post Type</label>
                <select
                  value={editPostSection}
                  onChange={(e) => setEditPostSection(e.target.value as CommunitySection)}
                  className="w-full px-4 py-2.5 bg-black/60 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-white/30"
                >
                  <option value="Discussion">Discussion</option>
                  <option value="Seeking">Seeking (Partners / Recruitment)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Title</label>
                <input
                  type="text"
                  value={editPostTitle}
                  onChange={(e) => setEditPostTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-black/60 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-white/30"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Content</label>
                <textarea
                  value={editPostContent}
                  onChange={(e) => setEditPostContent(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-2.5 bg-black/60 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-white/30 resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={editPostTags}
                  onChange={(e) => setEditPostTags(e.target.value)}
                  className="w-full px-4 py-2.5 bg-black/60 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-white/30"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingPost(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-white hover:bg-neutral-200 text-black text-xs font-bold rounded-xl transition-all shadow-sm"
                >
                  Update Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Interest Modal */}
      {editingInterest && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121216] border border-white/15 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="text-lg font-serif text-white font-normal">Edit Collaboration Proposal</h3>
                <p className="text-xs text-neutral-400 mt-0.5">To: {editingInterest.labName}</p>
              </div>
              <button
                onClick={() => setEditingInterest(null)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEditInterest} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Proposed Topic / Title</label>
                <input
                  type="text"
                  value={editInterestTopic}
                  onChange={(e) => setEditInterestTopic(e.target.value)}
                  className="w-full px-4 py-2.5 bg-black/60 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-white/30"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Collaboration Type</label>
                <select
                  value={editInterestType}
                  onChange={(e) => setEditInterestType(e.target.value)}
                  className="w-full px-4 py-2.5 bg-black/60 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-white/30"
                >
                  <option value="Joint Experimental Validation">Joint Experimental Validation</option>
                  <option value="Co-PI Grant Application">Co-PI Grant Application</option>
                  <option value="Pilot Foundry Integration">Pilot Foundry Integration</option>
                  <option value="Translational Clinical Model">Translational Clinical Model</option>
                  <option value="Computational Screening Pipeline">Computational Screening Pipeline</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Technical Needs & Details</label>
                <textarea
                  value={editInterestSummary}
                  onChange={(e) => setEditInterestSummary(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-2.5 bg-black/60 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-white/30 resize-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingInterest(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-white hover:bg-neutral-200 text-black text-xs font-bold rounded-xl transition-all shadow-sm"
                >
                  Update Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Lab Application Modal */}
      {editingLabApp && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121216] border border-white/15 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="text-lg font-serif text-white font-normal">Edit Lab Application</h3>
                <p className="text-xs text-neutral-400 mt-0.5">{editingLabApp.name}</p>
              </div>
              <button
                onClick={() => setEditingLabApp(null)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEditLabApp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Laboratory / Entity Name</label>
                <input
                  type="text"
                  value={editLabName}
                  onChange={(e) => setEditLabName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-black/60 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-white/30"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Institution / University</label>
                <input
                  type="text"
                  value={editLabInstitution}
                  onChange={(e) => setEditLabInstitution(e.target.value)}
                  className="w-full px-4 py-2.5 bg-black/60 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-white/30"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Primary Domain</label>
                <select
                  value={editLabDomain}
                  onChange={(e) => setEditLabDomain(e.target.value)}
                  className="w-full px-4 py-2.5 bg-black/60 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-white/30"
                >
                  <option value="Synthetic Biology">Synthetic Biology</option>
                  <option value="Biomedicine">Biomedicine</option>
                  <option value="AI & Computing">AI & Computing</option>
                  <option value="Neurotech">Neurotech</option>
                  <option value="Clean Biomanufacturing">Clean Biomanufacturing</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Lead PI / Director Name</label>
                <input
                  type="text"
                  value={editLabPiName}
                  onChange={(e) => setEditLabPiName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-black/60 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-white/30"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Contact Email</label>
                <input
                  type="email"
                  value={editLabContactEmail}
                  onChange={(e) => setEditLabContactEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-black/60 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-white/30"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Research Directions & Focus</label>
                <textarea
                  value={editLabDirections}
                  onChange={(e) => setEditLabDirections(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-black/60 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-white/30 resize-none"
                  placeholder="Key research directions separated by commas..."
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Team & Facility Overview</label>
                <textarea
                  value={editLabTeamOverview}
                  onChange={(e) => setEditLabTeamOverview(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-black/60 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-white/30 resize-none"
                  placeholder="Facility infrastructure, member count, capabilities..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Representative Past Projects / Publications</label>
                <textarea
                  value={editLabPastProjects}
                  onChange={(e) => setEditLabPastProjects(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-black/60 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-white/30 resize-none"
                  placeholder="Milestone achievements, major grant validations..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingLabApp(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-white hover:bg-neutral-200 text-black text-xs font-bold rounded-xl transition-all shadow-sm"
                >
                  Update Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Post Detail Modal */}
      {viewingPostDetail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121216] border border-white/15 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
              <div className="space-y-1.5">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                    viewingPostDetail.section === 'Seeking'
                      ? 'bg-violet-500/10 text-violet-400 border-violet-500/20'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  }`}
                >
                  {viewingPostDetail.section}
                </span>
                <h2 className="text-xl font-serif text-white font-normal leading-snug">
                  {viewingPostDetail.title}
                </h2>
                <div className="text-xs text-neutral-400 flex items-center gap-2">
                  <span>By {viewingPostDetail.author.name}</span>
                  <span>•</span>
                  <span>{viewingPostDetail.createdAt}</span>
                </div>
              </div>
              <button
                onClick={() => setViewingPostDetail(null)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white transition-colors shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            <div className="text-sm text-neutral-200 leading-relaxed whitespace-pre-line">
              {viewingPostDetail.content}
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
              {viewingPostDetail.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-xs text-neutral-400 font-mono"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const post = viewingPostDetail;
                    setViewingPostDetail(null);
                    if (onGoToCommunity) {
                      onGoToCommunity({ editPost: post });
                    } else {
                      handleStartEditPost(post);
                    }
                  }}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-neutral-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit2 size={13} />
                  <span>Edit Post</span>
                </button>
                <button
                  onClick={() => {
                    handleDeletePost(viewingPostDetail);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-xs font-semibold text-rose-300 border border-rose-500/20 transition-colors flex items-center gap-1.5"
                >
                  <Trash2 size={13} />
                  <span>Delete Post</span>
                </button>
              </div>

              <button
                onClick={() => setViewingPostDetail(null)}
                className="px-4 py-2 bg-white text-black text-xs font-bold rounded-xl hover:bg-neutral-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Interest Detail Modal */}
      {viewingInterestDetail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121216] border border-white/15 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <h2 className="text-xl font-serif text-white font-normal">
                    {viewingInterestDetail.labName}
                  </h2>
                  {getInterestStatusBadge(viewingInterestDetail.status)}
                </div>
                <p className="text-xs text-neutral-400">{viewingInterestDetail.institution}</p>
              </div>
              <button
                onClick={() => setViewingInterestDetail(null)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white transition-colors shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">
                  Proposed Topic
                </label>
                <p className="text-sm font-semibold text-white mt-1">
                  {viewingInterestDetail.proposedTopic}
                </p>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">
                  Collaboration Mode
                </label>
                <p className="text-xs text-neutral-300 mt-1">
                  {viewingInterestDetail.collaborationType}
                </p>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">
                  Submitted Technical Proposal & Requirements
                </label>
                <div className="mt-1.5 p-4 rounded-xl bg-black/50 border border-white/10 text-xs text-neutral-300 leading-relaxed whitespace-pre-line">
                  {viewingInterestDetail.projectSummary}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                onClick={() => {
                  const item = viewingInterestDetail;
                  setViewingInterestDetail(null);
                  handleStartEditInterest(item);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-white transition-colors flex items-center gap-1.5"
              >
                <Edit2 size={13} />
                <span>Edit Proposal</span>
              </button>
              <button
                onClick={() => setViewingInterestDetail(null)}
                className="px-4 py-2 bg-white text-black text-xs font-bold rounded-xl hover:bg-neutral-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Lab Application Detail Modal */}
      {viewingLabAppDetail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121216] border border-white/15 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <h2 className="text-xl font-serif text-white font-normal">
                    {viewingLabAppDetail.name}
                  </h2>
                  {getInterestStatusBadge(viewingLabAppDetail.status)}
                </div>
                <p className="text-xs text-neutral-400">
                  {viewingLabAppDetail.institution} • {viewingLabAppDetail.domain}
                </p>
              </div>
              <button
                onClick={() => setViewingLabAppDetail(null)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white transition-colors shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">
                  Lead Principal Investigator
                </label>
                <p className="text-neutral-200 font-semibold mt-1">
                  {viewingLabAppDetail.piName}{' '}
                  {viewingLabAppDetail.contactEmail && (
                    <span className="font-mono text-neutral-500 font-normal">
                      ({viewingLabAppDetail.contactEmail})
                    </span>
                  )}
                </p>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">
                  Research Directions & Scope
                </label>
                <p className="text-neutral-300 mt-1 leading-relaxed">
                  {viewingLabAppDetail.researchDirections}
                </p>
              </div>

              {viewingLabAppDetail.teamOverview && (
                <div>
                  <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">
                    Team & Facility Overview
                  </label>
                  <p className="text-neutral-300 mt-1 leading-relaxed">
                    {viewingLabAppDetail.teamOverview}
                  </p>
                </div>
              )}

              {viewingLabAppDetail.pastProjects && (
                <div>
                  <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">
                    Key Representative Milestones
                  </label>
                  <p className="text-neutral-300 mt-1 leading-relaxed">
                    {viewingLabAppDetail.pastProjects}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                onClick={() => {
                  const labApp = viewingLabAppDetail;
                  setViewingLabAppDetail(null);
                  handleStartEditLabApp(labApp);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-white transition-colors flex items-center gap-1.5"
              >
                <Edit2 size={13} />
                <span>Edit Application</span>
              </button>
              <button
                onClick={() => setViewingLabAppDetail(null)}
                className="px-4 py-2 bg-white text-black text-xs font-bold rounded-xl hover:bg-neutral-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
