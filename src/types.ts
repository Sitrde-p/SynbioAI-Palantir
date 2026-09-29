/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CommentItem {
  id: string;
  author: string;
  avatar: string;
  role: string;
  content: string;
  createdAt: string;
}

export type DomainCategory =
  | 'Biomedicine'
  | 'AI & Computing'
  | 'Synthetic Biology'
  | 'Neurotech'
  | 'Clean Biomanufacturing';

export interface ImaginationNote {
  id: string;
  dbId?: string;
  isMock?: boolean;
  title: string;
  domain: DomainCategory;
  author: {
    name: string;
    role: string;
    avatar: string;
    institution?: string;
  };
  image: string;
  tags: string[];
  description: string;
  fullDetails?: string;
  location: string;
  createdAt: string;
  stage: 'Idea' | 'Design' | 'Implementation' | 'Production';
  status?: 'Draft' | 'Under Review' | 'Connecting';
  likes: number;
  comments: number;
  commentsList?: CommentItem[];
  isLiked?: boolean;
  isSaved?: boolean;
  isUserSubmitted?: boolean;
  authorEmail?: string;
}

export type Category = 'AI Lab' | 'AI Community' | 'Synthetic Biology' | 'Frontier Tech' | 'Inspiration Square' | 'Team' | 'Admin';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role?: 'admin' | 'creator' | 'researcher' | string;
  createdAt: string;
  bio?: string;
  affiliation?: string;
  identityTag?: string;
  notifications?: {
    emailUpdates: boolean;
    labMatches: boolean;
    collaborationRequests: boolean;
    weeklyDigest: boolean;
  };
}

export const isUserAdmin = (user: UserAccount | null | undefined): boolean => {
  if (!user) return false;
  const role = (user.role || '').toLowerCase().trim();
  return role === 'admin';
};

export type IdeaReviewStatus = 'Pending' | 'Approved' | 'Rejected';

export interface AdminIdeaItem {
  id: string;
  dbId?: string;
  isMock?: boolean;
  title: string;
  submitterName: string;
  submitterEmail?: string;
  domain?: string;
  submittedAt: string;
  status: IdeaReviewStatus;
  description?: string;
}

export type LabApplicationStatus = 'Pending' | 'Approved' | 'Rejected';

export interface AdminLabApplication {
  id: string;
  dbId?: string;
  isMock?: boolean;
  labName: string;
  institution: string;
  researchDirections: string;
  domain?: string;
  leadPI?: string;
  contactEmail?: string;
  submittedAt: string;
  status: LabApplicationStatus;
}

export interface AdminUserItem {
  id: string;
  name: string;
  email: string;
  role: 'Creator' | 'Researcher' | 'Admin' | string;
  registeredAt: string;
  status: 'Active' | 'Pending' | string;
}

export interface LabMatchRequest {
  id: string;
  labId: string;
  labName: string;
  institution: string;
  ideaId: string;
  ideaTitle: string;
  matchScore: number;
  status: 'In Discussion' | 'Pending Review' | 'Accepted';
  labMessage: string;
  contactPerson: string;
  timestamp: string;
}

export type InterestStatus = 'Pending' | 'In Discussion' | 'Accepted' | 'Rejected' | 'Withdrawn';

export interface UserInterest {
  id: string;
  dbId?: string;
  isMock?: boolean;
  labId: string;
  labName: string;
  institution: string;
  matchScore: number;
  status: InterestStatus;
  proposedTopic: string;
  collaborationType: string;
  projectSummary: string;
  applicantName: string;
  applicantEmail: string;
  organization?: string;
  createdAt: string;
  timestampDisplay?: string;
}

export type CommunitySection = 'Discussion' | 'Seeking';

export interface CommunityReply {
  id: string;
  author: {
    name: string;
    role?: string;
    institution?: string;
  };
  authorEmail?: string;
  content: string;
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  dbId?: string;
  isMock?: boolean;
  section: CommunitySection;
  title: string;
  content: string;
  author: {
    name: string;
    role: string;
    institution?: string;
    avatar?: string;
  };
  authorEmail?: string;
  authorId?: string;
  tags: string[];
  likes: number;
  isLiked?: boolean;
  repliesCount: number;
  replies?: CommunityReply[];
  createdAt: string;
  statusBadge?: string;
}
