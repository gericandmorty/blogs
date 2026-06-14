'use client';

import React from 'react';
import { Heart } from 'lucide-react';

export default function LandingFooter() {
  return (
    <footer className="border-t border-border bg-card py-8 px-6 text-center text-card-foreground text-xs font-medium mt-auto transition-colors duration-150">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-muted">
          © 2026 Reddit Lite. Built as an interactive Next.js portfolio project.
        </p>
        <p className="flex items-center gap-1 text-muted">
          Made with <Heart className="h-3.5 w-3.5 text-primary fill-primary" /> using Next.js App Router & Tailwind CSS v4.
        </p>
      </div>
    </footer>
  );
}
