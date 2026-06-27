'use client';

import React, { useState, use, useEffect } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { fetchPostBySlug, fetchPostsByCategory, addCommentToPost, getPostHref, getCategoryHref } from '@/app/data';
import { Category, Comment, BlogPost } from '@/app/types';
import BlogPostCard from '@/app/components/BlogPostCard';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MessageSquare,
  Send,
  Terminal,
  Monitor,
  Code2,
  Tag,
  ChevronRight,
  Database,
  Layers,
} from 'lucide-react';
import Link from 'next/link';

const CATEGORY_META: Record<Category, { label: string; icon: React.ReactNode; tagClass: string }> = {
  linux: { label: 'Linux', icon: <Terminal className="h-3.5 w-3.5" />, tagClass: 'tag-linux' },
  windows: { label: 'Windows', icon: <Monitor className="h-3.5 w-3.5" />, tagClass: 'tag-windows' },
  coding: { label: 'Coding', icon: <Code2 className="h-3.5 w-3.5" />, tagClass: 'tag-coding' },
  languages: { label: 'Languages', icon: <Code2 className="h-3.5 w-3.5" />, tagClass: 'tag-coding' },
  databases: { label: 'Databases', icon: <Database className="h-3.5 w-3.5" />, tagClass: 'tag-coding' },
  framework: { label: 'Framework', icon: <Layers className="h-3.5 w-3.5" />, tagClass: 'tag-coding' },
  general: { label: 'General', icon: <Tag className="h-3.5 w-3.5" />, tagClass: 'tag-general' },
};

