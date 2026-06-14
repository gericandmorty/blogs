'use client';

import React from 'react';
import Logo from '../Logo';
import { useTheme } from '../../theme-context/ThemeContext';
import { Sun, Moon, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LandingNavbar() {
  const { theme, toggleTheme, mounted } = useTheme();

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-card/85 backdrop-blur-md px-6 text-card-foreground transition-colors duration-150">
      {/* Brand logo */}
      <Logo />

      {/* Nav Actions */}
      <div className="flex items-center gap-4">
        {/* Toggle Theme Button */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted-background transition-colors duration-150 text-foreground/80 hover:text-foreground cursor-pointer"
        >
          {mounted && theme === 'dark' ? (
            <Sun className="h-5 w-5 text-yellow-400" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>

        {/* Enter App Call to Action */}
        <Link
          href="/home"
          className="flex items-center gap-1.5 rounded-full bg-primary hover:bg-primary-hover px-4 py-2 text-sm font-bold text-white transition-all duration-150 hover:shadow-md"
        >
          <span>Enter App</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </header>
  );
}
