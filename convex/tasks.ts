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

export const getFolder = query({
  args: { folderSlug: v.string() },
  handler: async (ctx, args) => {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (userId === undefined) {
      throw new Error("not authenticated");
    }
    const folder = await ctx.db
      .query("folders")
      .withIndex("by_slug", (q) => q.eq("slug", args.folderSlug))
      .unique();
    if (folder === undefined || folder?.userId !== userId) {
      throw new Error("folder not found or it isn't yours");
    }
    const itemsInFolder = await ctx.db
      .query("memorizationItems")
      .withIndex("by_folder", (q) => q.eq("folderId", folder?._id))
      .collect();
    return { folder: { ...folder, memItems: itemsInFolder } };
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
    await Promise.all(createAllItems);
    console.log("Added new document with id:", id);
  },
});

export const updateFolder = mutation({
  args: {
    id: v.id("folders"),
    title: v.string(),
    // TODO: slug cannot include some punctuation
    slug: v.string(),
    memItems: v.array(
      v.object({
        title: v.string(),
        text: v.string(),
        _id: v.optional(v.id("memorizationItems")),
      }),
    ),
  },
  handler: async (ctx, args) => {
    // TODO: check that slug is unique (or is existing slug for this id)
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (userId === undefined) {
      throw new Error("not authenticated");
    }

    await ctx.db.replace(args.id, {
      slug: args.slug,
      title: args.title,
      userId,
    });

    // delete items that are in existing folder, but not in update
    const updatedIds = args.memItems.map((item) => item._id).filter(Boolean);
    const itemsInFolder = await ctx.db
      .query("memorizationItems")
      .withIndex("by_folder", (q) => q.eq("folderId", args.id))
      .collect();
    const deleteDoomedItems = itemsInFolder
      .filter((item) => !updatedIds.includes(item._id))
      .map((item) => ctx.db.delete(item._id));

    // For each item included in the request, update the ID'd item if given an ID,
    // Or insert a brand new item if there's no ID given
    const updateAllItems = args.memItems.map(async (memItem, index) => {
      if (memItem._id !== undefined) {
        await ctx.db.replace(memItem._id, {
          folderId: args.id,
          text: memItem.text,
          title: memItem.title,
          order: index,
        });
        return;
      }
      await ctx.db.insert("memorizationItems", {
        folderId: args.id,
        text: memItem.text,
        title: memItem.title,
        order: index,
      });
    });

    await Promise.all([...updateAllItems, ...deleteDoomedItems]);
    console.log("Updated folder with id:", args.id, args.slug, args.memItems.at(0)?.title);
  },
});
