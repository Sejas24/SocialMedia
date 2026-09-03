export type UserRole = 'user' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: number;
  content: string;
  image: string | null;
  userId: number;
  User: Pick<User, 'id' | 'name' | 'avatar'>;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: number;
  content: string;
  userId: number;
  postId: number;
  User: Pick<User, 'id' | 'name' | 'avatar'>;
  createdAt: string;
}

export interface FeedResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  posts: Post[];
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}