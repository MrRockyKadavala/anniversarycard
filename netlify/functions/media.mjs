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
  const id = context.params?.id || "";

  if (!id || !/^[A-Za-z0-9_-]{20,80}$/.test(id)) {
    return json({ error: "Invalid media id" }, 400);
  }

  try {
    if (req.method === "POST") {
      const contentType = req.headers.get("content-type") || "application/octet-stream";
      const body = await req.arrayBuffer();

      if (!body || body.byteLength === 0) {
        return json({ error: "Empty media upload" }, 400);
      }

      // Keep individual uploads within a conservative serverless request size.
      if (body.byteLength > 20 * 1024 * 1024) {
        return json({ error: "Media file is larger than 20 MB" }, 413);
      }

      await store.set(id, body, {
        metadata: {
          contentType,
          size: String(body.byteLength)
        }
      });

      return json({ ok: true, id });
    }

    if (req.method === "GET") {
      const entry = await store.getWithMetadata(id, { type: "arrayBuffer" });

      if (!entry) {
        return json({ error: "Media not found" }, 404);
      }

      const contentType = entry.metadata?.contentType || "application/octet-stream";
      return new Response(entry.data, {
        status: 200,
        headers: {
          "content-type": contentType,
          "cache-control": "public, max-age=31536000, immutable"
        }
      });
    }

    return json({ error: "Method not allowed" }, 405);
  } catch (error) {
    console.error("AnniverCard media function error:", error);
    return json({
      error: "Media storage failed",
      detail: error?.message || String(error)
    }, 500);
  }
};

export const config = {
  path: "/api/media/:id"
};
