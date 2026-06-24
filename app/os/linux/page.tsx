'use client';

import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import BlogPostCard from '../../components/BlogPostCard';
import { getPostsByCategory } from '../../data';
import { Terminal, Search } from 'lucide-react';

export default function LinuxPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const allPosts = getPostsByCategory('linux');
  const posts = allPosts.filter((p) =>
    !searchQuery.trim() ||
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} showSearch />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-10 space-y-8">
        {/* Hero banner */}
        <section className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 animate-fade-in-up">
          <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full blur-3xl"
               style={{ background: 'color-mix(in srgb, var(--tag-linux) 15%, transparent)' }} />
          <div className="relative flex items-center gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl tag-linux shadow-lg">
              <Terminal className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">Linux</h1>
              <p className="text-muted text-sm mt-1 max-w-xl leading-relaxed">
                Terminal commands, system configuration, shell scripting, and everything
                about living in the Linux ecosystem as a developer.
              </p>
              <p className="text-xs text-muted mt-2">
                {allPosts.length} {allPosts.length === 1 ? 'post' : 'posts'}
              </p>
            </div>
          </div>
        </section>

        {/* Mobile search */}
        <div className="sm:hidden flex items-center gap-2 rounded-lg border border-border bg-muted-background px-3 py-2">
          <Search className="h-4 w-4 text-muted shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Linux posts…"
            className="w-full bg-transparent text-sm focus:outline-none placeholder-muted"
          />
        </div>

        {/* Posts */}
        {posts.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <p className="text-muted font-semibold">No posts found.</p>
            <button onClick={() => setSearchQuery('')} className="mt-3 text-sm text-primary hover:underline cursor-pointer">
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in-up">
            {posts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
