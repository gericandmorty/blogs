'use client';

import React, { useState } from 'react';
import { ArrowBigUp, ArrowBigDown, MessageSquare, Share2, Bookmark, Check, ExternalLink } from 'lucide-react';
import { Post } from '../../../types';

interface PostCardProps {
  post: Post;
  onVote: (postId: string, voteType: 'up' | 'down') => void;
  onPostClick: (post: Post) => void;
}

export default function PostCard({ post, onVote, onPostClick }: PostCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowShareToast(true);
    navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`).catch(() => {});
    setTimeout(() => setShowShareToast(false), 2000);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
  };

  return (
    <article className="flex rounded-md border border-border bg-card text-card-foreground transition-all duration-150 hover:border-muted shadow-sm overflow-hidden">
      {/* Upvote/Downvote Column */}
      <div className="flex w-11 flex-col items-center bg-muted-background/30 py-2 shrink-0">
        {/* Upvote arrow */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onVote(post.id, 'up');
          }}
          className={`rounded p-0.5 transition-colors cursor-pointer ${
            post.myVote === 'up'
              ? 'text-primary bg-primary/10'
              : 'text-muted hover:bg-muted-background hover:text-foreground'
          }`}
          title="Upvote"
        >
          <ArrowBigUp className="h-6 w-6 fill-current" />
        </button>

        {/* Score count */}
        <span
          className={`my-1 text-xs font-bold ${
            post.myVote === 'up'
              ? 'text-primary'
              : post.myVote === 'down'
              ? 'text-accent'
              : 'text-foreground'
          }`}
        >
          {post.ups + (post.myVote === 'up' ? 1 : post.myVote === 'down' ? -1 : 0)}
        </span>

        {/* Downvote arrow */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onVote(post.id, 'down');
          }}
          className={`rounded p-0.5 transition-colors cursor-pointer ${
            post.myVote === 'down'
              ? 'text-accent bg-accent/10'
              : 'text-muted hover:bg-muted-background hover:text-foreground'
          }`}
          title="Downvote"
        >
          <ArrowBigDown className="h-6 w-6 fill-current" />
        </button>
      </div>

      {/* Post Content Area */}
      <div className="flex-1 p-3 flex flex-col justify-between cursor-pointer" onClick={() => onPostClick(post)}>
        <div>
          {/* Header metadata */}
          <div className="flex flex-wrap items-center gap-1 text-[11px] text-muted font-medium mb-1">
            <span className="font-bold text-foreground hover:underline">
              r/{post.subreddit}
            </span>
            <span>•</span>
            <span>Posted by u/{post.author}</span>
            <span>{post.createdAt}</span>
          </div>

          {/* Title */}
          <h2 className="text-base font-semibold leading-6 text-foreground hover:text-foreground/80 mb-2">
            {post.title}
          </h2>

          {/* Body content based on post type */}
          <div className="text-sm text-card-foreground/90 font-normal leading-relaxed mb-3">
            {post.type === 'text' && (
              <p className="line-clamp-4">{post.content}</p>
            )}

            {post.type === 'image' && (
              <div className="relative mt-2 overflow-hidden rounded-md border border-border bg-black max-h-[400px] flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.mediaUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80"}
                  alt={post.title}
                  className="max-h-[400px] w-auto object-contain hover:scale-[1.01] transition-transform duration-200"
                  loading="lazy"
                />
              </div>
            )}

            {post.type === 'link' && post.mediaUrl && (
              <a
                href={post.mediaUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="mt-2 flex items-center justify-between rounded-md border border-border bg-muted-background hover:bg-border/60 p-2 transition-colors"
              >
                <div className="flex items-center gap-2 truncate pr-2">
                  <ExternalLink className="h-4 w-4 shrink-0 text-accent" />
                  <span className="truncate text-xs font-semibold text-accent hover:underline">
                    {post.mediaUrl}
                  </span>
                </div>
                <div className="h-10 w-14 shrink-0 rounded bg-border/40 flex items-center justify-center text-[10px] text-muted font-bold">
                  LINK
                </div>
              </a>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-2 text-xs font-bold text-muted mt-1">
          {/* Comments count */}
          <button className="flex items-center gap-1.5 rounded hover:bg-muted-background px-2 py-1.5 transition-colors">
            <MessageSquare className="h-4 w-4" />
            <span>{post.commentsCount} Comments</span>
          </button>

          {/* Share button */}
          <div className="relative">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 rounded hover:bg-muted-background px-2 py-1.5 transition-colors"
            >
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </button>
            {showShareToast && (
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-foreground text-background text-[10px] font-semibold px-2 py-1 flex items-center gap-1 shadow-md">
                <Check className="h-3 w-3" />
                Copied Link!
              </span>
            )}
          </div>

          {/* Save button */}
          <button
            onClick={handleSave}
            className={`flex items-center gap-1.5 rounded hover:bg-muted-background px-2 py-1.5 transition-colors ${
              isSaved ? 'text-primary' : ''
            }`}
          >
            <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
