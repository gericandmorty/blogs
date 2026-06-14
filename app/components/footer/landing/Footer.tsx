'use client';

import React from 'react';
import { Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card py-8 px-6 text-center text-card-foreground text-xs font-medium mt-auto transition-colors duration-150">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Left side copyright */}
        <div className="space-y-1 text-center sm:text-left">
          <p className="text-sm font-bold tracking-tight text-foreground">
            The <span className="text-primary font-black uppercase tracking-wide">Blogs</span>
          </p>
          <p className="text-muted text-[11px]">
            © 2026 The Blogs. Replica built with Next.js App Router & Tailwind CSS v4.
          </p>
        </div>

        {/* Right side portfolio / creator details */}
        <div className="flex flex-col sm:flex-row items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-foreground">
            <span>Created by</span>
            <span className="bg-primary/10 border border-primary/20 rounded-full px-2.5 py-0.5 text-primary text-[11px] font-bold">
              Geric Morit
            </span>
          </div>

          <div className="flex items-center gap-4 sm:border-l sm:border-border sm:pl-4">
            {/* Github Link */}
            <a
              href="https://github.com/gericandmorty"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-muted hover:text-foreground transition-colors"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
              <span>gericandmorty</span>
            </a>

            {/* Portfolio Link */}
            <a
              href="https://www.gericandmorty.codes"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-muted hover:text-primary transition-colors font-bold"
            >
              <Globe className="h-4 w-4" />
              <span>Portfolio</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
