import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
// import { auth } from "./lib/auth";

const app = new Hono();

export const customLogger = (message: string, ...rest: string[]) => {
  console.log(`[${new Date().toISOString()}] ${message}`, ...rest)
}

app.use(logger(customLogger))


app.use("/api/proxy/*", cors({
  origin: process.env.CORS_ORIGIN?.split(",").map((origin) => origin.trim()) || ["http://localhost:3000"],
}));

// app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

app.get(
  "/",
  (c) => c.text("ok", {
    headers: {
      "Content-Type": "text/plain",
    },
  })
);

app.get("/api/proxy/*", async (c) => {
  const incomingUrl = c.req.url;

  const parts = incomingUrl.split("/").slice(5);

  const completeUrl = parts
    .map((part) => (part === "https:" ? part + "//" : part + "/"))
    .join("");

  const sanitizedUrl = new URL(decodeURIComponent(completeUrl));

  if (sanitizedUrl.host === "thunderstrike77.online") {
    sanitizedUrl.host = "haildrop77.pro";
  }

  // const origin = c.req.header("Origin");
  // const userAgent = c.req.header("User-Agent");
  // const accept = c.req.header("Accept");


  const res = await fetch(sanitizedUrl, {
    method: "GET",
    keepalive: true,
    verbose: true,
    redirect: "follow",
    headers: {
      origin: "localhost",
      accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng",
      "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
      Referer: "https://megacloud.blog/",
    },
  });

  if (!res.ok) {
    return new Response(
      JSON.stringify({ error: res.status, message: res.statusText }),
      {
        status: res.status,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  if (!res.body) {
    return new Response("No body in response", { status: 500 });
  }

  return new Response(res.body, {
    status: res.status,
    headers: {
      "Content-Type":
        res.headers.get("Content-Type") || "application/octet-stream",
      "Cache-Control": "private, max-age=3600",
    },
  });
});

export default {
  port: process.env.PORT || 3001,
  fetch: app.fetch,
};
