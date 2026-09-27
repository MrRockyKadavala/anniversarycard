import { getStore } from "@netlify/blobs";

const store = getStore("annivercard-cards");

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

  if (!id || !/^[A-Za-z0-9]{7}$/.test(id)) {
    return json({ error: "Invalid card id" }, 400);
  }

  if (req.method === "GET") {
    const card = await store.get(id, { type: "json" });

    if (!card) {
      return json({ error: "Card not found" }, 404);
    }

    return json(card);
  }

  if (req.method === "POST") {
    const body = await req.json().catch(() => null);

    if (!body || !body.payload) {
      return json({ error: "Missing payload" }, 400);
    }

    const serialized = JSON.stringify(body.payload);

    if (serialized.length > 900000) {
      return json({ error: "Card data is too large" }, 413);
    }

    await store.setJSON(id, body.payload, {
      metadata: {
        template: "anniversary"
      }
    });

    return json({ ok: true, id });
  }

  return json({ error: "Method not allowed" }, 405);
};

export const config = {
  path: "/api/cards/:id"
};
