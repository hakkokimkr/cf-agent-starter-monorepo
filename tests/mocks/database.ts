import { vi } from 'vitest';
import type { User, Post } from '@repo/database';

/**
 * In-memory mock database for testing without real DB connection
 */
export function createMockDatabase() {
  const users = new Map<string, User>();
  const posts = new Map<string, Post>();

  return {
    // Users
    users: {
      findAll: vi.fn(async () => Array.from(users.values())),

      findById: vi.fn(async (id: string) => users.get(id) || null),

      findByEmail: vi.fn(async (email: string) =>
        Array.from(users.values()).find((u) => u.email === email) || null
      ),

      create: vi.fn(async (data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
        const user: User = {
          id: crypto.randomUUID(),
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        users.set(user.id, user);
        return user;
      }),

      update: vi.fn(async (id: string, data: Partial<User>) => {
        const user = users.get(id);
        if (!user) return null;
        const updated = { ...user, ...data, updatedAt: new Date() };
        users.set(id, updated);
        return updated;
      }),

      delete: vi.fn(async (id: string) => {
        const user = users.get(id);
        if (!user) return false;
        users.delete(id);
        // Cascade delete posts
        Array.from(posts.values())
          .filter((p) => p.authorId === id)
          .forEach((p) => posts.delete(p.id));
        return true;
      }),
    },

    // Posts
    posts: {
      findAll: vi.fn(async () => Array.from(posts.values())),

      findById: vi.fn(async (id: string) => posts.get(id) || null),

      findByAuthor: vi.fn(async (authorId: string) =>
        Array.from(posts.values()).filter((p) => p.authorId === authorId)
      ),

      create: vi.fn(async (data: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) => {
        const post: Post = {
          id: crypto.randomUUID(),
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        posts.set(post.id, post);
        return post;
      }),

      update: vi.fn(async (id: string, data: Partial<Post>) => {
        const post = posts.get(id);
        if (!post) return null;
        const updated = { ...post, ...data, updatedAt: new Date() };
        posts.set(id, updated);
        return updated;
      }),

      delete: vi.fn(async (id: string) => {
        const deleted = posts.delete(id);
        return deleted;
      }),
    },

    // For test utilities
    _users: users,
    _posts: posts,
    _reset: () => {
      users.clear();
      posts.clear();
    },
  };
}

export type MockDatabase = ReturnType<typeof createMockDatabase>;
