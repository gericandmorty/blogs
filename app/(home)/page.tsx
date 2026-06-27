'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BlogPostCard from '../components/BlogPostCard';
import { fetchAllPosts, getPostHref } from '../data';
import {
  Terminal,
  Code2,
  Monitor,
  BookOpen,
  Search,
  Clock,
  Calendar,
  Tag,
  ArrowRight,
  MessageSquare,
  Database,
  Layers,
} from 'lucide-react';
import Link from 'next/link';
import { Category, BlogPost } from '../types';

const CATEGORY_FILTERS: { label: string; value: Category | 'all'; icon: React.ReactNode; tagClass: string }[] = [
  { label: 'All Posts', value: 'all',     icon: <BookOpen  className="h-4 w-4" />, tagClass: 'tag-general' },
  { label: 'Linux',     value: 'linux',   icon: <Terminal  className="h-4 w-4" />, tagClass: 'tag-linux'   },
  { label: 'Windows',   value: 'windows', icon: <Monitor   className="h-4 w-4" />, tagClass: 'tag-windows' },
  { label: 'Coding',    value: 'coding',  icon: <Code2     className="h-4 w-4" />, tagClass: 'tag-coding'  },
  { label: 'Languages', value: 'languages', icon: <Code2     className="h-4 w-4" />, tagClass: 'tag-coding'  },
  { label: 'Databases', value: 'databases', icon: <Database  className="h-4 w-4" />, tagClass: 'tag-coding'  },
  { label: 'Framework', value: 'framework', icon: <Layers    className="h-4 w-4" />, tagClass: 'tag-coding'  },
];

const CATEGORY_META: Record<Category, { label: string; icon: React.ReactNode; tagClass: string }> = {
  linux:     { label: 'Linux',     icon: <Terminal className="h-3.5 w-3.5" />, tagClass: 'tag-linux'     },
  windows:   { label: 'Windows',   icon: <Monitor  className="h-3.5 w-3.5" />, tagClass: 'tag-windows'   },
  coding:    { label: 'Coding',    icon: <Code2    className="h-3.5 w-3.5" />, tagClass: 'tag-coding'     },
  languages: { label: 'Languages', icon: <Code2    className="h-3.5 w-3.5" />, tagClass: 'tag-coding'     },
  databases: { label: 'Databases', icon: <Database className="h-3.5 w-3.5" />, tagClass: 'tag-coding'     },
  framework: { label: 'Framework', icon: <Layers   className="h-3.5 w-3.5" />, tagClass: 'tag-coding'     },
  general:   { label: 'General',   icon: <Tag      className="h-3.5 w-3.5" />, tagClass: 'tag-general'    },
};

/* ─────────────────────────────────────────────
   Home Page
───────────────────────────────────────────── */
export default function HomePage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');
  const observerRef = useRef<HTMLDivElement | null>(null);

  const fetchLimit = 6;

  // Fetch page wrapper
  const fetchPage = async (pageNum: number, isReset: boolean) => {
    try {
      const data = await fetchAllPosts(undefined, pageNum, fetchLimit, searchQuery, activeCategory);
      setPosts((prev) => {
        const combined = isReset ? data : [...prev, ...data];
        const seen = new Set();
        return combined.filter((p) => {
          if (seen.has(p.id)) return false;
          seen.add(p.id);
          return true;
        });
      });
      if (data.length < fetchLimit) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (err) {
      console.error('Error fetching posts page:', err);
    } finally {
      setLoading(false);
    }
  };

  // Reset list and fetch page 1 on active filter adjustments
  useEffect(() => {
    setLoading(true);
    setPage(1);
    fetchPage(1, true);
  }, [activeCategory, searchQuery]);

  // Load next page function
  const loadNextPage = () => {
    if (!hasMore || loading) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPage(nextPage, false);
  };

  // Choose the first featured post (only on initial load / when no search or category filters are set)
  const featuredPost = useMemo(() => {
    if (activeCategory !== 'all' || searchQuery) return null;
    return posts.find((p) => p.isFeatured) || null;
  }, [posts, activeCategory, searchQuery]);

  // All other posts to render in the grid
  const restPosts = useMemo(() => {
    if (!featuredPost) return posts;
    return posts.filter((p) => p.id !== featuredPost.id);
  }, [posts, featuredPost]);

  // Infinite scroll trigger scroll check
  useEffect(() => {
    if (loading || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadNextPage();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    const target = observerRef.current;
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [loading, hasMore, page]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} showSearch />

      {loading && posts.length === 0 ? (
        <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 flex items-center justify-center">
          <div className="text-muted text-sm font-semibold animate-pulse">Loading posts...</div>
        </main>
      ) : (
        <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 space-y-8">

          {/* ── Feed header ── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in-up">
            <div>
              <h1 className="text-xl font-bold text-foreground">Latest Posts</h1>
              <p className="text-xs text-muted mt-0.5">
                Showing {posts.length} {posts.length === 1 ? 'post' : 'posts'}
                {activeCategory !== 'all' ? ` in ${activeCategory}` : ''}
                {searchQuery ? ` matching "${searchQuery}"` : ''}
              </p>
            </div>

            {/* Category filter pills */}
            <div className="flex flex-wrap items-center gap-2">
              {CATEGORY_FILTERS.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value as Category | 'all')}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-150 cursor-pointer border ${
                    activeCategory === cat.value
                      ? `${cat.tagClass} shadow-sm`
                      : 'border-border bg-muted-background text-muted hover:text-foreground hover:border-border'
                  }`}
                >
                  {cat.icon}
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile search */}
          <div className="sm:hidden flex items-center gap-2 rounded-lg border border-border bg-muted-background px-3 py-2">
            <Search className="h-4 w-4 text-muted shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts…"
              className="w-full bg-transparent text-sm focus:outline-none placeholder-muted"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-muted text-xs">✕</button>
            )}
          </div>

          {/* ── Post list ── */}
          {posts.length === 0 && !loading ? (
            <div className="rounded-xl border border-border bg-card p-12 text-center animate-fade-in-up">
              <p className="text-lg text-muted font-semibold">No posts found.</p>
              <p className="text-sm text-muted mt-1">Try a different search term or category.</p>
              <button
                onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                className="mt-4 rounded-full bg-primary hover:bg-primary-hover px-5 py-2 text-sm font-bold text-white transition-colors shadow-sm cursor-pointer"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="space-y-8 animate-fade-in-up">
              {/* Highlight Featured Post */}
              {featuredPost && (
                <div className="border-b border-border/40 pb-8">
                  <div className="text-[10px] font-black uppercase tracking-widest text-primary mb-3.5 flex items-center gap-1.5">
                    ✦ Featured Article
                  </div>
                  <BlogPostCard post={featuredPost} featured />
                </div>
              )}

              {/* Grid of other posts */}
              {restPosts.length > 0 && (
                <div className="space-y-4">
                  {featuredPost && (
                    <h2 className="text-xs font-bold uppercase tracking-wider text-muted">More Articles</h2>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {restPosts.map((post) => (
                      <BlogPostCard key={post.id} post={post} />
                    ))}
                  </div>
                </div>
              )}

              {/* Infinite Scroll loading indicator */}
              {hasMore && (
                <div ref={observerRef} className="py-10 flex flex-col justify-center items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"></div>
                  <span className="text-[11px] text-muted font-semibold tracking-wider uppercase">Loading more posts...</span>
                </div>
              )}
            </div>
          )}

        </main>
      )}

      <Footer />
    </div>
  );
}
