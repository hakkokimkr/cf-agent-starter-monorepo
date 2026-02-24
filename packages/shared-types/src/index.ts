/**
 * Shared types between frontend and backend
 * 
 * Note: For type-safe API calls, prefer using Hono's client inference
 * (`hono/client`) over manually maintaining these types.
 * This package is for types that need to be shared outside of API responses.
 */

// Re-export database types for convenience
export type { User, NewUser, Post, NewPost } from '@repo/database/schema';

// Common API response types
export interface ApiResponse<T> {
  data: T;
  success: true;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
  };
  success: false;
}

export type ApiResult<T> = ApiResponse<T> | ApiError;

// Pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Common enums/constants
export const ENVIRONMENTS = ['development', 'staging', 'production'] as const;
export type Environment = (typeof ENVIRONMENTS)[number];
