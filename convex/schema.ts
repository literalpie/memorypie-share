import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  folders: defineTable({
    userId: v.string(),
    title: v.string(),
    slug: v.string(),
  }).index('by_user_id', ['userId']).index('by_slug', ['slug']),
  memorizationItems: defineTable({
    folderId: v.id('folders'),
    title: v.string(),
    text: v.string(),
    order: v.number(),
  }).index('by_folder', ['folderId', 'order']),
});
