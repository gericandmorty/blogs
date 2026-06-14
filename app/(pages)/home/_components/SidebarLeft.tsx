'use client';

import React from 'react';
import { Home, TrendingUp, Compass, Sparkles } from 'lucide-react';
import { SubredditInfo } from '../../../types';

interface SidebarLeftProps {
  subreddits: SubredditInfo[];
  selectedSubreddit: string | null;
  onSelectSubreddit: (subredditName: string | null) => void;
}

export default function SidebarLeft({
  subreddits,
  selectedSubreddit,
  onSelectSubreddit,
}: SidebarLeftProps) {
  return (
    <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-60 shrink-0 border-r border-border bg-card p-3 overflow-y-auto text-card-foreground md:block transition-colors duration-150">
      {/* Navigation section */}
      <div className="space-y-1 pb-4 border-b border-border">
        <button
          onClick={() => onSelectSubreddit(null)}
          className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold transition-all duration-150 ${
            selectedSubreddit === null
              ? 'bg-primary/10 text-primary'
              : 'hover:bg-muted-background text-foreground'
          }`}
        >
          <Home className="h-5 w-5" />
          Home
        </button>
        <button
          onClick={() => onSelectSubreddit('popular')}
          className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold transition-all duration-150 ${
            selectedSubreddit === 'popular'
              ? 'bg-primary/10 text-primary'
              : 'hover:bg-muted-background text-foreground'
          }`}
        >
          <TrendingUp className="h-5 w-5" />
          Popular
        </button>
        <button
          onClick={() => onSelectSubreddit('all')}
          className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold transition-all duration-150 ${
            selectedSubreddit === 'all'
              ? 'bg-primary/10 text-primary'
              : 'hover:bg-muted-background text-foreground'
          }`}
        >
          <Compass className="h-5 w-5" />
          All
        </button>
      </div>

      {/* Subreddits section */}
      <div className="pt-4">
        <h2 className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted mb-2">
          Communities
        </h2>
        <div className="space-y-1">
          {subreddits.map((sub) => {
            const isSelected = selectedSubreddit === sub.name;
            return (
              <button
                key={sub.name}
                onClick={() => onSelectSubreddit(sub.name)}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold transition-all duration-150 ${
                  isSelected
                    ? 'bg-primary/10 text-primary border-r-4 border-primary'
                    : 'hover:bg-muted-background text-foreground'
                }`}
              >
                {/* Visual circle representing community logo */}
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white shadow-sm ${sub.iconColor}`}
                >
                  r/
                </div>
                <span className="truncate">{sub.displayName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer credits in left sidebar */}
      <div className="mt-8 px-3 text-[11px] text-muted space-y-2 border-t border-border pt-4">
        <p>© 2026 Reddit Lite, Inc. All rights reserved.</p>
        <p className="flex items-center gap-1">
          Made with <Sparkles className="h-3 w-3 text-yellow-500 fill-yellow-500" /> for developers
        </p>
      </div>
    </aside>
  );
}
