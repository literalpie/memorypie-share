import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

export const getFolderHttp = httpAction(async (ctx, request) => {
  const { folderSlug } = await request.json();
  const folderRes = await ctx.runQuery(api.tasks.getFolder, {
    folderSlug,
  });
  return new Response(JSON.stringify(folderRes), {
    status: 200,
    headers: new Headers({
      "Access-Control-Allow-Origin": process.env.CLERK_CLIENT_ORIGIN!,
      "Content-Type": "application/json",
      Vary: "origin",
    }),
  });
});

http.route({
  path: "/get-folder",
  method: "POST",
  handler: getFolderHttp,
});

http.route({
  path: "/get-folder",
  method: "OPTIONS",
  handler: httpAction(async (_, request) => {
    // Make sure the necessary headers are present
    // for this to be a valid pre-flight request
    const headers = request.headers;
    if (
      headers.get("Origin") !== null &&
      headers.get("Access-Control-Request-Method") !== null &&
      headers.get("Access-Control-Request-Headers") !== null
    ) {
      return new Response(null, {
        status: 204,
        headers: new Headers({
          "Access-Control-Allow-Origin": process.env.CLERK_CLIENT_ORIGIN!,
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Digest",
          "Access-Control-Max-Age": "86400",
        }),
      });
    } else {
      return new Response();
    }
  }),
});

export default http;
