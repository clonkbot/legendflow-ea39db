import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  // Generated lyrics/songs
  tracks: defineTable({
    userId: v.id("users"),
    title: v.string(),
    artist: v.union(v.literal("tupac"), v.literal("biggie"), v.literal("50cent")),
    prompt: v.string(),
    lyrics: v.optional(v.string()),
    audioUrl: v.optional(v.string()),
    status: v.union(
      v.literal("generating_lyrics"),
      v.literal("generating_audio"),
      v.literal("completed"),
      v.literal("failed")
    ),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_user_and_created", ["userId", "createdAt"]),

  // Generation queue for background processing
  generationQueue: defineTable({
    trackId: v.id("tracks"),
    step: v.union(v.literal("lyrics"), v.literal("audio")),
    attempts: v.number(),
    lastError: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_track", ["trackId"]),
});
