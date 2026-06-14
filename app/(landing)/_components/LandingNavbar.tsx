'use client';

import React from 'react';
import { useTheme } from '../../components/theme-context/ThemeContext';
import { Sun, Moon, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LandingNavbar() {
  const { theme, toggleTheme, mounted } = useTheme();

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-card/85 backdrop-blur-md px-6 text-card-foreground transition-colors duration-150">
      {/* Brand logo */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
          <svg
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 fill-white"
          >
            <g>
              <path d="M17.17,9.08a2.14,2.14,0,0,0-3-.07,9.39,9.39,0,0,0-4-1L11,5.32l2.91.63a1.14,1.14,0,1,0,.21-.57l-3.21-.69a.43.43,0,0,0-.5.33l-1.07,3.3a9.71,9.71,0,0,0-4.14,1,2.15,2.15,0,0,0-3,3,2.17,2.17,0,0,0,1,2.83,9.58,9.58,0,0,0,7.92,4,9.58,9.58,0,0,0,7.92-4,2.17,2.17,0,0,0,1-2.83A2.14,2.14,0,0,0,17.17,9.08ZM6.88,12.21a1.13,1.13,0,1,1,1.13-1.13A1.13,1.13,0,0,1,6.88,12.21Zm7.22,2.78a5.53,5.53,0,0,1-8.2,0,.43.43,0,0,1,.6-.61,4.68,4.68,0,0,0,7,0,.43.43,0,1,1,.6.61Zm-.45-2.78a1.13,1.13,0,1,1,1.13-1.13A1.13,1.13,0,0,1,13.65,12.21Z" />
            </g>
          </svg>
        </div>
        <span className="text-xl font-bold tracking-tight">
          <span className="text-foreground">reddit</span>
          <span className="text-primary font-black">lite</span>
        </span>
      </div>

      {/* Nav Actions */}
      <div className="flex items-center gap-4">
        {/* Toggle Theme Button */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted-background transition-colors duration-150 text-foreground/80 hover:text-foreground"
        >
          {mounted && theme === 'dark' ? (
            <Sun className="h-5 w-5 text-yellow-400" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>

        {/* Enter App Call to Action */}
        <Link
          href="/pages/home"
          className="flex items-center gap-1.5 rounded-full bg-primary hover:bg-primary-hover px-4 py-2 text-sm font-bold text-white transition-all duration-150 hover:shadow-md"
        >
          <span>Enter App</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </header>
  );
}
