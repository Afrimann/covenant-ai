import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter();

// Server-to-server endpoint for triggering a web push notification, e.g.
// from a cron job or backend integration that isn't calling the Convex
// client directly. Protected by a shared secret header.
http.route({
  path: "/sendPush",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const secret = process.env.PUSH_API_SECRET;
    if (!secret || request.headers.get("x-push-secret") !== secret) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { userId, title, body: message, url } = body as {
      userId?: string;
      title?: string;
      body?: string;
      url?: string;
    };

    if (!userId || !title || !message) {
      return new Response("Missing userId, title, or body.", { status: 400 });
    }

    const result = await ctx.runAction(internal.pushNotifications.sendPushToUser, {
      userId,
      title,
      body: message,
      url,
    });

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),
});

export default http;
