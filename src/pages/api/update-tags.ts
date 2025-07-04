import type { APIRoute } from "astro";
import { eq } from "drizzle-orm";
import { db } from "../../../db/index";
import { uploads } from "../../../db/schema";

export const POST: APIRoute = async ({ request }) => {
  try {
    const { blob_key, tags } = await request.json();

    if (!blob_key) {
      return new Response(JSON.stringify({ error: "blob_key is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Update the tags in the database
    await db
      .update(uploads)
      .set({ tags: tags || "" })
      .where(eq(uploads.blob_key, blob_key));

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating tags:", error);
    return new Response(JSON.stringify({ error: "Failed to update tags" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
