export interface Comment {
  id: string;
  author: string;
  avatarUrl?: string;
  content: string;
  createdAt: string;
  ups: number;
  myVote?: 'up' | 'down' | null;
  replies?: Comment[];
}

export interface Post {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'image' | 'link';
  mediaUrl?: string;
  subreddit: string; // e.g., 'reactjs'
  author: string;
  createdAt: string;
  ups: number;
  commentsCount: number;
  comments: Comment[];
  myVote: 'up' | 'down' | null;
}

export interface SubredditInfo {
  name: string; // lowercase identifier, e.g. 'reactjs'
  displayName: string; // r/reactjs
  description: string;
  subscribers: string;
  online: string;
  iconColor: string;
  createdDate: string;
}
