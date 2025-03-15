import { integer, pgTable, serial, text, timestamp, varchar, boolean, jsonb } from 'drizzle-orm/pg-core';

// This file defines the structure of your database tables using the Drizzle ORM.

// To modify the database schema:
// 1. Update this file with your desired changes.
// 2. Generate a new migration by running: `npm run db:generate`

// The generated migration file will reflect your schema changes.
// The migration is automatically applied during the next database interaction,
// so there's no need to run it manually or restart the Next.js server.

// Organizations (Dental/Medical Clinics)
export const organizations = pgTable('organizations', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Users table with organization relationship
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  organizationId: integer('organization_id').references(() => organizations.id),
  role: varchar('role', { length: 50 }).notNull().default('user'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Social Media Accounts
export const socialAccounts = pgTable('social_accounts', {
  id: serial('id').primaryKey(),
  organizationId: integer('organization_id').references(() => organizations.id),
  platform: varchar('platform', { length: 50 }).notNull(), // 'twitter', 'facebook', 'instagram', 'linkedin'
  accountName: varchar('account_name', { length: 255 }).notNull(),
  accountId: varchar('account_id', { length: 255 }).notNull(),
  accessToken: text('access_token').notNull(),
  refreshToken: text('refresh_token'),
  tokenExpiry: timestamp('token_expiry'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Social Media Posts
export const socialPosts = pgTable('social_posts', {
  id: serial('id').primaryKey(),
  organizationId: integer('organization_id').references(() => organizations.id),
  userId: integer('user_id').references(() => users.id),
  content: text('content').notNull(),
  mediaUrls: jsonb('media_urls'), // Array of media URLs
  scheduledFor: timestamp('scheduled_for'),
  publishedAt: timestamp('published_at'),
  status: varchar('status', { length: 50 }).notNull().default('draft'), // draft, scheduled, published, failed
  platforms: jsonb('platforms').notNull(), // Array of platform IDs to post to
  postIds: jsonb('post_ids'), // Platform-specific post IDs after publishing
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Analytics
export const analytics = pgTable('analytics', {
  id: serial('id').primaryKey(),
  postId: integer('post_id').references(() => socialPosts.id),
  platform: varchar('platform', { length: 50 }).notNull(),
  likes: integer('likes').default(0),
  shares: integer('shares').default(0),
  comments: integer('comments').default(0),
  reach: integer('reach').default(0),
  engagementRate: integer('engagement_rate').default(0),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
