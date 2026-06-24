'use client';

import React, { useState, useMemo } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BlogPostCard from './components/BlogPostCard';
import { ALL_POSTS } from './data';
import {
  Terminal,
  Code2,
  Monitor,
  BookOpen,
  Search,
} from 'lucide-react';

import { Category } from './types';
import Link from 'next/link';

const CATEGORY_FILTERS: { label: string; value: Category | 'all'; icon: React.ReactNode; tagClass: string }[] = [
  { label: 'All Posts', value: 'all',     icon: <BookOpen  className="h-4 w-4" />, tagClass: 'tag-general' },
  { label: 'Linux',     value: 'linux',   icon: <Terminal  className="h-4 w-4" />, tagClass: 'tag-linux'   },
  { label: 'Windows',   value: 'windows', icon: <Monitor   className="h-4 w-4" />, tagClass: 'tag-windows' },
  { label: 'Coding',    value: 'coding',  icon: <Code2     className="h-4 w-4" />, tagClass: 'tag-coding'  },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');

  const filteredPosts = useMemo(() => {
    return ALL_POSTS.filter((post) => {
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
  }, [searchQuery, activeCategory]);

  const featuredPost = activeCategory === 'all' && !searchQuery ? filteredPosts[0] : null;
  const restPosts = featuredPost ? filteredPosts.slice(1) : filteredPosts;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showSearch
      />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 space-y-8">

        {/* ── Section quick-links ── */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in-up">
          {[
            { href: '/os/linux',   label: 'Linux',   desc: 'Terminal & system docs', icon: <Terminal className="h-6 w-6" />, tagClass: 'tag-linux'   },
            { href: '/os/windows', label: 'Windows', desc: 'Setup guides & tips',    icon: <Monitor  className="h-6 w-6" />, tagClass: 'tag-windows' },
            { href: '/coding',     label: 'Coding',  desc: 'Dev notes & patterns',   icon: <Code2    className="h-6 w-6" />, tagClass: 'tag-coding'  },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 card-hover"
            >
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.tagClass}`}>
                {item.icon}
              </div>
              <div>
                <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {item.label}
                </p>
                <p className="text-xs text-muted">{item.desc}</p>
              </div>
            </Link>
          ))}
        </section>

        {/* ── Posts Feed ── */}
        <section className="space-y-6 animate-fade-in-up">
          {/* Feed header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">Latest Posts</h2>
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

          {/* Featured post */}
          {featuredPost && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-3">
                ✦ Featured
              </p>
              <BlogPostCard post={featuredPost} featured />
            </div>
          )}

          {/* Post grid */}
          {restPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {restPosts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            !featuredPost && (
              <div className="rounded-xl border border-border bg-card p-12 text-center">
                <p className="text-lg text-muted font-semibold">No posts found.</p>
                <p className="text-sm text-muted mt-1">
                  Try a different search term or category.
                </p>
                <button
                  onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                  className="mt-4 rounded-full bg-primary hover:bg-primary-hover px-5 py-2 text-sm font-bold text-white transition-colors shadow-sm cursor-pointer"
                >
                  Reset filters
                </button>
              </div>
            )
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
