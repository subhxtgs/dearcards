import { getStore } from "@netlify/blobs";

export default async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  try {
    const payload = await req.json();
    const store = getStore("letters");
    const id = crypto.randomUUID();
    await store.set(id, JSON.stringify(payload));

    return new Response(JSON.stringify({ id }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Could not save the letter." }), { status: 500 });
  }
};

export const config = { path: "/api/save" };
