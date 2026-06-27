'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Eye,
  FileText,
  AlertCircle,
  Home,
  CheckCircle,
  Clock,
  Tag,
  BookOpen,
  Upload,
  MessageSquare,
  LogOut,
  Bold,
  Italic,
  Heading,
  Code,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { fetchAllPosts, updatePost, createPost, deletePost, uploadImage, deleteCommentFromPost, deleteReplyFromComment } from '../data';
import { BlogPost, Category } from '../types';

interface EditPostsClientProps {
  jwtToken?: string;
}

export default function EditPostsClient({ jwtToken }: EditPostsClientProps = {}) {
  const router = useRouter();
  const params = useParams();
  const authHash = jwtToken || (params ? decodeURIComponent(params.hash as string) : undefined);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertMarkdown = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selection = textarea.value.substring(start, end);
    const replacement = prefix + selection + suffix;

    const newValue = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
    setEditContent(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selection.length);
    }, 0);
  };

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Editor states
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const [editExcerpt, setEditExcerpt] = useState('');
  const [editCategory, setEditCategory] = useState<Category>('linux');
  const [editTags, setEditTags] = useState('');
  const [editReadTime, setEditReadTime] = useState(5);
  const [editCoverImage, setEditCoverImage] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editIsFeatured, setEditIsFeatured] = useState(false);
  const [editIsPublic, setEditIsPublic] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [managingCommentsPost, setManagingCommentsPost] = useState<BlogPost | null>(null);

  // Active view tab in editor (edit vs preview)
  const [editorTab, setEditorTab] = useState<'edit' | 'preview' | 'split'>('split');

  // Admin filter states
  const [filterCategory, setFilterCategory] = useState<Category | 'all'>('all');
  const [filterFeatured, setFilterFeatured] = useState<'all' | 'featured' | 'standard'>('all');
  const [adminSearchQuery, setAdminSearchQuery] = useState('');

  // Filtered posts for admin list view
  const filteredAdminPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory =
        filterCategory === 'all' || post.category === filterCategory;

      const matchesFeatured =
        filterFeatured === 'all' ||
        (filterFeatured === 'featured' && post.isFeatured) ||
        (filterFeatured === 'standard' && !post.isFeatured);

      const q = adminSearchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.tags.some((t) => t.toLowerCase().includes(q));

      return matchesCategory && matchesFeatured && matchesSearch;
    });
  }, [posts, filterCategory, filterFeatured, adminSearchQuery]);

  const handleApiError = (err: any, defaultMsg: string) => {
    console.error(err);
    if (err.status === 401) {
      localStorage.removeItem('admin_jwt');
      setError('Session expired or unauthorized. Logging you out...');
      setTimeout(() => {
        router.push('/admin/login');
      }, 2000);
    } else {
      setError(err.message || defaultMsg);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('admin_jwt');
    router.push('/admin/login');
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await fetchAllPosts(authHash);
      setPosts(data);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch posts from the backend. Make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => {
      setSuccessMsg(null);
    }, 3000);
  };

  const handleEditClick = (post: BlogPost) => {
    setEditingPost(post);
    setIsCreating(false);
    setEditTitle(post.title);
    setEditSlug(post.slug);
    setEditExcerpt(post.excerpt);
    setEditCategory(post.category);
    setEditTags(post.tags.join(', '));
    setEditReadTime(post.readTimeMinutes);
    setEditCoverImage(post.coverImageUrl || '');
    setEditContent(post.content);
    setEditIsFeatured(post.isFeatured || false);
    setEditIsPublic(post.isPublic !== false);
    setPendingImageFile(null);
    setEditorTab('split');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreateClick = () => {
    setEditingPost(null);
    setIsCreating(true);
    setEditTitle('');
    setEditSlug('');
    setEditExcerpt('');
    setEditCategory('linux');
    setEditTags('');
    setEditReadTime(5);
    setEditCoverImage('');
    setEditContent('');
    setEditIsFeatured(false);
    setEditIsPublic(true);
    setPendingImageFile(null);
    setEditorTab('split');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTitleChange = (title: string) => {
    setEditTitle(title);
    // Generate clean slug automatically
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-');
    setEditSlug(slug);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle || !editSlug || !editContent || !editExcerpt) {
      setError('Please fill in all required fields (Title, Slug, Excerpt, Content).');
      return;
    }

    let finalCoverUrl = editCoverImage;

    if (pendingImageFile) {
      try {
        setUploading(true);
        setError(null);
        showToast('Uploading cover image to Cloudinary...');
        const res = await uploadImage(pendingImageFile, authHash);
        finalCoverUrl = res.url;
        setEditCoverImage(res.url);
        setPendingImageFile(null);
      } catch (err: any) {
        handleApiError(err, 'Failed to upload image to Cloudinary');
        setUploading(false);
        return;
      }
    }

    const payload = {
      title: editTitle,
      slug: editSlug,
      excerpt: editExcerpt,
      category: editCategory,
      tags: editTags.split(',').map((t) => t.trim()).filter(Boolean),
      readTimeMinutes: Number(editReadTime),
      coverImageUrl: finalCoverUrl || undefined,
      content: editContent,
      isFeatured: editIsFeatured,
      isPublic: editIsPublic,
    };

    try {
      if (isCreating) {
        // Create new post on backend
        await createPost({
          ...payload,
          comments: [],
        }, authHash);
        showToast('Post created successfully!');
      } else if (editingPost) {
        // Update existing post
        await updatePost(editingPost.id, payload, authHash);
        showToast('Post updated successfully!');
      }

      setIsCreating(false);
      setEditingPost(null);
      setError(null);
      loadPosts();
    } catch (err: any) {
      handleApiError(err, 'Failed to save post to the database');
    }
  };

  const handleDelete = async (postId: string, title: string) => {
    if (!confirm(`Are you absolutely sure you want to delete "${title}"?`)) {
      return;
    }
    try {
      await deletePost(postId, authHash);
      showToast('Post deleted successfully.');
      loadPosts();
    } catch (err: any) {
      handleApiError(err, 'Failed to delete post');
    }
  };

  const cancelEdit = () => {
    setIsCreating(false);
    setEditingPost(null);
    setError(null);
    setPendingImageFile(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPendingImageFile(file);
    const localUrl = URL.createObjectURL(file);
    setEditCoverImage(localUrl);
  };

  const handleDeleteComment = async (postId: string, commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }
    try {
      setUploading(true);
      setError(null);
      await deleteCommentFromPost(postId, commentId, authHash);

      // Update parent list
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              comments: post.comments.filter((c) => c.id !== commentId),
            };
          }
          return post;
        })
      );

      // Update current modal detail
      if (managingCommentsPost && managingCommentsPost.id === postId) {
        setManagingCommentsPost((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            comments: prev.comments.filter((c) => c.id !== commentId),
          };
        });
      }

      showToast('Comment deleted successfully.');
    } catch (err: any) {
      handleApiError(err, 'Failed to delete comment');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteReply = async (postId: string, commentId: string, replyId: string) => {
    if (!confirm('Are you sure you want to delete this reply?')) {
      return;
    }
    try {
      setUploading(true);
      setError(null);
      await deleteReplyFromComment(postId, commentId, replyId, authHash);

      // Update parent list
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              comments: post.comments.map((c) => {
                if (c.id === commentId && c.replies) {
                  return {
                    ...c,
                    replies: c.replies.filter((r) => r.id !== replyId),
                  };
                }
                return c;
              }),
            };
          }
          return post;
        })
      );

      // Update current modal detail
      if (managingCommentsPost && managingCommentsPost.id === postId) {
        setManagingCommentsPost((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            comments: prev.comments.map((c) => {
              if (c.id === commentId && c.replies) {
                return {
                  ...c,
                  replies: c.replies.filter((r) => r.id !== replyId),
                };
              }
              return c;
            }),
          };
        });
      }

      showToast('Reply deleted successfully.');
    } catch (err: any) {
      handleApiError(err, 'Failed to delete reply');
    } finally {
      setUploading(false);
    }
  };

  // Simple Markdown Renderer matching post page styling
  const renderMarkdown = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let i = 0;
    let key = 0;

    const renderInline = (text: string): React.ReactNode => {
      const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
      return parts.map((part, idx) => {
        if (part.startsWith('`') && part.endsWith('`')) {
          return <code key={idx} className="code-inline">{part.slice(1, -1)}</code>;
        }
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={idx} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
        }
        return part;
      });
    };

    while (i < lines.length) {
      const line = lines[i];

      if (line.startsWith('## ')) {
        elements.push(
          <h2 key={key++} className="text-xl font-bold text-foreground mt-6 mb-2 pb-1 border-b border-border">
            {line.slice(3)}
          </h2>
        );
        i++;
      } else if (line.startsWith('### ')) {
        elements.push(
          <h3 key={key++} className="text-base font-bold text-foreground mt-4 mb-1">
            {line.slice(4)}
          </h3>
        );
        i++;
      } else if (line.startsWith('```')) {
        const lang = line.slice(3).trim();
        const codeLines: string[] = [];
        i++;
        while (i < lines.length && !lines[i].startsWith('```')) {
          codeLines.push(lines[i]);
          i++;
        }
        i++;
        elements.push(
          <div key={key++} className="relative my-3">
            {lang && (
              <div className="flex items-center gap-2 rounded-t-lg border border-border border-b-0 bg-muted-background px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-muted">
                {lang}
              </div>
            )}
            <pre className="overflow-x-auto rounded-lg bg-[var(--code-bg)] border border-border p-3 text-xs leading-relaxed text-secondary font-mono">
              <code>{codeLines.join('\n')}</code>
            </pre>
          </div>
        );
      } else if (line.startsWith('- ')) {
        elements.push(
          <li key={key++} className="text-sm text-foreground/85 leading-relaxed ml-4 list-disc mb-1">
            {renderInline(line.slice(2))}
          </li>
        );
        i++;
      } else if (line.trim() === '') {
        elements.push(<div key={key++} className="h-2" />);
        i++;
      } else {
        elements.push(
          <p key={key++} className="text-sm leading-6 text-foreground/85">
            {renderInline(line)}
          </p>
        );
        i++;
      }
    }

    return <div className="space-y-2">{elements}</div>;
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 space-y-6">
        {/* Alerts and Toast */}
        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 flex gap-3 text-red-500 text-sm items-center">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {successMsg && (
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 flex gap-3 text-emerald-400 text-sm items-center animate-fade-in-up">
            <CheckCircle className="h-5 w-5 shrink-0" />
            <p className="font-medium">{successMsg}</p>
          </div>
        )}

        {/* Dashboard Title Header */}
        <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-border">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Admin Console</h1>
            <p className="text-xs text-muted mt-1">Manage, create, and edit blog posts dynamically</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-xs font-bold transition-all hover:bg-muted-background cursor-pointer"
            >
              <Home className="h-3.5 w-3.5" /> View Site
            </button>
            {jwtToken && (
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-xs font-bold text-red-500 transition-all hover:bg-red-500/5 cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" /> Sign Out
              </button>
            )}
            {!isCreating && !editingPost && (
              <button
                onClick={handleCreateClick}
                className="flex items-center gap-1.5 rounded-full bg-primary hover:bg-primary-hover px-4 py-2 text-xs font-bold text-white transition-all shadow-sm cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" /> New Post
              </button>
            )}
          </div>
        </section>

        {/* Editor Mode Form */}
        {(isCreating || editingPost) && (
          <section className="rounded-xl border border-border bg-card overflow-hidden shadow-md animate-fade-in-up">
            <div className="flex items-center justify-between border-b border-border bg-muted-background px-5 py-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-foreground">
                {isCreating ? 'Creating New Post' : `Editing: ${editingPost?.title}`}
              </span>
              <button onClick={cancelEdit} className="text-muted hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted uppercase">Post Title *</label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. My Awesome Setup Distro"
                    className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted uppercase">URL Slug (Auto-generated) *</label>
                  <input
                    type="text"
                    required
                    value={editSlug}
                    onChange={(e) => setEditSlug(e.target.value)}
                    placeholder="my-awesome-setup-distro"
                    className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted uppercase">Category *</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as Category)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
                  >
                    <option value="linux">Linux</option>
                    <option value="windows">Windows</option>
                    <option value="coding">Coding (General)</option>
                    <option value="languages">Languages</option>
                    <option value="databases">Databases</option>
                    <option value="framework">Framework</option>
                    <option value="general">General</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted uppercase">Read Time (minutes)</label>
                  <input
                    type="number"
                    min={1}
                    value={editReadTime}
                    onChange={(e) => setEditReadTime(Number(e.target.value))}
                    className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted uppercase">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={editTags}
                    onChange={(e) => setEditTags(e.target.value)}
                    placeholder="linux, setup, zsh"
                    className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 py-1">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={editIsFeatured}
                    onChange={(e) => setEditIsFeatured(e.target.checked)}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-background bg-transparent cursor-pointer"
                  />
                  <label htmlFor="isFeatured" className="text-sm font-semibold text-foreground cursor-pointer select-none">
                    Featured Post (Show on Home Page)
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={editIsPublic}
                    onChange={(e) => setEditIsPublic(e.target.checked)}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-background bg-transparent cursor-pointer"
                  />
                  <label htmlFor="isPublic" className="text-sm font-semibold text-foreground cursor-pointer select-none">
                    Publicly Visible (Publish Immediately)
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted uppercase">Cover Image (Cloudinary Upload)</label>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  {editCoverImage ? (
                    <div className="relative group rounded-lg overflow-hidden border border-border h-32 w-48 flex items-center justify-center bg-[#0f141c] shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={editCoverImage} alt="Cover Preview" className="h-full object-contain" />
                      <button
                        type="button"
                        onClick={() => {
                          setEditCoverImage('');
                          setPendingImageFile(null);
                        }}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" /> Remove
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor="cover-image-upload"
                      className="flex flex-col items-center justify-center h-32 w-48 rounded-lg border border-dashed border-border hover:border-primary/50 bg-muted-background/30 hover:bg-muted-background/60 transition-all cursor-pointer shrink-0"
                    >
                      {uploading ? (
                        <div className="flex flex-col items-center gap-1.5">
                          <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Uploading...</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-1.5 text-muted hover:text-foreground">
                          <Upload className="h-6 w-6" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Upload Cover</span>
                        </div>
                      )}
                    </label>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    id="cover-image-upload"
                    disabled={uploading}
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  <div className="text-xs text-muted leading-relaxed">
                    <p className="font-semibold text-foreground">Select an image to upload directly to Cloudinary.</p>
                    <p className="mt-1">Supported formats: JPEG, PNG, WEBP, GIF. Images are saved to your blogs folder automatically.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted uppercase">Excerpt / Short Description *</label>
                <textarea
                  rows={2}
                  required
                  value={editExcerpt}
                  onChange={(e) => setEditExcerpt(e.target.value)}
                  placeholder="Provide a short summary that will be displayed in post cards..."
                  className="w-full rounded-lg border border-border bg-transparent p-3 text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>

              {/* Splitted Editor + Preview Section */}
              <div className="space-y-2 border-t border-border pt-4">
                <div className="flex justify-between items-center bg-muted-background/40 p-1.5 rounded-lg border border-border max-w-[280px]">
                  <button
                    type="button"
                    onClick={() => setEditorTab('edit')}
                    className={`flex-1 text-center py-1 text-xs font-bold rounded-md transition-all ${
                      editorTab === 'edit' ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-foreground'
                    }`}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorTab('preview')}
                    className={`flex-1 text-center py-1 text-xs font-bold rounded-md transition-all ${
                      editorTab === 'preview' ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-foreground'
                    }`}
                  >
                    Preview
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorTab('split')}
                    className={`flex-1 text-center py-1 text-xs font-bold rounded-md transition-all ${
                      editorTab === 'split' ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-foreground'
                    }`}
                  >
                    Split
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-4" style={{ display: editorTab === 'split' ? 'grid' : 'block' }}>
                  {/* TextArea Editor Column */}
                  {(editorTab === 'edit' || editorTab === 'split') && (
                    <div className="space-y-0">
                      <label className="text-xs font-bold text-muted uppercase block mb-1.5">Content (Markdown supported) *</label>
                      
                      {/* Markdown Toolbar */}
                      <div className="flex flex-wrap items-center gap-1 p-1.5 rounded-t-lg border border-border bg-muted-background/30">
                        <button
                          type="button"
                          onClick={() => insertMarkdown('**', '**')}
                          title="Bold"
                          className="p-1.5 rounded hover:bg-muted-background transition-colors text-muted hover:text-foreground cursor-pointer"
                        >
                          <Bold className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdown('*', '*')}
                          title="Italic"
                          className="p-1.5 rounded hover:bg-muted-background transition-colors text-muted hover:text-foreground cursor-pointer"
                        >
                          <Italic className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdown('## ')}
                          title="Heading 2"
                          className="p-1.5 rounded hover:bg-muted-background transition-colors text-muted hover:text-foreground font-bold text-xs flex items-center gap-0.5 cursor-pointer"
                        >
                          <Heading className="h-4 w-4" /> <span className="text-[10px]">H2</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdown('### ')}
                          title="Heading 3"
                          className="p-1.5 rounded hover:bg-muted-background transition-colors text-muted hover:text-foreground font-bold text-xs flex items-center gap-0.5 cursor-pointer"
                        >
                          <Heading className="h-4 w-4" /> <span className="text-[10px]">H3</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdown('`', '`')}
                          title="Inline Code"
                          className="p-1.5 rounded hover:bg-muted-background transition-colors text-muted hover:text-foreground cursor-pointer"
                        >
                          <Code className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdown('```\n', '\n```')}
                          title="Code Block"
                          className="p-1.5 rounded hover:bg-muted-background transition-colors text-muted hover:text-foreground font-bold text-[10px] cursor-pointer"
                        >
                          Code Block
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdown('[', '](url)')}
                          title="Insert Link"
                          className="p-1.5 rounded hover:bg-muted-background transition-colors text-muted hover:text-foreground cursor-pointer"
                        >
                          <LinkIcon className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdown('- ')}
                          title="Unordered List"
                          className="p-1.5 rounded hover:bg-muted-background transition-colors text-muted hover:text-foreground cursor-pointer"
                        >
                          <List className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdown('1. ')}
                          title="Ordered List"
                          className="p-1.5 rounded hover:bg-muted-background transition-colors text-muted hover:text-foreground cursor-pointer"
                        >
                          <ListOrdered className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdown('> ')}
                          title="Blockquote"
                          className="p-1.5 rounded hover:bg-muted-background transition-colors text-muted hover:text-foreground cursor-pointer"
                        >
                          <Quote className="h-4 w-4" />
                        </button>
                      </div>

                      <textarea
                        ref={textareaRef}
                        rows={16}
                        required
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        placeholder="Write your article in markdown format..."
                        className="w-full rounded-b-lg border border-t-0 border-border bg-[var(--code-bg)] p-3 text-sm focus:outline-none focus:border-primary transition-colors resize-y text-secondary font-mono leading-relaxed"
                      />
                    </div>
                  )}

                  {/* Rendered Preview Column */}
                  {(editorTab === 'preview' || editorTab === 'split') && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted uppercase">Live Preview</label>
                      <div className="w-full rounded-lg border border-border bg-card p-4 overflow-y-auto max-h-[352px] lg:max-h-[352px] prose dark:prose-invert">
                        {editCoverImage && (
                          <div className="mb-4 rounded-lg overflow-hidden border border-border h-32 flex items-center justify-center bg-[#0f141c]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={editCoverImage} alt="Cover Preview" className="h-full object-contain" />
                          </div>
                        )}
                        <h1 className="text-lg font-bold border-b border-border pb-1 mb-2">{editTitle || 'Untitled Post'}</h1>
                        {editContent ? renderMarkdown(editContent) : <p className="text-xs text-muted italic">Write content to see preview...</p>}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Form Action row */}
              <div className="flex justify-end gap-2 border-t border-border pt-4">
                <button
                  type="button"
                  onClick={cancelEdit}
                  disabled={uploading}
                  className="rounded-full border border-border bg-card hover:bg-muted-background px-5 py-2 text-xs font-bold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex items-center gap-1.5 rounded-full bg-primary hover:bg-primary-hover px-6 py-2 text-xs font-bold text-white transition-all shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <>
                      <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" /> Save Post
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Loading and empty states */}
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 space-y-3">
            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-muted font-medium animate-pulse">Fetching blog posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <BookOpen className="h-8 w-8 text-muted mx-auto mb-3" />
            <p className="text-muted font-semibold">No posts found in database.</p>
            <p className="text-xs text-muted mt-1">Start by creating your first post.</p>
            <button
              onClick={handleCreateClick}
              className="mt-4 rounded-full bg-primary hover:bg-primary-hover px-5 py-2 text-xs font-bold text-white transition-colors shadow-sm cursor-pointer"
            >
              Add first post
            </button>
          </div>
        ) : (
          /* Posts Management Grid/List */
          <section className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-3">
              <h2 className="text-xs font-bold uppercase tracking-widest text-muted">
                Active Posts ({filteredAdminPosts.length} / {posts.length})
              </h2>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  placeholder="Search admin posts..."
                  value={adminSearchQuery}
                  onChange={(e) => setAdminSearchQuery(e.target.value)}
                  className="rounded-lg border border-border bg-transparent px-3 py-1.5 text-xs focus:outline-none focus:border-primary placeholder-muted w-full sm:w-44"
                />

                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value as Category | 'all')}
                  className="rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs focus:outline-none focus:border-primary transition-colors cursor-pointer text-foreground/80"
                >
                  <option value="all">All Categories</option>
                  <option value="linux">Linux</option>
                  <option value="windows">Windows</option>
                  <option value="coding">Coding</option>
                  <option value="languages">Languages</option>
                  <option value="databases">Databases</option>
                  <option value="framework">Framework</option>
                  <option value="general">General</option>
                </select>

                <select
                  value={filterFeatured}
                  onChange={(e) => setFilterFeatured(e.target.value as 'all' | 'featured' | 'standard')}
                  className="rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs focus:outline-none focus:border-primary transition-colors cursor-pointer text-foreground/80"
                >
                  <option value="all">All Featured/Standard</option>
                  <option value="featured">Featured Only</option>
                  <option value="standard">Standard Only</option>
                </select>
              </div>
            </div>

            {filteredAdminPosts.length === 0 ? (
              <div className="rounded-xl border border-border bg-card p-8 text-center">
                <p className="text-sm text-muted font-medium">No posts match your active filters.</p>
                <button
                  onClick={() => {
                    setFilterCategory('all');
                    setFilterFeatured('all');
                    setAdminSearchQuery('');
                  }}
                  className="mt-2 text-xs text-primary hover:underline cursor-pointer"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {filteredAdminPosts.map((post) => (
                  <div
                    key={post.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-border bg-card transition-all hover:bg-muted-background/30"
                  >
                    <div className="flex items-start gap-4">
                      {/* Tiny cover thumbnail */}
                      {post.coverImageUrl ? (
                        <div className="h-12 w-12 rounded-lg overflow-hidden border border-border bg-[#0f141c] flex items-center justify-center shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={post.coverImageUrl} alt="" className="h-full object-contain" />
                        </div>
                      ) : (
                        <div className="h-12 w-12 rounded-lg border border-border bg-muted-background flex items-center justify-center shrink-0">
                          <FileText className="h-5 w-5 text-muted" />
                        </div>
                      )}

                      <div className="space-y-1">
                        <h3 className="font-bold text-sm text-foreground line-clamp-1 flex items-center gap-1.5">
                          {post.title}
                          {post.isFeatured && (
                            <span className="inline-flex items-center rounded-full bg-primary/20 text-primary px-1.5 py-0.2 text-[9px] font-black uppercase tracking-wider">
                              Featured
                            </span>
                          )}
                          {post.isPublic === false && (
                            <span className="inline-flex items-center rounded-full bg-red-500/20 text-red-400 px-1.5 py-0.2 text-[9px] font-black uppercase tracking-wider">
                              Private
                            </span>
                          )}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.2 font-semibold tag-${post.category}`}>
                            {post.category}
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {post.readTimeMinutes} min</span>
                          <span>·</span>
                          <span className="flex items-center gap-1"><Tag className="h-3 w-3" /> {post.tags.length} tags</span>
                          <span>·</span>
                          <span>{post.publishedAt}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto justify-end border-t border-border/40 pt-3 sm:border-0 sm:pt-0">
                      <button
                        type="button"
                        onClick={() => setManagingCommentsPost(post)}
                        className="flex items-center gap-1 rounded-lg border border-border bg-card hover:bg-muted-background px-3 py-1.5 text-xs font-bold transition-all cursor-pointer text-foreground/75"
                      >
                        <MessageSquare className="h-3 w-3 text-muted" /> Comments ({post.comments?.length || 0})
                      </button>
                      <button
                        onClick={() => handleEditClick(post)}
                        className="flex items-center gap-1 rounded-lg border border-border bg-card hover:bg-muted-background px-3 py-1.5 text-xs font-bold transition-all cursor-pointer"
                      >
                        <Edit2 className="h-3 w-3" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(post.id, post.title)}
                        className="flex items-center gap-1 rounded-lg border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-500 px-3 py-1.5 text-xs font-bold transition-all cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {/* ── Manage Comments Modal ── */}
      {managingCommentsPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-card border border-border w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl animate-fade-in-up flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border bg-muted-background px-5 py-4">
              <div>
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-foreground">
                  Manage Comments
                </h3>
                <p className="text-[10px] text-muted truncate max-w-[320px] mt-0.5 font-semibold">
                  {managingCommentsPost.title}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setManagingCommentsPost(null)}
                className="text-muted hover:text-foreground p-1 rounded-lg hover:bg-muted-background transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 overflow-y-auto flex-1 space-y-4">
              {managingCommentsPost.comments.length === 0 ? (
                <div className="text-center py-10 text-muted space-y-2">
                  <MessageSquare className="h-8 w-8 mx-auto text-muted/60" />
                  <p className="text-xs font-semibold">No comments on this post yet.</p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {managingCommentsPost.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="flex items-start justify-between gap-3 p-3.5 rounded-xl border border-border bg-muted-background/30 hover:bg-muted-background/60 transition-colors"
                    >
                      <div className="flex gap-3 flex-1">
                        <div className="h-8 w-8 shrink-0 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                          {comment.author[0].toUpperCase()}
                        </div>
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-foreground">{comment.author}</span>
                            <span className="text-[10px] text-muted">{comment.createdAt}</span>
                          </div>
                          <p className="text-xs text-foreground/80 leading-relaxed font-medium">
                            {comment.content}
                          </p>
                          {comment.replies && comment.replies.length > 0 && (
                            <div className="mt-3.5 pl-4 border-l-2 border-border/80 space-y-3">
                              {comment.replies.map((reply) => (
                                <div key={reply.id} className="flex items-start justify-between gap-3 group/reply">
                                  <div className="flex gap-2.5 flex-1">
                                    <div className="h-6 w-6 shrink-0 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-[10px] font-bold text-accent">
                                      {reply.author[0].toUpperCase()}
                                    </div>
                                    <div className="space-y-0.5 flex-1">
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-[11px] font-bold text-foreground">{reply.author}</span>
                                        <span className="text-[9px] text-muted">{reply.createdAt}</span>
                                      </div>
                                      <p className="text-[11px] text-foreground/75 leading-relaxed font-medium">
                                        {reply.content}
                                      </p>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteReply(managingCommentsPost.id, comment.id, reply.id)}
                                    disabled={uploading}
                                    className="text-muted hover:text-red-500 p-1 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                                    title="Delete Reply"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteComment(managingCommentsPost.id, comment.id)}
                        disabled={uploading}
                        className="text-muted hover:text-red-500 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                        title="Delete Comment"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-border bg-muted-background/40 p-4 flex justify-end">
              <button
                type="button"
                onClick={() => setManagingCommentsPost(null)}
                className="rounded-full border border-border bg-card hover:bg-muted-background px-5 py-2 text-xs font-bold transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
