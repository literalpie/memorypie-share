import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const listFolders = query({
  handler: async (ctx) => {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (userId === undefined) {
      throw new Error("not authenticated");
    }
    const folders = await ctx.db
      .query("folders")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .collect();
    const foldersWithCounts = folders.map((f) =>
      ctx.db
        .query("memorizationItems")
        .withIndex("by_folder", (q) => q.eq("folderId", f._id))
        .collect()
        .then((items) => ({ ...f, itemCount: items.length })),
    );
    return {
      folders: await Promise.all(foldersWithCounts),
    };
  },
});

export const createFolder = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    memItems: v.array(
      v.object({
        title: v.string(),
        text: v.string(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    // TODO: check that slug is unique
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (userId === undefined) {
      throw new Error("not authenticated");
    }

    const id = await ctx.db.insert("folders", {
      slug: args.slug,
      title: args.title,
      userId,
    });
    const createAllItems = args.memItems.map(async (memItem, index) => {
      await ctx.db.insert("memorizationItems", {
        folderId: id,
        text: memItem.text,
        title: memItem.title,
        order: index,
      });
    });
    await Promise.all([createAllItems]);
    console.log("Added new document with id:", id);
  },
});
