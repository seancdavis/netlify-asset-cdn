import { getDeployStore } from "@netlify/blobs";
import type { APIRoute } from "astro";
import { db } from "../../../../db/index";

export const GET: APIRoute = async ({ params }) => {
  const blob_key = params.blob_key;
  if (!blob_key) {
    return new Response("Not found", { status: 404 });
  }

  // Find the file in the database
  const file = await db.query.uploads.findFirst({
    where: (u, { eq }) => eq(u.blob_key, blob_key),
  });
  if (!file) {
    return new Response("Not found", { status: 404 });
  }

  // Only serve if the file is an image
  if (!/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(file.filename)) {
    return new Response("Not found", { status: 404 });
  }

  const store = getDeployStore("uploads");
  // Use streaming for best compatibility
  const imageStream = await store.get(blob_key, { type: "stream" });
  if (!imageStream) {
    return new Response("Not found", { status: 404 });
  }

  // Guess content type from filename
  const ext = file.filename.split(".").pop()?.toLowerCase();
  const typeMap: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    bmp: "image/bmp",
    svg: "image/svg+xml",
  };
  const contentType =
    ext && typeMap[ext] ? typeMap[ext] : "application/octet-stream";

  return new Response(imageStream, {
    headers: { "Content-Type": contentType },
  });
};
