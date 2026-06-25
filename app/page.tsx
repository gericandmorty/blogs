'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { fetchAllPosts, getPostHref } from './data';
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
} from 'lucide-react';
import Link from 'next/link';
import { Category, BlogPost } from './types';

const CATEGORY_FILTERS: { label: string; value: Category | 'all'; icon: React.ReactNode; tagClass: string }[] = [
  { label: 'All Posts', value: 'all',     icon: <BookOpen  className="h-4 w-4" />, tagClass: 'tag-general' },
  { label: 'Linux',     value: 'linux',   icon: <Terminal  className="h-4 w-4" />, tagClass: 'tag-linux'   },
  { label: 'Windows',   value: 'windows', icon: <Monitor   className="h-4 w-4" />, tagClass: 'tag-windows' },
  { label: 'Coding',    value: 'coding',  icon: <Code2     className="h-4 w-4" />, tagClass: 'tag-coding'  },
  { label: 'Languages', value: 'languages', icon: <Code2     className="h-4 w-4" />, tagClass: 'tag-coding'  },
  { label: 'Databases', value: 'databases', icon: <Database  className="h-4 w-4" />, tagClass: 'tag-coding'  },
];

const CATEGORY_META: Record<Category, { label: string; icon: React.ReactNode; tagClass: string }> = {
  linux:     { label: 'Linux',     icon: <Terminal className="h-3.5 w-3.5" />, tagClass: 'tag-linux'     },
  windows:   { label: 'Windows',   icon: <Monitor  className="h-3.5 w-3.5" />, tagClass: 'tag-windows'   },
  coding:    { label: 'Coding',    icon: <Code2    className="h-3.5 w-3.5" />, tagClass: 'tag-coding'     },
  languages: { label: 'Languages', icon: <Code2    className="h-3.5 w-3.5" />, tagClass: 'tag-coding'     },
  databases: { label: 'Databases', icon: <Database className="h-3.5 w-3.5" />, tagClass: 'tag-coding'     },
  general:   { label: 'General',   icon: <Tag      className="h-3.5 w-3.5" />, tagClass: 'tag-general'    },
};

/* ─────────────────────────────────────────────
   Expandable Post Row
───────────────────────────────────────────── */
function ExpandablePostRow({ post, featured = false, defaultExpanded = false }: { post: BlogPost; featured?: boolean; defaultExpanded?: boolean }) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [imgError, setImgError] = useState(false);
  const meta = CATEGORY_META[post.category];

  const isDark =
    post.coverImageUrl &&
    !imgError &&
    (post.coverImageUrl.includes('arch') ||
      post.coverImageUrl.includes('fedora') ||
      post.coverImageUrl.includes('tux'));

  const postHref = getPostHref(post);

  return (
    <div
      className={`rounded-xl border bg-card overflow-hidden transition-all duration-200 ${
        expanded ? 'border-primary shadow-[0_0_0_1px_var(--primary)]' : 'border-border hover:border-border/80'
      } ${featured ? 'ring-1 ring-primary/20' : ''}`}
    >
      {/* ── Compact row (click to toggle toggle preview) ── */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="group w-full flex items-center gap-4 px-4 py-3.5 text-left cursor-pointer"
      >
        {/* Thumbnail / icon */}
        {post.coverImageUrl && !imgError ? (
          <div
            className={`h-11 w-11 shrink-0 rounded-lg overflow-hidden flex items-center justify-center ${
              isDark ? 'bg-[#0f141c]' : 'bg-muted-background'
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverImageUrl}
              alt={post.title}
              onError={() => setImgError(true)}
              className={`h-full w-full ${isDark ? 'object-contain p-1.5' : 'object-cover'}`}
              loading="lazy"
            />
          </div>
        ) : (
          <div className={`h-11 w-11 shrink-0 rounded-lg flex items-center justify-center ${meta.tagClass}`}>
            {meta.icon}
          </div>
        )}

        {/* Title + meta */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {featured && (
              <span className="text-[9px] font-black uppercase tracking-widest text-muted">✦ Featured</span>
            )}
            <h3
              className={`font-semibold text-sm leading-snug transition-colors ${
                expanded ? 'text-primary' : 'text-foreground group-hover:text-primary'
              }`}
            >
              {post.title}
            </h3>
          </div>

          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-muted flex-wrap">
            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold ${meta.tagClass}`}>
              {meta.icon}
              {meta.label}
            </span>
            <span className="opacity-40">·</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{post.readTimeMinutes} min</span>
            <span className="opacity-40">·</span>
            <span className="flex items-center gap-1"><Tag className="h-3 w-3" />{post.tags.length} {post.tags.length === 1 ? 'tag' : 'tags'}</span>
            <span className="opacity-40">·</span>
            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{post.publishedAt}</span>
          </div>
        </div>

        {/* Right — comments badge */}
        <div className="shrink-0 hidden sm:flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-lg border border-border bg-muted-background px-3 py-1.5 text-[11px] font-medium text-muted">
            <MessageSquare className="h-3.5 w-3.5" />
            Comments ({post.comments?.length ?? 0})
          </span>
        </div>
      </button>

      {/* ── Expandable preview ── */}
      <div
        className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
          expanded ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="border-t border-border bg-muted-background/20 flex gap-5 p-4">

          {/* Cover image preview */}
          {post.coverImageUrl && (
            <div
              className={`h-36 w-52 shrink-0 rounded-lg overflow-hidden flex items-center justify-center ${
                isDark ? 'bg-[#0f141c]' : 'bg-muted-background'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.coverImageUrl}
                alt={post.title}
                className={`h-full w-full ${isDark ? 'object-contain p-4' : 'object-cover'}`}
              />
            </div>
          )}

          {/* Excerpt + tags + CTA */}
          <div className="flex flex-col justify-between flex-1 min-w-0 py-0.5">
            <div>
              <p className="text-sm text-muted leading-relaxed line-clamp-3">{post.excerpt}</p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border bg-muted-background px-2 py-0.5 text-[10px] font-medium text-muted"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <Link
              href={postHref}
              className="self-start mt-4 flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-hover transition-colors"
            >
              Click post to view content <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Home Page
───────────────────────────────────────────── */
export default function HomePage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');

  useEffect(() => {
    fetchAllPosts()
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      if (!post.isFeatured) return false;

      const matchesCategory =
        activeCategory === 'all' || post.category === activeCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.tags.some((t) => t.toLowerCase().includes(q)) ||
        post.category.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [posts, searchQuery, activeCategory]);

  const featuredPost = activeCategory === 'all' && !searchQuery ? filteredPosts[0] : null;
  const restPosts    = featuredPost ? filteredPosts.slice(1) : filteredPosts;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} showSearch />

      {loading ? (
        <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 flex items-center justify-center">
          <div className="text-muted text-sm font-semibold animate-pulse">Loading posts...</div>
        </main>
      ) : (
        <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 space-y-6">

          {/* ── Feed header ── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in-up">
            <div>
              <h1 className="text-xl font-bold text-foreground">Latest Posts</h1>
              <p className="text-xs text-muted mt-0.5">
                {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
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
          {filteredPosts.length === 0 ? (
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
            <div className="space-y-2 animate-fade-in-up">
              {featuredPost && (
                <ExpandablePostRow post={featuredPost} featured defaultExpanded />
              )}
              {restPosts.map((post) => (
                <ExpandablePostRow key={post.id} post={post} />
              ))}
            </div>
          )}

        </main>
      )}

      <Footer />
    </div>
  );
}
