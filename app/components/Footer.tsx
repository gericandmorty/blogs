'use client';

import React from 'react';
import Link from 'next/link';
import { Terminal, Code2, Monitor } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card text-card-foreground transition-colors duration-200 mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-8">

          {/* Brand */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icons/icon.png" alt="Code & Thoughts logo" className="h-5 w-5 rounded-md object-contain" />
              <span className="text-base font-bold">
                <span className="text-foreground">Code</span>
                <span className="gradient-text"> & Thoughts</span>
              </span>
            </div>
            <p className="text-xs text-muted leading-relaxed max-w-xs">
              Personal documentation of life as a developer — notes, guides,
              and lessons from the terminal and beyond.
            </p>
          </div>

          {/* Sections nav */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted">Sections</h3>
            <ul className="space-y-1.5">
              <li>
                <Link href="/" className="flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-colors">
                  <span className="text-muted">→</span> Home
                </Link>
              </li>
              <li>
                <Link href="/os/linux" className="flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-colors">
                  <Terminal className="h-3.5 w-3.5 text-[var(--tag-linux)]" /> Linux
                </Link>
              </li>
              <li>
                <Link href="/os/windows" className="flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-colors">
                  <Monitor className="h-3.5 w-3.5 text-[var(--tag-windows)]" /> Windows
                </Link>
              </li>
              <li>
                <Link href="/coding" className="flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-colors">
                  <Code2 className="h-3.5 w-3.5 text-[var(--tag-coding)]" /> Coding
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-5 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted">
          <p>© {year} Geric Morit. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
