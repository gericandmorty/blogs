'use client';

import React from 'react';
import { Sparkles, ArrowRight, MessageSquare, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-20 px-6 text-center bg-radial from-primary/10 via-transparent to-transparent">
      {/* Decorative Blur bubbles */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Cute micro-badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-bold text-primary animate-pulse">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Next.js + Tailwind CSS v4 Replica</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-foreground">
          Dive into anything on <br />
          <span className="bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
            Reddit Lite
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg leading-relaxed text-muted font-medium">
          Experience a high-fidelity community feed replica equipped with class-based light/dark modes, fully recursive comment trees, upvote dynamics, and instantaneous community filtering.
        </p>

        {/* CTA Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            href="/pages/home"
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-primary hover:bg-primary-hover px-8 py-3.5 text-base font-bold text-white transition-all duration-150 hover:scale-[1.02] shadow-lg shadow-primary/20"
          >
            <span>Launch Dashboard</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="/pages/home"
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full border border-border bg-card hover:bg-muted-background px-8 py-3.5 text-base font-bold text-foreground transition-all duration-150 hover:scale-[1.02]"
          >
            <span>Explore Communities</span>
          </Link>
        </div>

        {/* Tiny feature flags */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-10 text-xs text-muted font-semibold">
          <span className="flex items-center gap-1.5">
            <MessageSquare className="h-4 w-4 text-primary" />
            Infinite comment nesting
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-green-500" />
            No login required to try
          </span>
        </div>
      </div>
    </section>
  );
}
