'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import BlogPostCard from '../../components/BlogPostCard';
import { fetchPostsByCategory } from '../../data';
import { Layers, Search } from 'lucide-react';
import { BlogPost } from '../../types';

function FrameworksPageContent() {
  const [postsList, setPostsList] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const searchParams = useSearchParams();
  const activeTag = searchParams.get('tag') || '';

  useEffect(() => {
    fetchPostsByCategory('framework')
      .then((data) => {
        setPostsList(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const posts = postsList.filter((p) => {
    const matchesSearch = !searchQuery.trim() ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTag = !activeTag ||
      p.tags.some((t) => t.toLowerCase() === activeTag.toLowerCase());

    return matchesSearch && matchesTag;
  });

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} showSearch />

      {loading ? (
        <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-10 flex items-center justify-center">
          <div className="text-muted text-sm font-semibold animate-pulse">Loading posts...</div>
        </main>
      ) : (
        <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-10 space-y-6">
          {/* Hero banner */}
          <section className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 animate-fade-in-up">
            <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full blur-3xl"
                 style={{ background: 'color-mix(in srgb, var(--tag-coding) 12%, transparent)' }} />
            <div className="relative flex items-center gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl tag-coding shadow-lg">
                <Layers className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">Frameworks</h1>
                <p className="text-muted text-sm mt-1 max-w-xl leading-relaxed">
                  Prerequisites, installation, and environment setup guides for ASP.NET Core, Next.js, NestJS, Rust Cargo, and more.
                </p>
                <p className="text-xs text-muted mt-2">
                  {postsList.length} {postsList.length === 1 ? 'post' : 'posts'}
                  {activeTag && ` (showing ${posts.length} filtered)`}
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
              placeholder="Search posts…"
              className="w-full bg-transparent text-sm focus:outline-none placeholder-muted"
            />
          </div>

          {/* Active Tag Filter Info */}
          {activeTag && (
            <div className="flex items-center justify-between bg-card border border-border px-4 py-2.5 rounded-xl animate-fade-in-up">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted">Filtered by tag:</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold tag-coding text-primary-foreground">
                  {activeTag}
                  <Link
                    href="/coding/frameworks"
                    className="hover:bg-primary-hover rounded p-0.5 flex items-center justify-center ml-1 text-white"
                    title="Clear tag filter"
                  >
                    ✕
                  </Link>
                </span>
              </div>
              <Link
                href="/coding/frameworks"
                className="text-xs text-primary hover:underline font-medium"
              >
                Clear filter
              </Link>
            </div>
          )}

          {/* Posts */}
          {posts.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-12 text-center">
              <p className="text-muted font-semibold">No posts found.</p>
              <div className="flex justify-center gap-4 mt-3">
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="text-sm text-primary hover:underline cursor-pointer">
                    Clear search
                  </button>
                )}
                {activeTag && (
                  <Link href="/coding/frameworks" className="text-sm text-primary hover:underline">
                    Clear tag filter
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in-up">
              {posts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </main>
      )}

      <Footer />
    </div>
  );
}

export default function FrameworksPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Navbar showSearch />
        <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-10 flex items-center justify-center">
          <div className="text-muted text-sm font-semibold animate-pulse">Loading frameworks page...</div>
        </main>
        <Footer />
      </div>
    }>
      <FrameworksPageContent />
    </Suspense>
  );
}
