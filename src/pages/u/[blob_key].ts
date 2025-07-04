import { getDeployStore } from "@netlify/blobs";
import type { APIRoute } from "astro";
import { db } from "../../../db/index";

// List of extensions that can be viewed inline in the browser
const VIEWABLE_EXTENSIONS = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "bmp",
  "svg",
  "pdf",
  "txt",
  "md",
  "csv",
];

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
};

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

  // Only serve if the file is viewable in the browser
  const ext = file.filename.split(".").pop()?.toLowerCase();
  if (!ext || !VIEWABLE_EXTENSIONS.includes(ext)) {
    return new Response("Not found", { status: 404 });
  }

  const store = getDeployStore("uploads");
  // Use streaming for best compatibility
  const fileStream = await store.get(blob_key, { type: "stream" });
  if (!fileStream) {
    return new Response("Not found", { status: 404 });
  }

  const contentType = typeMap[ext] || "application/octet-stream";

  return new Response(fileStream, {
    headers: {
      "Content-Type": contentType,
      // Inline display in browser
      "Content-Disposition": `inline; filename=\"${file.filename}\"`,
    },
  });
};
