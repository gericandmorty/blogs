'use client';

import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function SearchBar({ searchQuery, setSearchQuery }: SearchBarProps) {
  return (
    <div className="mx-4 flex max-w-2xl flex-1 items-center rounded-full bg-muted-background border border-transparent focus-within:border-border focus-within:bg-card px-4 py-1.5 transition-all duration-150">
      <Search className="h-5 w-5 text-muted mr-2 shrink-0" />
      <input
        type="text"
        placeholder="Search Reddit Lite"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full bg-transparent text-sm focus:outline-none placeholder-muted text-foreground"
      />
      {searchQuery && (
        <button 
          onClick={() => setSearchQuery('')}
          className="text-xs text-muted hover:text-foreground font-semibold px-1 cursor-pointer"
        >
          Clear
        </button>
      )}
    </div>
  );
}
