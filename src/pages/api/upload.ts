import { getDeployStore } from "@netlify/blobs";
import type { APIRoute } from "astro";
import { db } from "../../../db/index";
import { uploads } from "../../../db/schema";

// Simple UUID v4 generator
function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const file = formData.get("file");
  const tags = (formData.get("tags") as string) || "";

  // Get the origin from the request URL
  const url = new URL(request.url);
  const origin = url.origin;

  if (!file || !(file instanceof Blob)) {
    return Response.redirect(`${origin}/?upload=error`, 303);
  }

  // Use the original filename if available, otherwise generate a fallback
  const filename = (file as any).name || `upload-${Date.now()}`;
  // Generate a unique blob key
  const blobKey = uuidv4();

  try {
    const store = getDeployStore("uploads");
    await store.set(blobKey, file);
    // Store a record in the database
    await db.insert(uploads).values({
      filename,
      blob_key: blobKey,
      tags: tags.trim(),
    });
    return Response.redirect(`${origin}/?upload=success`, 303);
  } catch (err) {
    return Response.redirect(`${origin}/?upload=error`, 303);
  }
};
