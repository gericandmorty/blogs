'use client';

import React, { useState } from 'react';
import { X, FileText, Image, Link as LinkIcon } from 'lucide-react';
import { SubredditInfo, Post } from '../../../types';

interface CreatePostModalProps {
  subreddits: SubredditInfo[];
  defaultSubreddit: string | null;
  onClose: () => void;
  onSubmit: (newPost: Omit<Post, 'id' | 'ups' | 'commentsCount' | 'comments' | 'myVote' | 'createdAt'>) => void;
}

type PostTab = 'text' | 'image' | 'link';

export default function CreatePostModal({
  subreddits,
  defaultSubreddit,
  onClose,
  onSubmit,
}: CreatePostModalProps) {
  const [activeTab, setActiveTab] = useState<PostTab>('text');
  const [selectedSubreddit, setSelectedSubreddit] = useState(
    defaultSubreddit && defaultSubreddit !== 'all' && defaultSubreddit !== 'popular'
      ? defaultSubreddit
      : subreddits[0]?.name || ''
  );
  const [title, setTitle] = useState('');
  const [textContent, setTextContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedSubreddit) {
      setError('Please choose a community.');
      return;
    }
    if (!title.trim()) {
      setError('A title is required.');
      return;
    }
    if (activeTab === 'image' && !mediaUrl.trim()) {
      setError('An image URL is required.');
      return;
    }
    if (activeTab === 'link' && !mediaUrl.trim()) {
      setError('A link URL is required.');
      return;
    }

    onSubmit({
      title: title.trim(),
      content: activeTab === 'text' ? textContent.trim() : '',
      type: activeTab,
      mediaUrl: activeTab !== 'text' ? mediaUrl.trim() : undefined,
      subreddit: selectedSubreddit,
      author: 'coder_reddit', // Mock author
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 transition-opacity duration-200">
      {/* Modal Card */}
      <div className="w-full max-w-xl rounded-lg border border-border bg-card text-card-foreground shadow-xl transition-all duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="text-base font-bold text-foreground">Create a Post</h2>
          <button
            onClick={onClose}
            className="rounded hover:bg-muted-background p-1 text-muted hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="rounded bg-red-500/10 border border-red-500/30 p-2.5 text-xs text-red-500 font-semibold">
              {error}
            </div>
          )}

          {/* Subreddit dropdown */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
              Choose a community
            </label>
            <select
              value={selectedSubreddit}
              onChange={(e) => setSelectedSubreddit(e.target.value)}
              className="w-full rounded border border-border bg-muted-background focus:bg-card px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
            >
              {subreddits.map((sub) => (
                <option key={sub.name} value={sub.name}>
                  r/{sub.name}
                </option>
              ))}
            </select>
          </div>

          {/* Post Tabs */}
          <div className="flex border-b border-border">
            <button
              type="button"
              onClick={() => {
                setActiveTab('text');
                setError('');
              }}
              className={`flex flex-1 items-center justify-center gap-2 border-b-2 py-3 text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'text'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted hover:bg-muted-background hover:text-foreground'
              }`}
            >
              <FileText className="h-4 w-4" />
              Post
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('image');
                setError('');
              }}
              className={`flex flex-1 items-center justify-center gap-2 border-b-2 py-3 text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'image'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted hover:bg-muted-background hover:text-foreground'
              }`}
            >
              <Image className="h-4 w-4" />
              Images
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('link');
                setError('');
              }}
              className={`flex flex-1 items-center justify-center gap-2 border-b-2 py-3 text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'link'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted hover:bg-muted-background hover:text-foreground'
              }`}
            >
              <LinkIcon className="h-4 w-4" />
              Link
            </button>
          </div>

          {/* Form input fields */}
          <div className="space-y-3">
            {/* Title */}
            <input
              type="text"
              placeholder="Title (required)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              className="w-full rounded border border-border bg-transparent focus:bg-card px-3 py-2 text-sm focus:outline-none focus:border-primary placeholder-muted transition-colors font-semibold"
            />

            {/* Content box depending on Active Tab */}
            {activeTab === 'text' && (
              <textarea
                placeholder="Text (optional)"
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                rows={5}
                className="w-full rounded border border-border bg-transparent focus:bg-card px-3 py-2 text-sm focus:outline-none focus:border-primary placeholder-muted transition-colors resize-none"
              />
            )}

            {activeTab === 'image' && (
              <input
                type="url"
                placeholder="Paste Image URL (e.g. https://images.unsplash.com/...)"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                className="w-full rounded border border-border bg-transparent focus:bg-card px-3 py-2 text-sm focus:outline-none focus:border-primary placeholder-muted transition-colors"
              />
            )}

            {activeTab === 'link' && (
              <input
                type="url"
                placeholder="Paste Link URL (e.g. https://react.dev)"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                className="w-full rounded border border-border bg-transparent focus:bg-card px-3 py-2 text-sm focus:outline-none focus:border-primary placeholder-muted transition-colors"
              />
            )}
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-border hover:bg-muted-background px-4 py-1.5 text-xs font-bold text-foreground transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full bg-primary hover:bg-primary-hover px-4 py-1.5 text-xs font-bold text-white transition-colors cursor-pointer shadow-sm"
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
