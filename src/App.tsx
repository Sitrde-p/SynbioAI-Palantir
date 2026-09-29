/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import AboutView from './components/AboutView';
import LabView from './components/LabView';
import CommunityView from './components/CommunityView';
import DashboardView from './components/DashboardView';
import LabDetailView from './components/LabDetailView';
import LabApplicationView from './components/LabApplicationView';
import ExpressInterestModal from './components/ExpressInterestModal';
import SignInPage from './components/SignInPage';
import SignUpPage from './components/SignUpPage';
import CollaborateModal from './components/CollaborateModal';
import ProjectDetailModal from './components/ProjectDetailModal';
import AdminDashboardView from './components/AdminDashboardView';
import LandingView from './components/LandingView';
import InspirationView from './components/InspirationView';
import PostIdeaView from './components/PostIdeaView';
import { Modal } from './components/Modal';
import { Category, ImaginationNote, CommentItem, DomainCategory, UserAccount, isUserAdmin, CommunityPost } from './types';
import { INITIAL_NOTES } from './data/mockNotes';
import { RESEARCH_LABS, ResearchLab } from './data/mockLabs';
import { Send, MapPin, Tag, CheckCircle2, Trash2, AlertTriangle, ExternalLink } from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import { supabase } from './supabase';

type ViewMode =
  | 'landing'
  | 'main'
  | 'post-idea'
  | 'signin'
  | 'signup'
  | 'dashboard'
  | 'lab-detail'
  | 'lab-application'
  | 'admin';

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('landing');
  const [activeCategory, setActiveCategory] = useState<Category>('Inspiration Square');
  const [selectedLab, setSelectedLab] = useState<ResearchLab | null>(null);
  const [interestTargetLab, setInterestTargetLab] = useState<ResearchLab | null>(null);

  // Authentication & User State from Supabase useAuth hook
  const { user: currentUser, setUser: setCurrentUser, signOut, loading: authLoading } = useAuth();

  // Redirect unauthenticated users from Dashboard to sign in page
  useEffect(() => {
    if (!authLoading && viewMode === 'dashboard' && !currentUser) {
      setViewMode('signin');
    }
  }, [viewMode, currentUser, authLoading]);

  // Mock Notes (Local fallback items with mock_ prefix)
  const [mockNotes, setMockNotes] = useState<ImaginationNote[]>(() => {
    try {
      const saved = localStorage.getItem('synbio_mock_notes');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load persistent mock notes', e);
    }
    return INITIAL_NOTES;
  });

  // Real Notes from Supabase
  const [realNotes, setRealNotes] = useState<ImaginationNote[]>([]);

  // Combined Notes: Real data in front, Mock data in back
  const notes = React.useMemo(() => [...realNotes, ...mockNotes], [realNotes, mockNotes]);

  // Load real ideas from Supabase
  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const { data, error } = await supabase
          .from('ideas')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) {
          const mapped: ImaginationNote[] = data.map((item: any) => {
            const rowId = item.id?.toString() || `idea_${Date.now()}`;
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
                name: item.author_name || 'Independent Researcher',
                role: 'Verified Investigator',
                avatar:
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=160',
                institution: item.host_lab || 'Open Science Frontier Collective',
              },
              image:
                'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=1200',
              tags: Array.isArray(item.keywords)
                ? item.keywords
                : item.keywords
                ? item.keywords.split(',')
                : [item.domain || 'Synthetic Biology'],
              stage: 'Idea',
              likes: item.likes || 1,
              comments: 0,
              commentsList: [],
              isLiked: false,
              isUserSubmitted: true,
              authorEmail: undefined,
            };
          });
          setRealNotes(mapped);
        }
      } catch (err) {
        console.warn('Could not fetch ideas from Supabase:', err);
      }
    };
    fetchIdeas();
  }, []);

  // Sync mock notes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('synbio_mock_notes', JSON.stringify(mockNotes));
    } catch (e) {
      console.error('Failed to save mock notes to storage', e);
    }
  }, [mockNotes]);

  // Persistent Saved Labs
  const [savedLabIds, setSavedLabIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('synbio_saved_labs');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('synbio_saved_labs', JSON.stringify(savedLabIds));
    } catch (e) {
      console.error('Failed to save labs to storage', e);
    }
  }, [savedLabIds]);

  const handleToggleSaveLab = (labId: string) => {
    setSavedLabIds((prev) =>
      prev.includes(labId) ? prev.filter((id) => id !== labId) : [...prev, labId]
    );
  };

  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [openCommunityNewPost, setOpenCommunityNewPost] = useState(false);
  const [openCommunityEditPost, setOpenCommunityEditPost] = useState<CommunityPost | null>(null);
  const [openCommunityViewingPostId, setOpenCommunityViewingPostId] = useState<string | null>(null);
  const [selectedCollaborateNote, setSelectedCollaborateNote] = useState<ImaginationNote | null>(null);
  const [selectedDetailNote, setSelectedDetailNote] = useState<ImaginationNote | null>(null);
  const [noteToDelete, setNoteToDelete] = useState<ImaginationNote | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Post Form State
  const [postTitle, setPostTitle] = useState('');
  const [postDomain, setPostDomain] = useState<DomainCategory>('Biomedicine');
  const [postDesc, setPostDesc] = useState('');
  const [postLocation, setPostLocation] = useState('');
  const [postTags, setPostTags] = useState('');
  const [postAuthorName, setPostAuthorName] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  // Delete handlers (strictly limited to current user's published ideas in Dashboard)
  const handleDeleteRequest = (noteId: string) => {
    const target = notes.find((n) => n.id === noteId);
    if (!target) return;

    const isAuthor =
      currentUser &&
      (target.isUserSubmitted ||
        (target.authorEmail && target.authorEmail.toLowerCase() === currentUser.email.toLowerCase()) ||
        (target.author?.name && target.author.name.toLowerCase() === currentUser.name.toLowerCase()) ||
        (target.author?.name && target.author.name.toLowerCase() === currentUser.email.toLowerCase()));

    if (!isAuthor) {
      setToastMessage('Permission denied: You can only delete your own published ideas.');
      setTimeout(() => setToastMessage(null), 3500);
      return;
    }

    setNoteToDelete(target);
  };

  const handleConfirmDelete = async () => {
    if (!noteToDelete) return;
    const deletedId = noteToDelete.id;
    const deletedTitle = noteToDelete.title;
    const isMock = !!noteToDelete.isMock || !noteToDelete.dbId || String(deletedId).startsWith('mock_');

    if (isMock) {
      // Iron Rule 2: Mock data only deleted from local state, never calls Supabase
      setMockNotes((prev) => prev.filter((n) => n.id !== deletedId));
      if (selectedDetailNote && selectedDetailNote.id === deletedId) {
        setSelectedDetailNote(null);
      }
      if (selectedCollaborateNote && selectedCollaborateNote.id === deletedId) {
        setSelectedCollaborateNote(null);
      }
      setNoteToDelete(null);
      setToastMessage('示例数据已从当前视图隐藏（刷新页面将重新出现，属正常现象）');
      setTimeout(() => setToastMessage(null), 4000);
      return;
    }

    // Real data: Delete from Supabase first
    const targetDbId = noteToDelete.dbId || deletedId;
    console.log('Calling Supabase delete on ideas...', targetDbId);

    try {
      const { error } = await supabase
        .from('ideas')
        .delete()
        .eq('id', targetDbId);

      if (error) {
        console.error('Supabase delete error on ideas:', error);
        setToastMessage(`Failed to delete idea: ${error.message || 'Database error'}`);
        setTimeout(() => setToastMessage(null), 4000);
        setNoteToDelete(null);
        return;
      }
    } catch (err: any) {
      console.error('Error deleting idea from Supabase:', err);
      setToastMessage(`Failed to delete idea: ${err?.message || 'Database error'}`);
      setTimeout(() => setToastMessage(null), 4000);
      setNoteToDelete(null);
      return;
    }

    setRealNotes((prev) => prev.filter((n) => n.id !== deletedId && n.dbId !== deletedId));
    if (selectedDetailNote && selectedDetailNote.id === deletedId) {
      setSelectedDetailNote(null);
    }
    if (selectedCollaborateNote && selectedCollaborateNote.id === deletedId) {
      setSelectedCollaborateNote(null);
    }
    setNoteToDelete(null);
    setToastMessage(`Deleted idea "${deletedTitle.slice(0, 28)}...".`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Update default author name when currentUser changes or modal opens
  useEffect(() => {
    if (currentUser && !postAuthorName) {
      setPostAuthorName(currentUser.name);
    }
  }, [currentUser, isPostModalOpen]);

  // Post Idea handler: directly navigate to /post-idea page (no modal popup)
  const handleTriggerPostIdea = () => {
    if (!currentUser) {
      setToastMessage('Please sign in or create an account before posting a scientific idea.');
      setTimeout(() => setToastMessage(null), 3500);
      setViewMode('signup');
      return;
    }
    setViewMode('post-idea');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Update note item across realNotes and mockNotes
  const updateNoteItem = (noteId: string, updater: (n: ImaginationNote) => ImaginationNote) => {
    setRealNotes((prev) => prev.map((n) => (n.id === noteId ? updater(n) : n)));
    setMockNotes((prev) => prev.map((n) => (n.id === noteId ? updater(n) : n)));
  };

  // Toggle Like Handler
  const handleToggleLike = (noteId: string) => {
    updateNoteItem(noteId, (note) => {
      const isCurrentlyLiked = !!note.isLiked;
      const updatedNote = {
        ...note,
        isLiked: !isCurrentlyLiked,
        likes: isCurrentlyLiked ? note.likes - 1 : note.likes + 1,
      };
      if (selectedDetailNote && selectedDetailNote.id === noteId) {
        setSelectedDetailNote(updatedNote);
      }
      return updatedNote;
    });
  };

  // Toggle Save (Bookmark) Idea Handler
  const handleToggleSaveNote = (noteId: string) => {
    updateNoteItem(noteId, (note) => {
      const nextSaved = !note.isSaved;
      const updatedNote = {
        ...note,
        isSaved: nextSaved,
      };
      if (selectedDetailNote && selectedDetailNote.id === noteId) {
        setSelectedDetailNote(updatedNote);
      }
      return updatedNote;
    });
  };

  // Add Comment Handler
  const handleAddComment = (noteId: string, comment: CommentItem) => {
    updateNoteItem(noteId, (note) => {
      const existingList = note.commentsList || [];
      const updatedNote = {
        ...note,
        comments: note.comments + 1,
        commentsList: [comment, ...existingList],
      };
      if (selectedDetailNote && selectedDetailNote.id === noteId) {
        setSelectedDetailNote(updatedNote);
      }
      return updatedNote;
    });
  };

  // Unified Idea Publication logic used by both modal and full page /post-idea
  const createAndPublishIdea = async (data: {
    title: string;
    domain: DomainCategory;
    description: string;
    authorName?: string;
    location?: string;
    tags?: string;
  }) => {
    const tagList = (data.tags || '')
      .split(/[,，#\s]+/)
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const authorDisplayName =
      data.authorName?.trim() ||
      (currentUser ? currentUser.name : 'Independent Researcher');

    // Insert into Supabase ideas table with .select() to get real UUID
    try {
      const { data: insertedData, error } = await supabase
        .from('ideas')
        .insert({
          title: data.title.trim(),
          domain: data.domain,
          author_name: authorDisplayName,
          host_lab: data.location?.trim() || 'Global Bio-Node',
          keywords: tagList.length > 0 ? tagList : [data.domain, 'FrontierResearch', 'OpenInitiative'],
          hypothesis: data.description.trim(),
          author_id: currentUser?.id || null,
          likes: 1,
        })
        .select();

      if (error) {
        console.warn('Could not save idea to Supabase:', error);
        setToastMessage(`Error publishing idea: ${error.message || 'Database error'}`);
        setTimeout(() => setToastMessage(null), 5000);
      } else {
        const row = insertedData && insertedData[0];
        const realId = row ? row.id.toString() : `idea_${Date.now()}`;
        const newRealNote: ImaginationNote = {
          id: realId,
          dbId: realId,
          isMock: false,
          title: data.title.trim(),
          domain: data.domain,
          description: data.description.trim(),
          fullDetails: `## Project Vision & Scientific Scope\n${data.description.trim()}\n\n### Anticipated Breakthrough & Key Milestones\nInitiated by ${authorDisplayName} seeking collaborative validation across computational biology, high-throughput biofoundries, or translational pipelines.`,
          location: data.location?.trim() || 'Global Bio-Node',
          createdAt: row?.created_at || new Date().toISOString(),
          author: {
            name: authorDisplayName,
            role: currentUser ? 'Verified Investigator' : 'Independent Researcher',
            avatar:
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=160',
            institution: 'Open Science Frontier Collective',
          },
          image:
            'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=1200',
          tags:
            tagList.length > 0
              ? tagList
              : [data.domain, 'FrontierResearch', 'OpenInitiative'],
          stage: 'Idea',
          likes: 1,
          comments: 0,
          commentsList: [],
          isLiked: true, // Creator automatically bookmarks their own post
          isUserSubmitted: true,
          authorEmail: currentUser ? currentUser.email : undefined,
        };

        setRealNotes((prev) => [newRealNote, ...prev]);
        setToastMessage(`Scientific idea "${newRealNote.title.slice(0, 32)}..." published successfully!`);
        setTimeout(() => setToastMessage(null), 4500);
      }
    } catch (err: any) {
      console.warn('Could not save idea to Supabase:', err);
      setToastMessage(`Error publishing idea: ${err?.message || 'Database error'}`);
      setTimeout(() => setToastMessage(null), 5000);
    }

    // Ensure user is on Inspiration Square feed so the newly generated idea is immediately visible
    setViewMode('main');
    setActiveCategory('Inspiration Square');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Publish New Imagination Note from modal
  const handlePublishNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postDesc.trim()) return;

    setIsPublishing(true);

    setTimeout(() => {
      createAndPublishIdea({
        title: postTitle,
        domain: postDomain,
        description: postDesc,
        authorName: postAuthorName,
        location: postLocation,
        tags: postTags,
      });

      setIsPublishing(false);
      setIsPostModalOpen(false);

      // Reset form fields
      setPostTitle('');
      setPostDesc('');
      setPostLocation('');
      setPostTags('');
      setPostAuthorName(currentUser ? currentUser.name : '');
    }, 300);
  };

  // Sign out handler
  const handleSignOut = async () => {
    await signOut();
    setViewMode('main');
    setActiveCategory('Inspiration Square');
    setToastMessage('Signed out successfully.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Render Full Pages for Sign In and Sign Up
  if (viewMode === 'signin') {
    return (
      <SignInPage
        onSignInSuccess={(user) => {
          setCurrentUser(user);
          setViewMode('dashboard');
          setToastMessage(`Welcome back, ${user.name}!`);
          setTimeout(() => setToastMessage(null), 4000);
        }}
        onGoToSignUp={() => setViewMode('signup')}
        onBackToHome={() => setViewMode('main')}
      />
    );
  }

  if (viewMode === 'signup') {
    return (
      <SignUpPage
        onSignUpSuccess={(user) => {
          setCurrentUser(user);
          setViewMode('dashboard');
          setToastMessage(`Account created! Welcome, ${user.name}!`);
          setTimeout(() => setToastMessage(null), 4000);
        }}
        onGoToSignIn={() => setViewMode('signin')}
        onBackToHome={() => setViewMode('main')}
      />
    );
  }

  // Saved and Submitted Notes for Dashboard
  const savedNotes = notes.filter((n) => n.isSaved);
  const savedLabs = RESEARCH_LABS.filter((lab) => savedLabIds.includes(lab.id));
  const userSubmissions = notes.filter(
    (n) =>
      n.isUserSubmitted &&
      currentUser &&
      ((n.authorEmail && currentUser.email && n.authorEmail.toLowerCase() === currentUser.email.toLowerCase()) ||
        (n.author?.name && currentUser.name && n.author.name.toLowerCase() === currentUser.name.toLowerCase()))
  );

  const renderContent = () => {
    if (viewMode === 'landing') {
      return (
        <LandingView
          notes={notes}
          onExploreInspirations={() => {
            setViewMode('main');
            setActiveCategory('Inspiration Square');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onExploreTeams={() => {
            setViewMode('main');
            setActiveCategory('Synthetic Biology');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onExploreCommunity={() => {
            setViewMode('main');
            setActiveCategory('AI Community');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onShareYourIdea={handleTriggerPostIdea}
          onCollaborate={(note) => setSelectedCollaborateNote(note)}
          onSelectNote={(note) => setSelectedDetailNote(note)}
          onToggleLike={handleToggleLike}
          onToggleSave={handleToggleSaveNote}
          onToast={(msg) => {
            setToastMessage(msg);
            setTimeout(() => setToastMessage(null), 3500);
          }}
        />
      );
    }

    if (viewMode === 'post-idea') {
      return (
        <PostIdeaView
          currentUser={currentUser}
          onBack={() => {
            setViewMode('main');
            setActiveCategory('Inspiration Square');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onSubmitIdea={(newIdea) => {
            createAndPublishIdea(newIdea);
          }}
          onRequireAuth={() => setViewMode('signin')}
        />
      );
    }

    if (viewMode === 'lab-detail' && selectedLab) {
      return (
        <LabDetailView
          lab={selectedLab}
          savedLabIds={savedLabIds}
          onToggleSaveLab={handleToggleSaveLab}
          onBack={() => {
            setActiveCategory('Synthetic Biology');
            setViewMode('main');
          }}
          onExpressInterest={(lab) => setInterestTargetLab(lab)}
        />
      );
    }

    if (viewMode === 'lab-application') {
      return (
        <LabApplicationView
          currentUser={currentUser}
          onBack={() => {
            setActiveCategory('Synthetic Biology');
            setViewMode('main');
          }}
          onSubmittedToast={(msg) => {
            setToastMessage(msg);
            setTimeout(() => setToastMessage(null), 3500);
          }}
        />
      );
    }

    if (viewMode === 'dashboard' && currentUser) {
      return (
        <DashboardView
          currentUser={currentUser}
          savedNotes={savedNotes}
          userSubmissions={userSubmissions}
          savedLabs={savedLabs}
          onSelectNote={(note) => setSelectedDetailNote(note)}
          onToggleLike={handleToggleLike}
          onToggleSave={handleToggleSaveNote}
          onToggleSaveLab={handleToggleSaveLab}
          onCollaborate={(note) => setSelectedCollaborateNote(note)}
          onDeleteNote={handleDeleteRequest}
          onSelectLab={(lab) => {
            setSelectedLab(lab);
            setViewMode('lab-detail');
          }}
          onUpdateProfile={async (updated) => {
            const next = { ...currentUser, ...updated };
            setCurrentUser(next);
            try {
              localStorage.setItem('synbio_current_user', JSON.stringify(next));
              if (currentUser?.id) {
                await supabase
                  .from('profiles')
                  .update({
                    name: next.name,
                    bio: next.bio,
                    affiliation: next.affiliation,
                    identity_tag: next.identityTag,
                  })
                  .eq('id', currentUser.id);
              }
            } catch (err) {
              console.error('Profile update sync error:', err);
            }
          }}
          onBrowseIdeas={() => {
            setViewMode('main');
            setActiveCategory('Inspiration Square');
            setTimeout(() => {
              const feedEl = document.getElementById('inspiration-feed-anchor');
              if (feedEl) feedEl.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}
          onBrowseLabs={() => {
            setViewMode('main');
            setActiveCategory('Synthetic Biology');
          }}
          onPostIdea={handleTriggerPostIdea}
          onApplyToJoinLab={() => setViewMode('lab-application')}
          onGoToCommunity={(options) => {
            if (options?.openNewPost) {
              setOpenCommunityNewPost(true);
            }
            if (options?.editPost) {
              setOpenCommunityEditPost(options.editPost);
            }
            if (options?.targetPostId) {
              setOpenCommunityViewingPostId(options.targetPostId);
            }
            setViewMode('main');
            setActiveCategory('AI Community');
          }}
        />
      );
    }

    if (viewMode === 'admin') {
      if (!currentUser || !isUserAdmin(currentUser)) {
        return (
          <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
            <h2 className="text-2xl font-serif text-white mb-2">Access Denied</h2>
            <p className="text-sm text-neutral-400 mb-6 max-w-md">
              Only authorized administrator accounts have permission to view the Admin management dashboard.
            </p>
            <button
              onClick={() => setViewMode('main')}
              className="px-6 py-2.5 bg-white text-black text-xs font-bold rounded-full hover:bg-neutral-200 transition-all cursor-pointer"
            >
              Back to Inspirations
            </button>
          </div>
        );
      }
      return (
        <AdminDashboardView
          currentUser={currentUser}
          onBackToMain={() => setViewMode('main')}
          onToast={(msg) => {
            setToastMessage(msg);
            setTimeout(() => setToastMessage(null), 3500);
          }}
        />
      );
    }

    switch (activeCategory) {
      case 'Team':
        return <AboutView />;
      case 'Synthetic Biology':
        return (
          <LabView
            savedLabIds={savedLabIds}
            onToggleSaveLab={handleToggleSaveLab}
            onSelectLab={(lab) => {
              setSelectedLab(lab);
              setViewMode('lab-detail');
            }}
            onApplyToJoin={() => setViewMode('lab-application')}
            onExpressInterest={(lab) => setInterestTargetLab(lab)}
          />
        );
      case 'AI Community':
        return (
          <CommunityView
            currentUser={currentUser}
            onRequireAuth={() => setViewMode('signin')}
            initialOpenNewPost={openCommunityNewPost}
            onResetInitialOpenNewPost={() => setOpenCommunityNewPost(false)}
            initialEditingPost={openCommunityEditPost}
            onResetInitialEditingPost={() => setOpenCommunityEditPost(null)}
            initialViewingPostId={openCommunityViewingPostId}
            onResetInitialViewingPostId={() => setOpenCommunityViewingPostId(null)}
          />
        );
      default:
        return (
          <InspirationView
            notes={notes}
            onPostIdea={handleTriggerPostIdea}
            onCollaborate={(note) => setSelectedCollaborateNote(note)}
            onSelectNote={(note) => setSelectedDetailNote(note)}
            onToggleLike={handleToggleLike}
            onToggleSave={handleToggleSaveNote}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-black font-sans text-white antialiased selection:bg-white selection:text-black flex flex-col justify-between">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[200] max-w-md bg-neutral-900 border border-white/15 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Navigation Bar */}
      <Navigation
        activeCategory={activeCategory}
        setActiveCategory={(cat) => {
          setActiveCategory(cat);
          setViewMode('main');
        }}
        currentUser={currentUser}
        onPost={handleTriggerPostIdea}
        onSignIn={() => setViewMode('signin')}
        onSignUp={() => setViewMode('signup')}
        onDashboard={() => {
          if (currentUser) {
            setViewMode('dashboard');
          } else {
            setViewMode('signin');
          }
        }}
        onAdmin={() => {
          if (currentUser && isUserAdmin(currentUser)) {
            setViewMode('admin');
          }
        }}
        onLanding={() => {
          setViewMode('landing');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectNote={(note) => {
          setSelectedDetailNote(note);
        }}
        onSelectLab={(lab) => {
          setSelectedLab(lab);
          setViewMode('lab-detail');
        }}
        onSelectDiscussion={() => {
          setActiveCategory('AI Community');
          setViewMode('main');
        }}
        isAdminActive={viewMode === 'admin'}
        onSignOut={handleSignOut}
        isDashboardActive={viewMode === 'dashboard'}
        isLandingActive={viewMode === 'landing'}
      />

      <main className="flex-grow">{renderContent()}</main>

      {/* Project Detail Modal */}
      <ProjectDetailModal
        note={selectedDetailNote}
        isOpen={!!selectedDetailNote}
        onClose={() => setSelectedDetailNote(null)}
        onCollaborate={(note) => {
          setSelectedDetailNote(null);
          setSelectedCollaborateNote(note);
        }}
        onToggleLike={handleToggleLike}
        onToggleSave={handleToggleSaveNote}
        onAddComment={handleAddComment}
      />

      {/* Delete Idea Confirmation Modal */}
      <Modal
        isOpen={!!noteToDelete}
        onClose={() => setNoteToDelete(null)}
        title="Delete Research Idea"
        maxWidth="max-w-md"
      >
        <div className="space-y-5">
          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-200">
            <AlertTriangle className="text-rose-400 shrink-0 mt-0.5" size={20} />
            <div className="text-xs space-y-1">
              <p className="font-bold text-white text-sm">Are you sure you want to delete this idea?</p>
              <p className="text-neutral-400 leading-relaxed">
                "{noteToDelete?.title}" will be permanently removed from the Inspiration Square and your dashboard.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setNoteToDelete(null)}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-rose-600/20 active:scale-95"
            >
              <Trash2 size={13} />
              <span>Delete Idea</span>
            </button>
          </div>
        </div>
      </Modal>

      {/* Collaborate Request Modal */}
      <CollaborateModal
        note={selectedCollaborateNote}
        isOpen={!!selectedCollaborateNote}
        onClose={() => setSelectedCollaborateNote(null)}
      />

      {/* Express Interest Modal for Labs */}
      {interestTargetLab && (
        <ExpressInterestModal
          lab={interestTargetLab}
          onClose={() => setInterestTargetLab(null)}
          onSuccessToast={(msg) => {
            setToastMessage(msg);
            setTimeout(() => setToastMessage(null), 3500);
          }}
        />
      )}

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-xs text-neutral-500 text-center sm:text-left">
            © 2026 SynbioAI Palantir. The Global Marketplace for Scientific Imagination.
          </p>
          <div className="flex items-center gap-6 text-xs font-medium text-neutral-500">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Research
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Academic Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

