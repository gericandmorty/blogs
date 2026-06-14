'use client';

import React, { useState } from 'react';
import Navbar from '../../components/navbar/home/Navbar';
import SidebarLeft from './_components/SidebarLeft';
import SidebarRight from './_components/SidebarRight';
import PostCard from './_components/PostCard';
import CreatePostModal from './_components/CreatePostModal';
import PostDetailModal from './_components/PostDetailModal';
import { Post, SubredditInfo, Comment } from '../../types';
import { Image as ImageIcon, Link as LinkIcon } from 'lucide-react';

const INITIAL_SUBREDDITS: SubredditInfo[] = [
  {
    name: 'reactjs',
    displayName: 'r/reactjs',
    description: 'A community for the React JavaScript library and its ecosystem.',
    subscribers: '452k members',
    online: '1.2k online',
    iconColor: 'bg-cyan-500',
    createdDate: 'Created Sep 10, 2013',
  },
  {
    name: 'nextjs',
    displayName: 'r/nextjs',
    description: 'The official subreddit for Next.js, the React Framework for the Web.',
    subscribers: '128k members',
    online: '640 online',
    iconColor: 'bg-zinc-800 dark:bg-zinc-200 dark:text-zinc-900',
    createdDate: 'Created Oct 25, 2016',
  },
  {
    name: 'webdev',
    displayName: 'r/webdev',
    description: 'A community for all things web development: frontend, backend, tools, and news.',
    subscribers: '1.8m members',
    online: '4.9k online',
    iconColor: 'bg-indigo-500',
    createdDate: 'Created Jan 15, 2009',
  },
  {
    name: 'gaming',
    displayName: 'r/gaming',
    description: 'A subreddit for everything related to gaming: news, reviews, memes, and discussions.',
    subscribers: '39m members',
    online: '102k online',
    iconColor: 'bg-rose-500',
    createdDate: 'Created Sep 17, 2007',
  },
  {
    name: 'aww',
    displayName: 'r/aww',
    description: 'Things that make you go AWW! Like puppies, kittens, bunnies, and baby animals.',
    subscribers: '35m members',
    online: '28k online',
    iconColor: 'bg-amber-500',
    createdDate: 'Created Jan 25, 2008',
  },
];

const INITIAL_POSTS: Post[] = [
  {
    id: 'post-1',
    title: 'Why React 19 is a game changer for library authors and UI developers',
    content: `React 19 introduces a slew of features that simplify client-side development. The most anticipated is the compiler (React compiler / Forget) which automates memoization (removing the need for useMemo and useCallback in 90% of cases).

Additionally, Server Components and Actions provide a unified way to fetch data and write mutations, significantly reducing client-side boilerplate.

What libraries are you most excited to see refactored with the new features?`,
    type: 'text',
    subreddit: 'reactjs',
    author: 'dan_abramov',
    createdAt: '3 hours ago',
    ups: 245,
    commentsCount: 3,
    myVote: null,
    comments: [
      {
        id: 'c-1',
        author: 'form_ninja',
        content: 'Finally! The transition to Actions makes form handling so much cleaner. Especially using useActionState for pending animations.',
        createdAt: '2 hours ago',
        ups: 32,
        replies: [
          {
            id: 'c-2',
            author: 'nextjs_fan',
            content: 'Agree, no more useState boilerplate for pending indicators. It just works natively.',
            createdAt: '1 hour ago',
            ups: 12,
            replies: []
          }
        ]
      },
      {
        id: 'c-3',
        author: 'curious_dev',
        content: 'Can someone explain the benefits of the use() hook compared to useContext? Is it just that it can be called conditionally?',
        createdAt: '45m ago',
        ups: 7,
        replies: []
      }
    ]
  },
  {
    id: 'post-2',
    title: 'Stunning Next.js App Router boundary architecture diagram',
    content: '',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    subreddit: 'nextjs',
    author: 'leeerob',
    createdAt: '5 hours ago',
    ups: 412,
    commentsCount: 2,
    myVote: 'up',
    comments: [
      {
        id: 'c-4',
        author: 'archi_tech',
        content: 'This diagram is extremely helpful! Explains server vs client components boundary perfectly. Saved.',
        createdAt: '4 hours ago',
        ups: 15,
        replies: []
      },
      {
        id: 'c-5',
        author: 'web_novice',
        content: 'Does anyone have a high-res PDF version? Would love to print this as a cheatsheet.',
        createdAt: '2 hours ago',
        ups: 3,
        replies: []
      }
    ]
  },
  {
    id: 'post-3',
    title: 'MDN Web Docs: CSS Anchor Positioning Guide is finally out!',
    content: 'Anchor positioning is a revolutionary CSS feature allowing us to position tooltips, menus, and popovers relative to anchor elements without Javascript loops.',
    type: 'link',
    mediaUrl: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_anchor_positioning',
    subreddit: 'webdev',
    author: 'mozhacks',
    createdAt: '1 day ago',
    ups: 189,
    commentsCount: 1,
    myVote: null,
    comments: [
      {
        id: 'c-6',
        author: 'flexbox_expert',
        content: 'Anchor positioning is going to remove so much absolute positioning absolute hackery. Can\'t wait for full safari compatibility!',
        createdAt: '18 hours ago',
        ups: 24,
        replies: []
      }
    ]
  },
  {
    id: 'post-4',
    title: 'What is your absolute favorite indie game of all time? Looking for recommendations.',
    content: `For me, it has to be Outer Wilds. The sense of discovery, the physics engine, and the way the story pieces itself together is unmatched. I wish I could wipe my memory and play it again.

What about you guys? Celeste, Hollow Knight, Hades, Slay the Spire? Suggest your top choices!`,
    type: 'text',
    subreddit: 'gaming',
    author: 'gamer_pro',
    createdAt: '2 days ago',
    ups: 350,
    commentsCount: 2,
    myVote: null,
    comments: [
      {
        id: 'c-7',
        author: 'vessel_99',
        content: 'Hollow Knight is a masterpiece. The art, music, world design, and precise combat are flawless. Can\'t wait for Silksong.',
        createdAt: '1 day ago',
        ups: 42,
        replies: []
      },
      {
        id: 'c-8',
        author: 'space_explorer',
        content: 'Outer Wilds is indeed a once-in-a-lifetime experience. Glad to see it getting the appreciation it deserves.',
        createdAt: '22 hours ago',
        ups: 18,
        replies: []
      }
    ]
  },
  {
    id: 'post-5',
    title: 'Meet my new coding buddy, he likes sitting on my keyboard when I write React',
    content: '',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
    subreddit: 'aww',
    author: 'cat_parent',
    createdAt: '3 days ago',
    ups: 1045,
    commentsCount: 1,
    myVote: null,
    comments: [
      {
        id: 'c-9',
        author: 'dog_person',
        content: 'A true copycat! That look says "do not write code, feed me instead". So cute.',
        createdAt: '2 days ago',
        ups: 87,
        replies: []
      }
    ]
  }
];

