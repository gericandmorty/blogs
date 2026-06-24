'use client';

import React from 'react';
import Link from 'next/link';
import { Clock, Calendar, ArrowRight, Terminal, Monitor, Code2, Tag } from 'lucide-react';
import { BlogPost, Category } from '../types';

const CATEGORY_META: Record<Category, { label: string; icon: React.ReactNode; tagClass: string }> = {
  linux:   { label: 'Linux',   icon: <Terminal className="h-3.5 w-3.5" />, tagClass: 'tag-linux' },
  windows: { label: 'Windows', icon: <Monitor  className="h-3.5 w-3.5" />, tagClass: 'tag-windows' },
  coding:  { label: 'Coding',  icon: <Code2    className="h-3.5 w-3.5" />, tagClass: 'tag-coding' },
  general: { label: 'General', icon: <Tag      className="h-3.5 w-3.5" />, tagClass: 'tag-general' },
};

interface BlogPostCardProps {
  post: BlogPost;
  featured?: boolean;
}

export default function BlogPostCard({ post, featured = false }: BlogPostCardProps) {
  const meta = CATEGORY_META[post.category];

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article
        className={`card-hover rounded-xl border border-border bg-card text-card-foreground overflow-hidden ${
          featured ? 'flex flex-col md:flex-row gap-0' : ''
        }`}
      >
        {/* Cover image (if present) */}
        {post.coverImageUrl && (
          <div
            className={`overflow-hidden bg-muted-background ${
              featured
                ? 'md:w-2/5 h-52 md:h-auto shrink-0'
                : 'h-44 w-full'
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverImageUrl}
              alt={post.title}
              className="h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
              loading="lazy"
            />
          </div>
        )}

        {/* No cover: decorative gradient bar */}
        {!post.coverImageUrl && (
          <div className="h-1.5 w-full bg-gradient-to-r from-primary via-accent to-secondary opacity-70" />
        )}

        {/* Content */}
        <div className={`p-5 flex flex-col gap-3 ${featured && post.coverImageUrl ? 'flex-1' : ''}`}>
          {/* Top meta row */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Category pill */}
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${meta.tagClass}`}>
              {meta.icon}
              {meta.label}
            </span>

            {/* Additional tags */}
            {post.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border bg-muted-background px-2 py-0.5 text-[10px] font-medium text-muted"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h2
            className={`font-bold leading-snug text-foreground group-hover:text-primary transition-colors ${
              featured ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg'
            }`}
          >
            {post.title}
          </h2>

          {/* Excerpt */}
          <p className="text-sm text-muted leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>

          {/* Footer row */}
          <div className="flex items-center justify-between mt-auto pt-1">
            <div className="flex items-center gap-3 text-xs text-muted font-medium">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {post.publishedAt}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {post.readTimeMinutes} min read
              </span>
            </div>

            <span className="flex items-center gap-1 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              Read more <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
