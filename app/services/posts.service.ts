import { BlogPost } from '../types';
import { API_BASE } from './api.config';

function mapPostToBlogPost(post: any): BlogPost {
  return {
    id: post._id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    category: post.category,
    tags: post.tags || [],
    author: post.author?.name || 'Geric Morit',
    publishedAt: new Date(post.createdAt || Date.now()).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    readTimeMinutes: post.readTimeMinutes || 5,
    coverImageUrl: post.coverImageUrl || undefined,
    isFeatured: !!post.isFeatured,
    comments: (post.comments || []).map((c: any) => ({
      id: c._id || `c-${Math.random()}`,
      author: c.author || 'Anonymous',
      content: c.content || '',
      createdAt: new Date(c.createdAt || Date.now()).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      replies: (c.replies || []).map((r: any) => ({
        id: r._id || `r-${Math.random()}`,
        author: r.author || 'Anonymous',
        content: r.content || '',
        createdAt: new Date(r.createdAt || Date.now()).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
      })),
    })),
  };
}

export async function fetchAllPosts(): Promise<BlogPost[]> {
  const res = await fetch(`${API_BASE}/posts`);
  if (!res.ok) {
    throw new Error(`Failed to fetch posts: ${res.statusText}`);
  }
  const data = await res.json();
  return data.map(mapPostToBlogPost);
}

export async function fetchPostsByCategory(category: string): Promise<BlogPost[]> {
  const res = await fetch(`${API_BASE}/posts?category=${category}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch posts for category ${category}: ${res.statusText}`);
  }
  const data = await res.json();
  return data.map(mapPostToBlogPost);
}

export async function fetchPostBySlug(slug: string): Promise<BlogPost | null> {
  const res = await fetch(`${API_BASE}/posts/${slug}`);
  if (res.status === 404) {
    return null;
  }
  if (!res.ok) {
    throw new Error(`Failed to fetch post with slug ${slug}: ${res.statusText}`);
  }
  const data = await res.json();
  return mapPostToBlogPost(data);
}

export async function addCommentToPost(
  postId: string,
  comment: { author: string; content: string }
): Promise<any> {
  const res = await fetch(`${API_BASE}/posts/${postId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(comment),
  });
  if (!res.ok) {
    throw new Error(`Failed to add comment: ${res.statusText}`);
  }
  return res.json();
}

export async function updatePost(postId: string, postData: any, authHash?: string): Promise<BlogPost> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (authHash) {
    headers['Authorization'] = `Bearer ${authHash}`;
  }
  const res = await fetch(`${API_BASE}/posts/${postId}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(postData),
  });
  if (!res.ok) {
    throw new Error(`Failed to update post: ${res.statusText}`);
  }
  const data = await res.json();
  return mapPostToBlogPost(data);
}

export async function createPost(postData: any, authHash?: string): Promise<BlogPost> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (authHash) {
    headers['Authorization'] = `Bearer ${authHash}`;
  }
  const res = await fetch(`${API_BASE}/posts`, {
    method: 'POST',
    headers,
    body: JSON.stringify(postData),
  });
  if (!res.ok) {
    throw new Error(`Failed to create post: ${res.statusText}`);
  }
  const data = await res.json();
  return mapPostToBlogPost(data);
}

export async function deletePost(postId: string, authHash?: string): Promise<any> {
  const headers: Record<string, string> = {};
  if (authHash) {
    headers['Authorization'] = `Bearer ${authHash}`;
  }
  const res = await fetch(`${API_BASE}/posts/${postId}`, {
    method: 'DELETE',
    headers,
  });
  if (!res.ok) {
    throw new Error(`Failed to delete post: ${res.statusText}`);
  }
  return res.json();
}

export async function deleteCommentFromPost(postId: string, commentId: string, authHash?: string): Promise<any> {
  const headers: Record<string, string> = {};
  if (authHash) {
    headers['Authorization'] = `Bearer ${authHash}`;
  }
  const res = await fetch(`${API_BASE}/posts/${postId}/comments/${commentId}`, {
    method: 'DELETE',
    headers,
  });
  if (!res.ok) {
    throw new Error(`Failed to delete comment: ${res.statusText}`);
  }
  return res.json();
}

export async function addReplyToComment(
  postId: string,
  commentId: string,
  reply: { author: string; content: string }
): Promise<any> {
  const res = await fetch(`${API_BASE}/posts/${postId}/comments/${commentId}/replies`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reply),
  });
  if (!res.ok) {
    throw new Error(`Failed to add reply: ${res.statusText}`);
  }
  return res.json();
}

export async function deleteReplyFromComment(
  postId: string,
  commentId: string,
  replyId: string,
  authHash?: string
): Promise<any> {
  const headers: Record<string, string> = {};
  if (authHash) {
    headers['Authorization'] = `Bearer ${authHash}`;
  }
  const res = await fetch(`${API_BASE}/posts/${postId}/comments/${commentId}/replies/${replyId}`, {
    method: 'DELETE',
    headers,
  });
  if (!res.ok) {
    throw new Error(`Failed to delete reply: ${res.statusText}`);
  }
  return res.json();
}

export function getPostHref(post: { category: string; slug: string }): string {
  switch (post.category) {
    case 'linux':
      return `/os/linux/blog/${post.slug}`;
    case 'windows':
      return `/os/windows/blog/${post.slug}`;
    case 'coding':
      return `/coding/blog/${post.slug}`;
    case 'languages':
      return `/coding/languages/blog/${post.slug}`;
    case 'databases':
      return `/coding/databases/blog/${post.slug}`;
    default:
      return `/blog/${post.slug}`;
  }
}

export function getCategoryHref(category: string): string {
  switch (category) {
    case 'linux':
      return '/os/linux';
    case 'windows':
      return '/os/windows';
    case 'coding':
      return '/coding';
    case 'languages':
      return '/coding/languages';
    case 'databases':
      return '/coding/databases';
    default:
      return '/';
  }
}