export default function BlogPostPageContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    fetchPostBySlug(slug)
      .then((data) => {
        setPost(data);
        if (data) {
          setComments(data.comments || []);
          fetchPostsByCategory(data.category)
            .then((allCatPosts) => {
              setRelated(allCatPosts.filter((p) => p.id !== data.id).slice(0, 2));
            })
            .catch(console.error);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !post) return;
    try {
      const commentData = {
        author: authorName.trim() || 'Anonymous',
        content: newComment.trim(),
      };
      const updatedPost = await addCommentToPost(post.id, commentData);

      const newCommentObj: Comment = {
        id: updatedPost.comments[updatedPost.comments.length - 1]?._id || `c-${Date.now()}`,
        author: commentData.author,
        content: commentData.content,
        createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        replies: [],
      };
      setComments((prev) => [newCommentObj, ...prev]);
      setNewComment('');
      setAuthorName('');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Navbar />
        <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 flex items-center justify-center">
          <div className="text-muted text-sm font-semibold animate-pulse">Loading post...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    notFound();
  }

  const meta = CATEGORY_META[post.category];

  // Simple markdown-ish rendering
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let i = 0;
    let key = 0;

    while (i < lines.length) {
      const line = lines[i];

      if (line.startsWith('## ')) {
        elements.push(
          <h2 key={key++} className="text-xl font-bold text-foreground mt-8 mb-3 pb-2 border-b border-border">
            {line.slice(3)}
          </h2>
        );
        i++;
      } else if (line.startsWith('### ')) {
        elements.push(
          <h3 key={key++} className="text-base font-bold text-foreground mt-6 mb-2">
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
        i++; // skip closing ```
        elements.push(
          <div key={key++} className="relative my-4">
            {lang && (
              <div className="flex items-center gap-2 rounded-t-lg border border-border border-b-0 bg-muted-background px-4 py-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted">{lang}</span>
              </div>
            )}
            <pre className={`overflow-x-auto rounded-${lang ? 'b' : ''}lg bg-[var(--code-bg)] border border-border p-4 text-sm leading-relaxed text-secondary font-mono`}>
              <code>{codeLines.join('\n')}</code>
            </pre>
          </div>
        );
      } else if (line.startsWith('| ')) {
        // Table
        const tableLines: string[] = [];
        while (i < lines.length && lines[i].startsWith('|')) {
          tableLines.push(lines[i]);
          i++;
        }
        const [header, , ...rows] = tableLines;
        const headers = header.split('|').filter(Boolean).map((h) => h.trim());
        elements.push(
          <div key={key++} className="my-4 overflow-x-auto">
            <table className="w-full text-sm border-collapse border border-border rounded-lg overflow-hidden">
              <thead className="bg-muted-background">
                <tr>
                  {headers.map((h, idx) => (
                    <th key={idx} className="border border-border px-4 py-2 text-left font-semibold text-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rIdx) => (
                  <tr key={rIdx} className="even:bg-muted-background/50">
                    {row.split('|').filter(Boolean).map((cell, cIdx) => (
                      <td key={cIdx} className="border border-border px-4 py-2 text-muted">{cell.trim()}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      } else if (line.startsWith('![')) {
        const match = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
        if (match) {
          const [, alt, src] = match;
          elements.push(
            <div key={key++} className="my-6 overflow-hidden rounded-xl border border-border bg-card p-1 max-w-lg mx-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={alt} className="w-full h-auto max-h-96 object-contain rounded-lg mx-auto" />
              {alt && <p className="text-center text-xs text-muted mt-2">{alt}</p>}
            </div>
          );
          i++;
        } else {
          elements.push(
            <p key={key++} className="text-sm leading-7 text-foreground/85">
              {renderInline(line)}
            </p>
          );
          i++;
        }
      } else if (line.startsWith('- ') || line.startsWith('❌ ') || line.startsWith('✨')) {
        elements.push(
          <li key={key++} className="text-sm text-foreground/85 leading-relaxed ml-4 list-disc mb-1">
            {renderInline(line.replace(/^[-•]\s/, ''))}
          </li>
        );
        i++;
      } else if (line.trim() === '') {
        elements.push(<div key={key++} className="h-2" />);
        i++;
      } else {
        elements.push(
          <p key={key++} className="text-sm leading-7 text-foreground/85">
            {renderInline(line)}
          </p>
        );
        i++;
      }
    }

    return elements;
  };

  const renderInline = (text: string): React.ReactNode => {
    // Bold **text**
    const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={i} className="code-inline">{part.slice(1, -1)}</code>;
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted mb-6 animate-fade-in-up">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link
            href={getCategoryHref(post.category)}
            className="hover:text-foreground transition-colors capitalize"
          >
            {meta.label}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground truncate max-w-xs">{post.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">

          {/* ── Main article ── */}
          <article className="animate-fade-in-up space-y-6">
            {/* Cover image */}
            {post.coverImageUrl && !imageError && (
              <div className={`overflow-hidden rounded-xl border border-border flex items-center justify-center h-56 sm:h-72 ${post.coverImageUrl.includes('arch') || post.coverImageUrl.includes('fedora') || post.coverImageUrl.includes('tux')
                ? 'bg-[#0f141c]'
                : 'bg-muted-background'
                }`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.coverImageUrl}
                  alt={post.title}
                  onError={() => setImageError(true)}
                  className={`h-full w-full ${post.coverImageUrl.includes('arch') || post.coverImageUrl.includes('fedora') || post.coverImageUrl.includes('tux')
                    ? 'object-contain p-6'
                    : 'object-cover'
                    }`}
                />
              </div>
            )}

            {/* Post header */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${meta.tagClass}`}>
                  {meta.icon} {meta.label}
                </span>
                {post.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-border bg-muted-background px-2 py-0.5 text-[10px] font-medium text-muted">
                    #{tag}
                  </span>
                ))}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold leading-snug text-foreground">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-muted border-b border-border pb-4">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-foreground">{post.author}</span>
                </div>
                <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{post.publishedAt}</span>
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{post.readTimeMinutes} min read</span>
                <span className="flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" />{comments.length} comments</span>
              </div>
            </div>

            {/* Article content */}
            <div className="space-y-1">
              {renderContent(post.content)}
            </div>

            {/* Back button */}
            <div className="pt-4 border-t border-border">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors font-medium cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
            </div>

            {/* ── Comments ── */}
            <section className="space-y-6 pt-2 border-t border-border">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Comments ({comments.length})
              </h2>

              {/* Comment form */}
              <form onSubmit={handleSubmitComment} className="space-y-3">
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Your name (optional)"
                  className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-primary placeholder-muted transition-colors"
                />
                <div className="relative rounded-lg border border-border focus-within:border-primary overflow-hidden transition-colors">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts or ask a question…"
                    rows={3}
                    className="w-full bg-transparent p-3 text-sm focus:outline-none resize-none placeholder-muted"
                  />
                  <div className="flex justify-end border-t border-border/60 bg-muted-background/30 px-3 py-1.5">
                    <button
                      type="submit"
                      disabled={!newComment.trim()}
                      className="flex items-center gap-1.5 rounded-full bg-primary disabled:opacity-40 hover:bg-primary-hover px-4 py-1.5 text-xs font-bold text-white transition-colors cursor-pointer shadow-sm"
                    >
                      <Send className="h-3 w-3" />
                      Post Comment
                    </button>
                  </div>
                </div>
              </form>

              {/* Comment list */}
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-sm text-muted text-center py-6">
                    No comments yet — be the first to share your thoughts!
                  </p>
                ) : (
                  comments.map((comment) => (
                    <CommentItem key={comment.id} comment={comment} />
                  ))
                )}
              </div>
            </section>
          </article>

          {/* ── Sidebar ── */}
          <aside className="space-y-6 animate-fade-in-up">
            {/* Table of contents / Author card */}
            <div className="rounded-xl border border-border bg-card p-5 sticky top-20">
              <div className="pb-4 border-b border-border">
                <div>
                  <p className="font-semibold text-sm text-foreground">Geric Morit</p>
                  <p className="text-xs text-muted">Full-Stack Developer</p>
                </div>
              </div>
              <p className="text-xs text-muted leading-relaxed mt-3">
                Documenting my developer life — from the terminal to production.
              </p>
              <a
                href="https://www.gericandmorty.codes"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex items-center justify-center gap-1.5 w-full rounded-full border border-primary text-primary hover:bg-primary hover:text-white px-4 py-1.5 text-xs font-bold transition-all duration-150"
              >
                Visit Portfolio
              </a>
            </div>

            {/* Related posts */}
            {related.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
                  Related Posts
                </h3>
                {related.map((rp) => (
                  <Link
                    key={rp.id}
                    href={getPostHref(rp)}
                    className="block rounded-lg border border-border bg-card p-3 card-hover"
                  >
                    <p className="text-sm font-semibold text-foreground group-hover:text-primary line-clamp-2">
                      {rp.title}
                    </p>
                    <p className="text-xs text-muted mt-1">{rp.publishedAt} · {rp.readTimeMinutes} min</p>
                  </Link>
                ))}
              </div>
            )}
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function CommentItem({ comment }: { comment: Comment }) {
  return (
    <div className="flex gap-3">
      <div className="h-7 w-7 shrink-0 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary">
        {comment.author[0].toUpperCase()}
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">{comment.author}</span>
          <span className="text-xs text-muted">{comment.createdAt}</span>
        </div>
        <p className="text-sm text-foreground/80 leading-relaxed">{comment.content}</p>
        {comment.replies && comment.replies.length > 0 && (
          <div className="pl-4 border-l-2 border-border mt-3 space-y-3">
            {comment.replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
