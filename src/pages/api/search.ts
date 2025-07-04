import type { APIRoute } from "astro";
import { ilike } from "drizzle-orm";
import { db } from "../../../db/index";
import { uploads } from "../../../db/schema";

export const GET: APIRoute = async ({ url }) => {
  try {
    const searchParams = new URL(url).searchParams;
    const query = searchParams.get("q");

    if (!query || query.trim() === "") {
      return new Response(JSON.stringify({ files: [] }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // Search for files with filename containing the query (case-insensitive)
    const results = await db
      .select()
      .from(uploads)
      .where(ilike(uploads.filename, `%${query}%`))
      .limit(100);

    return new Response(JSON.stringify({ files: results }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Search error:", error);
    return new Response(JSON.stringify({ error: "Search failed" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
