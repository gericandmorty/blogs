'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from './theme-context/ThemeContext';
import {
  Sun,
  Moon,
  Menu,
  X,
  ChevronDown,
  Terminal,
  Monitor,
  Code2,
  Home,
  Search,
} from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home', href: '/', icon: <Home className="h-4 w-4" /> },
];

const OS_LINKS = [
  {
    label: 'Linux',
    href: '/os/linux',
    icon: <Terminal className="h-4 w-4" />,
    description: 'Commands, tips & tricks',
    tagClass: 'tag-linux',
  },
  {
    label: 'Windows',
    href: '/os/windows',
    icon: <Monitor className="h-4 w-4" />,
    description: 'Setup, tools & guides',
    tagClass: 'tag-windows',
  },
];

export default function Navbar({
  searchQuery = '',
  setSearchQuery,
  showSearch = false,
}: {
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
  showSearch?: boolean;
}) {
  const { theme, toggleTheme, mounted } = useTheme();
  const pathname = usePathname();
  const [osOpen, setOsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const osRef = useRef<HTMLDivElement>(null);

  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Sync local search when parent query changes (e.g. cleared)
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  // Debounce search update to parent component
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== searchQuery) {
        setSearchQuery?.(localSearch);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearch, setSearchQuery, searchQuery]);

  // Close OS dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (osRef.current && !osRef.current.contains(e.target as Node)) {
        setOsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setOsOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const linkClass = (href: string) =>
    `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
      isActive(href)
        ? 'bg-primary/10 text-primary'
        : 'text-foreground/70 hover:text-foreground hover:bg-muted-background'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-5xl mx-auto px-4 flex h-14 items-center justify-between gap-4">

        {/* ── Logo ── */}
        <Link
          href="/"
          className="flex items-center gap-1.5 shrink-0 hover:opacity-90 transition-opacity"
        >
          <span className="text-base font-bold tracking-tight">
            <span className="text-foreground">dev</span>
            <span className="gradient-text">journal</span>
          </span>
        </Link>

        {/* ── Desktop Nav ── */}
        <nav className="hidden md:flex items-center gap-1">

          {/* Home */}
          <Link href="/" className={linkClass('/')}>
            <Home className="h-4 w-4" />
            Home
          </Link>

          {/* OS Dropdown */}
          <div className="relative" ref={osRef}>
            <button
              id="os-dropdown-btn"
              onClick={() => setOsOpen((v) => !v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive('/os')
                  ? 'bg-primary/10 text-primary'
                  : 'text-foreground/70 hover:text-foreground hover:bg-muted-background'
              }`}
            >
              <Monitor className="h-4 w-4" />
              OS
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${osOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Dropdown panel */}
            {osOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-56 rounded-xl border border-border bg-card shadow-xl shadow-black/10 p-1.5 animate-fade-in-up">
                {OS_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted-background group ${
                      isActive(link.href) ? 'bg-primary/5' : ''
                    }`}
                    onClick={() => setOsOpen(false)}
                  >
                    <span className={`mt-0.5 flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold ${link.tagClass}`}>
                      {link.icon}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                        {link.label}
                      </p>
                      <p className="text-xs text-muted">{link.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Coding */}
          <Link href="/coding" className={linkClass('/coding')}>
            <Code2 className="h-4 w-4" />
            Coding
          </Link>
        </nav>

        {/* ── Right side actions ── */}
        <div className="flex items-center gap-2">
          {/* Inline search (only on pages that pass showSearch) */}
          {showSearch && (
            <div
              className={`hidden sm:flex items-center gap-2 rounded-lg border px-3 py-1.5 transition-all duration-150 ${
                searchFocused
                  ? 'border-primary bg-card w-52'
                  : 'border-border bg-muted-background w-36 hover:w-44'
              }`}
            >
              <Search className="h-4 w-4 text-muted shrink-0" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="Search…"
                className="w-full bg-transparent text-sm focus:outline-none placeholder-muted text-foreground"
              />
              {localSearch && (
                <button
                  onClick={() => {
                    setLocalSearch('');
                    setSearchQuery?.('');
                  }}
                  className="text-muted hover:text-foreground text-xs cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          )}

          {/* Theme toggle */}
          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted-background transition-colors text-foreground/70 hover:text-foreground cursor-pointer"
          >
            {mounted && theme === 'dark' ? (
              <Sun className="h-4.5 w-4.5 text-yellow-400" />
            ) : (
              <Moon className="h-4.5 w-4.5" />
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            id="mobile-menu-btn"
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted-background transition-colors md:hidden cursor-pointer"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 py-3 space-y-1 animate-fade-in-up">
          {/* Search on mobile */}
          {showSearch && (
            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted-background px-3 py-2 mb-2">
              <Search className="h-4 w-4 text-muted shrink-0" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search posts…"
                className="w-full bg-transparent text-sm focus:outline-none placeholder-muted"
              />
            </div>
          )}

          <Link href="/" className={`${linkClass('/')} w-full`}>
            <Home className="h-4 w-4" />
            Home
          </Link>

          {/* OS section header */}
          <div className="pt-1 pb-0.5">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted">
              Operating System
            </p>
          </div>
          {OS_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={`${linkClass(link.href)} w-full`}>
              {link.icon}
              {link.label}
            </Link>
          ))}

          {/* Coding */}
          <div className="pt-1 pb-0.5">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted">
              Development
            </p>
          </div>
          <Link href="/coding" className={`${linkClass('/coding')} w-full`}>
            <Code2 className="h-4 w-4" />
            Coding
          </Link>
        </div>
      )}
    </header>
  );
}
