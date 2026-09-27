import { getStore } from "@netlify/blobs";

const store = getStore("annivercard-media");

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}

export default async (req, context) => {
  const key = context.params?.key || "";

  if (!key || !/^[A-Za-z0-9_-]{6,80}$/.test(key)) {
    return json({ error: "Invalid media key" }, 400);
  }

  if (req.method === "POST") {
    const mime = req.headers.get("content-type") || "application/octet-stream";
    const data = await req.arrayBuffer();

    if (!data || data.byteLength === 0) {
      return json({ error: "Empty media" }, 400);
    }

    if (data.byteLength > 20 * 1024 * 1024) {
      return json({ error: "Media file is too large" }, 413);
    }

    await store.set(key, data, {
      metadata: {
        contentType: mime
      }
    });

    return json({ ok: true, key });
  }

  if (req.method === "GET") {
    const entry = await store.getWithMetadata(key, {
      type: "arrayBuffer"
    });

    if (!entry) {
      return new Response("Media not found", {
        status: 404,
        headers: {
          "content-type": "text/plain; charset=utf-8"
        }
      });
    }

    const contentType =
      entry.metadata?.contentType || "application/octet-stream";

    return new Response(entry.data, {
      status: 200,
      headers: {
        "content-type": contentType,
        "cache-control": "public, max-age=31536000, immutable"
      }
    });
  }

  return json({ error: "Method not allowed" }, 405);
};

export const config = {
  path: "/api/media/:key"
};
