'use client';

import React, { useState } from 'react';
import { X, ArrowBigUp, ArrowBigDown, MessageSquare, CornerDownRight, Send } from 'lucide-react';
import { Post, Comment } from '../../../types';

interface PostDetailModalProps {
  post: Post;
  onClose: () => void;
  onVote: (postId: string, voteType: 'up' | 'down') => void;
  onAddComment: (postId: string, parentCommentId: string | null, content: string) => void;
}

export default function PostDetailModal({
  post,
  onClose,
  onVote,
  onAddComment,
}: PostDetailModalProps) {
  const [rootCommentText, setRootCommentText] = useState('');

  const handleRootSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rootCommentText.trim()) return;
    onAddComment(post.id, null, rootCommentText.trim());
    setRootCommentText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 transition-opacity duration-200">
      {/* Modal Container */}
      <div className="flex h-full max-h-[85vh] w-full max-w-3xl flex-col rounded-lg border border-border bg-card text-card-foreground shadow-xl transition-all duration-200">
        
        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-border p-4 bg-muted-background/20 shrink-0">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted">
            <span className="text-foreground">r/{post.subreddit}</span>
            <span>•</span>
            <span>Posted by u/{post.author}</span>
          </div>
          <button
            onClick={onClose}
            className="rounded hover:bg-muted-background p-1 text-muted hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          
          {/* Post Details (Upvote layout + Title & Content) */}
          <div className="flex gap-3">
            {/* Vote panel */}
            <div className="flex flex-col items-center py-1 bg-muted-background/30 rounded px-1.5 shrink-0 self-start">
              <button
                onClick={() => onVote(post.id, 'up')}
                className={`rounded p-0.5 transition-colors cursor-pointer ${
                  post.myVote === 'up' ? 'text-primary bg-primary/10' : 'text-muted hover:text-foreground'
                }`}
              >
                <ArrowBigUp className="h-6 w-6 fill-current" />
              </button>
              <span className={`text-xs font-bold my-1 ${
                post.myVote === 'up' ? 'text-primary' : post.myVote === 'down' ? 'text-accent' : 'text-foreground'
              }`}>
                {post.ups + (post.myVote === 'up' ? 1 : post.myVote === 'down' ? -1 : 0)}
              </span>
              <button
                onClick={() => onVote(post.id, 'down')}
                className={`rounded p-0.5 transition-colors cursor-pointer ${
                  post.myVote === 'down' ? 'text-accent bg-accent/10' : 'text-muted hover:text-foreground'
                }`}
              >
                <ArrowBigDown className="h-6 w-6 fill-current" />
              </button>
            </div>

            {/* Post copy */}
            <div className="flex-1 space-y-3">
              <h1 className="text-xl font-bold leading-7 text-foreground">{post.title}</h1>
              
              <div className="text-sm leading-relaxed text-card-foreground/90 whitespace-pre-wrap">
                {post.type === 'text' && post.content}
                
                {post.type === 'image' && (
                  <div className="overflow-hidden rounded-md border border-border bg-black/5 flex items-center justify-center p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.mediaUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80"}
                      alt={post.title}
                      className="max-h-[500px] w-auto object-contain rounded"
                    />
                  </div>
                )}

                {post.type === 'link' && post.mediaUrl && (
                  <a
                    href={post.mediaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-md border border-accent/20 bg-accent/5 hover:bg-accent/10 p-3 text-accent transition-colors"
                  >
                    <div className="truncate pr-2 flex items-center gap-2">
                      <CornerDownRight className="h-4 w-4 shrink-0" />
                      <span className="font-bold text-xs truncate hover:underline">{post.mediaUrl}</span>
                    </div>
                    <span className="text-[10px] font-black uppercase border border-accent/30 rounded px-1.5 py-0.5">Link</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Comment input box (Root comment) */}
          <div className="border-t border-border pt-4">
            <p className="text-xs font-semibold text-muted mb-2">
              Comment as <span className="text-foreground">u/coder_reddit</span>
            </p>
            <form onSubmit={handleRootSubmit} className="relative rounded-md border border-border focus-within:border-primary overflow-hidden">
              <textarea
                placeholder="What are your thoughts?"
                value={rootCommentText}
                onChange={(e) => setRootCommentText(e.target.value)}
                rows={3}
                className="w-full bg-transparent p-3 text-sm focus:outline-none resize-none placeholder-muted"
              />
              <div className="flex justify-end border-t border-border/60 bg-muted-background/20 px-3 py-1.5">
                <button
                  type="submit"
                  disabled={!rootCommentText.trim()}
                  className="flex items-center gap-1 rounded-full bg-primary disabled:opacity-50 px-4 py-1 text-xs font-bold text-white transition-colors cursor-pointer"
                >
                  <Send className="h-3 w-3" />
                  Comment
                </button>
              </div>
            </form>
          </div>

          {/* Comments section header */}
          <div className="border-t border-border pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-4 flex items-center gap-1.5">
              <MessageSquare className="h-4 w-4 text-muted" />
              All Comments ({post.commentsCount})
            </h3>

            {/* Comment Tree */}
            <div className="space-y-4">
              {post.comments.length === 0 ? (
                <p className="text-sm text-muted py-4 text-center">No comments yet. Be the first to share your thoughts!</p>
              ) : (
                post.comments.map((comment) => (
                  <CommentNode
                    key={comment.id}
                    comment={comment}
                    postId={post.id}
                    onAddComment={onAddComment}
                  />
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

/* Recursive Comment Node Component */
interface CommentNodeProps {
  comment: Comment;
  postId: string;
  onAddComment: (postId: string, parentCommentId: string | null, content: string) => void;
}

function CommentNode({ comment, postId, onAddComment }: CommentNodeProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [ups, setUps] = useState(comment.ups);
  const [myVote, setMyVote] = useState<'up' | 'down' | null>(null);

  const handleVote = (voteType: 'up' | 'down') => {
    if (myVote === voteType) {
      setMyVote(null);
      setUps(prev => voteType === 'up' ? prev - 1 : prev + 1);
    } else {
      const diff = voteType === 'up' ? 1 : -1;
      const adjust = myVote ? (voteType === 'up' ? 2 : -2) : diff;
      setMyVote(voteType);
      setUps(prev => prev + adjust);
    }
  };

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onAddComment(postId, comment.id, replyText.trim());
    setReplyText('');
    setIsReplying(false);
  };

  return (
    <div className="flex gap-2">
      {/* Thread line left gutter */}
      <div className="flex flex-col items-center">
        {/* User avatar indicator */}
        <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-700 border border-blue-200">
          {comment.author[0].toUpperCase()}
        </div>
        <div className="w-[2px] flex-1 bg-border hover:bg-primary transition-colors cursor-pointer my-1.5" title="Collapse thread" />
      </div>

      {/* Comment Main content */}
      <div className="flex-1 space-y-1.5 pb-2">
        <div className="flex items-center gap-1.5 text-xs">
          <span className="font-bold text-foreground">{comment.author}</span>
          <span className="text-[10px] text-muted">{comment.createdAt}</span>
        </div>

        <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">{comment.content}</p>

        {/* Action bar (Upvotes, Reply button) */}
        <div className="flex items-center gap-2 text-xs font-bold text-muted">
          <div className="flex items-center">
            <button
              onClick={() => handleVote('up')}
              className={`rounded p-0.5 transition-colors cursor-pointer ${
                myVote === 'up' ? 'text-primary' : 'text-muted hover:text-foreground'
              }`}
            >
              <ArrowBigUp className="h-4.5 w-4.5 fill-current" />
            </button>
            <span className={`mx-0.5 min-w-[12px] text-center ${
              myVote === 'up' ? 'text-primary' : myVote === 'down' ? 'text-accent' : 'text-muted'
            }`}>
              {ups}
            </span>
            <button
              onClick={() => handleVote('down')}
              className={`rounded p-0.5 transition-colors cursor-pointer ${
                myVote === 'down' ? 'text-accent' : 'text-muted hover:text-foreground'
              }`}
            >
              <ArrowBigDown className="h-4.5 w-4.5 fill-current" />
            </button>
          </div>

          <button
            onClick={() => setIsReplying(!isReplying)}
            className="flex items-center gap-1 rounded hover:bg-muted-background px-1.5 py-0.5 transition-colors cursor-pointer"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Reply</span>
          </button>
        </div>

        {/* Inline Reply Editor */}
        {isReplying && (
          <form onSubmit={handleReplySubmit} className="mt-2 space-y-2 max-w-md">
            <textarea
              placeholder={`Reply to ${comment.author}...`}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={2}
              className="w-full rounded border border-border bg-transparent p-2 text-xs focus:outline-none focus:border-primary resize-none placeholder-muted"
            />
            <div className="flex justify-end gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setIsReplying(false);
                  setReplyText('');
                }}
                className="rounded-full border border-border px-3 py-1 text-[10px] font-bold text-foreground hover:bg-muted-background transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!replyText.trim()}
                className="rounded-full bg-primary disabled:opacity-50 px-3 py-1 text-[10px] font-bold text-white transition-colors cursor-pointer"
              >
                Reply
              </button>
            </div>
          </form>
        )}

        {/* Recursive Child Comments */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3 pl-1 space-y-3 border-l border-border/10">
            {comment.replies.map((reply) => (
              <CommentNode
                key={reply.id}
                comment={reply}
                postId={postId}
                onAddComment={onAddComment}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
