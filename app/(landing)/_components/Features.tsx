'use client';

import React from 'react';
import { ArrowUpCircle, MessageSquare, Search, Moon } from 'lucide-react';

export default function Features() {
  const featureList = [
    {
      icon: <ArrowUpCircle className="h-6 w-6 text-primary" />,
      title: 'Interactive Voting System',
      description: 'Upvote or downvote posts. Count dynamics update dynamically with distinct orange-red and blue brand accents.',
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-cyan-500" />,
      title: 'Recursive Comment Trees',
      description: 'Nested threads with unlimited depths. Add sub-replies inline to any parent comments, maintaining clear indentation.',
    },
    {
      icon: <Search className="h-6 w-6 text-indigo-500" />,
      title: 'Instant Search & Filtering',
      description: 'Query titles, contents, authors, or subreddits in real-time, or filter the feeds by clicking subreddit tags.',
    },
    {
      icon: <Moon className="h-6 w-6 text-purple-500" />,
      title: 'Persistent Dual Themes',
      description: 'Toggle between classic light mode and dark theme. Caches user choice automatically in localStorage.',
    },
  ];

  return (
    <section className="py-16 px-6 max-w-5xl mx-auto">
      <div className="text-center space-y-2 mb-12">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
          Built For Interactive Exploration
        </h2>
        <p className="text-sm text-muted max-w-lg mx-auto font-medium">
          Reddit Lite encapsulates core forum behaviors with premium styling and zero configuration overhead.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {featureList.map((item, idx) => (
          <div
            key={idx}
            className="flex items-start gap-4 rounded-lg border border-border bg-card p-5 text-card-foreground shadow-sm hover:border-muted transition-colors duration-150"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted-background shrink-0 shadow-inner">
              {item.icon}
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">{item.title}</h3>
              <p className="text-xs leading-5 text-muted font-medium">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
