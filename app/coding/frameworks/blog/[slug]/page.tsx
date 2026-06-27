'use client';

import BlogPostPageContent from '@/app/components/BlogPostPageContent';

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  return <BlogPostPageContent params={params} />;
}
