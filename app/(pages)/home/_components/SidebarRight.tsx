'use client';

import React from 'react';
import { Calendar, Users, Eye, Sparkles, AlertCircle } from 'lucide-react';
import { SubredditInfo } from '../../../types';

interface SidebarRightProps {
  currentSubredditInfo: SubredditInfo | null;
  subreddits: SubredditInfo[];
  onSelectSubreddit: (subredditName: string | null) => void;
  onCreatePostClick: () => void;
}

export default function SidebarRight({
  currentSubredditInfo,
  subreddits,
  onSelectSubreddit,
  onCreatePostClick,
}: SidebarRightProps) {
  // If no specific subreddit is selected, render a default "About Home" layout
  const info = currentSubredditInfo || {
    name: 'home',
    displayName: 'Home Feed',
    description: 'Your personal Reddit Lite frontpage. Come here to check in with your favorite communities and keep up with what matters to you.',
    subscribers: '10.5m members',
    online: '42.3k active',
    iconColor: 'bg-primary',
    createdDate: 'Created Jun 14, 2026',
  };

  return (
    <aside className="hidden w-80 shrink-0 space-y-4 p-4 lg:block transition-colors duration-150">
      {/* Community Detail Card */}
      <div className="rounded-lg border border-border bg-card overflow-hidden text-card-foreground shadow-sm">
        {/* Banner area */}
        <div className={`h-12 ${info.iconColor} opacity-70`} />
        
        {/* Content area */}
        <div className="p-4 relative">
          {/* Avatar overlay */}
          <div className={`absolute -top-7 left-4 flex h-12 w-12 items-center justify-center rounded-full text-base font-bold text-white border-4 border-card shadow-md ${info.iconColor}`}>
            r/
          </div>
          
          <div className="pt-6">
            <h2 className="text-base font-bold text-foreground">{info.displayName}</h2>
            <p className="mt-2 text-xs leading-5 text-card-foreground/85">{info.description}</p>
          </div>

          {/* Stats info */}
          <div className="mt-4 grid grid-cols-2 gap-4 border-t border-border pt-4 text-xs">
            <div>
              <p className="flex items-center gap-1 font-bold text-foreground">
                <Users className="h-4 w-4 text-muted" />
                {info.subscribers.split(' ')[0]}
              </p>
              <p className="text-[10px] text-muted font-semibold">Members</p>
            </div>
            <div>
              <p className="flex items-center gap-1 font-bold text-green-500">
                <Eye className="h-4 w-4 text-green-500" />
                {info.online.split(' ')[0]}
              </p>
              <p className="text-[10px] text-muted font-semibold">Online</p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 border-t border-border pt-4 text-xs text-muted font-medium">
            <Calendar className="h-4 w-4" />
            <span>{info.createdDate}</span>
          </div>

          {/* Create Post trigger button */}
          <button
            onClick={onCreatePostClick}
            className="mt-4 w-full rounded-full border border-primary text-primary hover:bg-primary hover:text-white px-4 py-2 text-xs font-bold transition-all duration-150 shadow-sm cursor-pointer"
          >
            Create Post
          </button>
        </div>
      </div>

      {/* Community Rules Card */}
      <div className="rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-3 flex items-center gap-1.5">
          <AlertCircle className="h-4 w-4 text-primary" />
          Community Rules
        </h3>
        <ol className="divide-y divide-border text-xs font-medium">
          <li className="py-2.5">
            <span className="text-muted mr-1.5">1.</span>
            Be respectful and civil to others.
          </li>
          <li className="py-2.5">
            <span className="text-muted mr-1.5">2.</span>
            Ensure post content is relevant to the subreddit topic.
          </li>
          <li className="py-2.5">
            <span className="text-muted mr-1.5">3.</span>
            No spamming, advertising, or self-promotion.
          </li>
          <li className="py-2.5">
            <span className="text-muted mr-1.5">4.</span>
            Use clear and descriptive titles.
          </li>
        </ol>
      </div>

      {/* Trending / Recommended communities */}
      <div className="rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-3 flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-yellow-500" />
          Top Communities
        </h3>
        <div className="space-y-3">
          {subreddits.slice(0, 4).map((sub, idx) => (
            <div key={sub.name} className="flex items-center justify-between">
              <button
                onClick={() => onSelectSubreddit(sub.name)}
                className="flex items-center gap-2 text-xs font-bold text-foreground hover:underline text-left truncate"
              >
                <span className="text-muted font-medium w-3">{idx + 1}</span>
                <span className={`h-5 w-5 rounded-full ${sub.iconColor} flex items-center justify-center text-[8px] font-black text-white shrink-0`}>
                  r/
                </span>
                <span className="truncate">{sub.displayName}</span>
              </button>
              <button
                onClick={() => onSelectSubreddit(sub.name)}
                className="rounded-full bg-muted-background hover:bg-border px-3 py-1 text-[11px] font-bold text-foreground transition-colors"
              >
                View
              </button>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