export default function Home() {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [subreddits] = useState<SubredditInfo[]>(INITIAL_SUBREDDITS);
  const [selectedSubreddit, setSelectedSubreddit] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeDetailPost, setActiveDetailPost] = useState<Post | null>(null);

  // Voting action handler
  const handleVote = (postId: string, voteType: 'up' | 'down') => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id !== postId) return post;
        
        let newVote: 'up' | 'down' | null = voteType;
        let diff = 0;

        if (post.myVote === voteType) {
          // Toggle off
          newVote = null;
          diff = voteType === 'up' ? -1 : 1;
        } else if (post.myVote === null) {
          // New vote
          diff = voteType === 'up' ? 1 : -1;
        } else {
          // Switch vote
          diff = voteType === 'up' ? 2 : -2;
        }

        const updatedPost = {
          ...post,
          myVote: newVote,
          ups: post.ups + diff,
        };

        // If this post is currently active in detail modal, update its preview too
        if (activeDetailPost && activeDetailPost.id === postId) {
          setActiveDetailPost(updatedPost);
        }

        return updatedPost;
      })
    );
  };

  // Add Comment recursion helper
  const addCommentToTree = (commentsList: Comment[], parentId: string, newComment: Comment): boolean => {
    for (let i = 0; i < commentsList.length; i++) {
      const comment = commentsList[i];
      if (comment.id === parentId) {
        if (!comment.replies) {
          comment.replies = [];
        }
        comment.replies.push(newComment);
        return true;
      }
      const replies = comment.replies;
      if (replies && replies.length > 0) {
        const found = addCommentToTree(replies, parentId, newComment);
        if (found) return true;
      }
    }
    return false;
  };

  // Adding a comment to post
  const handleAddComment = (postId: string, parentCommentId: string | null, content: string) => {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      author: 'coder_reddit',
      content,
      createdAt: 'Just now',
      ups: 1,
      replies: [],
    };

    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id !== postId) return post;

        const updatedComments = [...post.comments];
        if (parentCommentId === null) {
          updatedComments.unshift(newComment);
        } else {
          addCommentToTree(updatedComments, parentCommentId, newComment);
        }

        const updatedPost = {
          ...post,
          commentsCount: post.commentsCount + 1,
          comments: updatedComments,
        };

        if (activeDetailPost && activeDetailPost.id === postId) {
          setActiveDetailPost(updatedPost);
        }

        return updatedPost;
      })
    );
  };

  // Create post handler
  const handleCreatePost = (newPostData: Omit<Post, 'id' | 'ups' | 'commentsCount' | 'comments' | 'myVote' | 'createdAt'>) => {
    const newPost: Post = {
      ...newPostData,
      id: `post-${Date.now()}`,
      ups: 1,
      commentsCount: 0,
      comments: [],
      myVote: 'up', // Author automatically upvotes their own post
      createdAt: 'Just now',
    };

    setPosts([newPost, ...posts]);
    setIsCreateModalOpen(false);
  };

  // Filter posts based on subreddit selection & search query
  const filteredPosts = posts.filter((post) => {
    // Subreddit filter
    if (selectedSubreddit && selectedSubreddit !== 'all' && selectedSubreddit !== 'popular') {
      if (post.subreddit !== selectedSubreddit) return false;
    }
    
    // Search query filter (matches title, content, author, subreddit)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchTitle = post.title.toLowerCase().includes(query);
      const matchContent = post.content.toLowerCase().includes(query);
      const matchAuthor = post.author.toLowerCase().includes(query);
      const matchSubreddit = post.subreddit.toLowerCase().includes(query);
      return matchTitle || matchContent || matchAuthor || matchSubreddit;
    }

    return true;
  });

  // Popular sort if selected
  if (selectedSubreddit === 'popular') {
    filteredPosts.sort((a, b) => b.ups - a.ups);
  }

  const currentSubredditInfo = selectedSubreddit 
    ? INITIAL_SUBREDDITS.find((sub) => sub.name === selectedSubreddit) || null
    : null;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Top Navigation */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onCreatePostClick={() => setIsCreateModalOpen(true)}
      />

      {/* Main Board Container */}
      <div className="flex flex-1 w-full max-w-7xl mx-auto items-stretch">
        
        {/* Left Side Navigation (Desktop only) */}
        <SidebarLeft
          subreddits={subreddits}
          selectedSubreddit={selectedSubreddit}
          onSelectSubreddit={(sub) => {
            setSelectedSubreddit(sub);
            setSearchQuery(''); // Reset search on navigation change
          }}
        />

        {/* Center Feed Column */}
        <main className="flex-1 min-w-0 p-4 space-y-4 max-w-3xl">
          
          {/* Subreddit Header for mobile */}
          {currentSubredditInfo && (
            <div className="rounded-md border border-border bg-card p-4 text-card-foreground shadow-sm md:hidden">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white ${currentSubredditInfo.iconColor}`}>
                  r/
                </div>
                <div>
                  <h1 className="text-base font-bold">r/{currentSubredditInfo.name}</h1>
                  <p className="text-xs text-muted leading-tight">{currentSubredditInfo.subscribers} • {currentSubredditInfo.online}</p>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-card-foreground/90">{currentSubredditInfo.description}</p>
            </div>
          )}

          {/* Quick Create Post Input box */}
          <div className="flex items-center gap-3 rounded-md border border-border bg-card p-3 text-card-foreground shadow-sm">
            <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-bold border border-orange-200">
              U
            </div>
            <input
              type="text"
              readOnly
              onClick={() => setIsCreateModalOpen(true)}
              placeholder="Create Post"
              className="flex-1 rounded-md bg-muted-background hover:bg-border/30 hover:border-border border border-transparent px-3 py-1.5 text-xs font-semibold text-muted focus:outline-none cursor-pointer transition-all duration-150"
            />
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="rounded p-1.5 hover:bg-muted-background text-muted hover:text-foreground transition-colors cursor-pointer"
              title="Post Image"
            >
              <ImageIcon className="h-4.5 w-4.5" />
            </button>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="rounded p-1.5 hover:bg-muted-background text-muted hover:text-foreground transition-colors cursor-pointer"
              title="Post Link"
            >
              <LinkIcon className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* Feed Filter Meta */}
          {searchQuery && (
            <div className="text-xs font-bold text-muted flex items-center gap-2 py-1">
              <span>Search results for: "{searchQuery}"</span>
              <span>•</span>
              <button
                onClick={() => setSearchQuery('')}
                className="text-primary hover:underline hover:text-primary-hover"
              >
                Clear Search
              </button>
            </div>
          )}

          {/* Posts List */}
          <div className="space-y-3">
            {filteredPosts.length === 0 ? (
              <div className="rounded-md border border-border bg-card p-8 text-center text-card-foreground shadow-sm">
                <p className="text-sm text-muted font-semibold">Wow, such empty.</p>
                <p className="mt-1.5 text-xs text-muted">We couldn't find any posts matching your criteria.</p>
                {(searchQuery || selectedSubreddit) && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedSubreddit(null);
                    }}
                    className="mt-4 rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-white hover:bg-primary-hover transition-colors shadow-sm"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            ) : (
              filteredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onVote={handleVote}
                  onPostClick={(p) => setActiveDetailPost(p)}
                />
              ))
            )}
          </div>
        </main>

        {/* Right Info Sidebar (Desktop only) */}
        <SidebarRight
          currentSubredditInfo={currentSubredditInfo}
          subreddits={subreddits}
          onSelectSubreddit={setSelectedSubreddit}
          onCreatePostClick={() => setIsCreateModalOpen(true)}
        />
      </div>

      {/* Create Post Dialog Overlay */}
      {isCreateModalOpen && (
        <CreatePostModal
          subreddits={subreddits}
          defaultSubreddit={selectedSubreddit}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreatePost}
        />
      )}

      {/* Post Detail Dialog Overlay */}
      {activeDetailPost && (
        <PostDetailModal
          post={activeDetailPost}
          onClose={() => setActiveDetailPost(null)}
          onVote={handleVote}
          onAddComment={handleAddComment}
        />
      )}
    </div>
  );
}
