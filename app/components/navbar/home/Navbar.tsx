'use client';

import React from 'react';
import Logo from '../Logo';
import SearchBar from '../SearchBar';
import { useTheme } from '../../theme-context/ThemeContext';
import { Plus, Bell, MessageSquare, Sun, Moon } from 'lucide-react';

interface HomeNavbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onCreatePostClick: () => void;
}

export default function HomeNavbar({
  searchQuery,
  setSearchQuery,
  onCreatePostClick,
}: HomeNavbarProps) {
  const { theme, toggleTheme, mounted } = useTheme();

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-card px-4 text-card-foreground transition-colors duration-150 shadow-sm">
      {/* Brand logo sub-component */}
      <Logo />

      {/* Search bar sub-component */}
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* User actions section */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Toggle Theme Button */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted-background transition-colors duration-150 text-foreground/80 hover:text-foreground cursor-pointer"
        >
          {mounted && theme === 'dark' ? (
            <Sun className="h-5 w-5 text-yellow-400" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>

        {/* Create Post Button */}
        <button
          onClick={onCreatePostClick}
          className="flex items-center gap-1 rounded-full bg-primary hover:bg-primary-hover px-3 py-1.5 text-sm font-semibold text-white transition-colors duration-150 shadow-sm cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Create Post</span>
        </button>

        {/* Notifications and Chat Mock Icons */}
        <button className="hidden h-9 w-9 items-center justify-center rounded-full hover:bg-muted-background transition-colors duration-150 text-muted hover:text-foreground md:flex cursor-pointer">
          <MessageSquare className="h-5 w-5" />
        </button>
        
        <button className="hidden h-9 w-9 items-center justify-center rounded-full hover:bg-muted-background transition-colors duration-150 text-muted hover:text-foreground md:flex relative cursor-pointer">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
        </button>

        {/* User Profile Avatar block */}
        <div className="flex items-center gap-2 border-l border-border pl-2 sm:pl-3">
          <div className="relative h-8 w-8 overflow-hidden rounded-full border border-border bg-orange-200">
            <svg
              className="absolute -bottom-1 left-1/2 h-8 w-8 -translate-x-1/2 fill-orange-600 text-orange-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
            <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 border border-card" />
          </div>
          <div className="hidden text-left sm:block">
            <p className="text-xs font-semibold leading-3">u/coder_reddit</p>
            <p className="text-[10px] text-muted leading-3 font-medium">1.5k karma</p>
          </div>
        </div>
      </div>
    </header>
  );
}
