import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("tracks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const get = query({
  args: { id: v.id("tracks") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    artist: v.union(v.literal("tupac"), v.literal("biggie"), v.literal("50cent")),
    prompt: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const trackId = await ctx.db.insert("tracks", {
      userId,
      title: args.title,
      artist: args.artist,
      prompt: args.prompt,
      status: "generating_lyrics",
      createdAt: Date.now(),
    });

    // Add to generation queue
    await ctx.db.insert("generationQueue", {
      trackId,
      step: "lyrics",
      attempts: 0,
      createdAt: Date.now(),
    });

    return trackId;
  },
});

export const updateLyrics = mutation({
  args: {
    id: v.id("tracks"),
    lyrics: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      lyrics: args.lyrics,
      status: "generating_audio",
    });
  },
});

export const updateAudio = mutation({
  args: {
    id: v.id("tracks"),
    audioUrl: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      audioUrl: args.audioUrl,
      status: "completed",
    });
  },
});

export const setFailed = mutation({
  args: {
    id: v.id("tracks"),
    error: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: "failed",
    });
  },
});

export const remove = mutation({
  args: { id: v.id("tracks") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const track = await ctx.db.get(args.id);
    if (!track || track.userId !== userId) throw new Error("Not found");

    await ctx.db.delete(args.id);
  },
});
