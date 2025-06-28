import type { APIRoute } from "astro";
import { getDeployStore } from "@netlify/blobs";
import { db } from "../../../../db/index";
import { uploads } from "../../../../db/schema";

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

  const store = getDeployStore("uploads");
  // Use streaming for best compatibility
  const fileStream = await store.get(blob_key, { type: "stream" });
  if (!fileStream) {
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
    pdf: "application/pdf",
    txt: "text/plain",
    md: "text/markdown",
    csv: "text/csv",
    json: "application/json",
    zip: "application/zip",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  };
  const contentType =
    ext && typeMap[ext] ? typeMap[ext] : "application/octet-stream";

  return new Response(fileStream, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${file.filename}"`,
    },
  });
};
