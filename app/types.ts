export type Category = 'linux' | 'windows' | 'coding' | 'general' | 'languages' | 'databases';

export interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  replies?: Comment[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: Category;
  tags: string[];
  author: string;
  publishedAt: string;
  readTimeMinutes: number;
  coverImageUrl?: string;
  isFeatured?: boolean;
  comments: Comment[];
}
