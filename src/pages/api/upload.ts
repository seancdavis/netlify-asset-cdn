import type { APIRoute } from "astro";
import { getDeployStore } from "@netlify/blobs";

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const file = formData.get("file");

  // Get the origin from the request URL
  const url = new URL(request.url);
  const origin = url.origin;

  if (!file || !(file instanceof Blob)) {
    return Response.redirect(`${origin}/?upload=error`, 303);
  }

  // Use the original filename if available, otherwise generate a key
  const filename = (file as any).name || `upload-${Date.now()}`;

  try {
    const store = getDeployStore("uploads");
    await store.set(filename, file);
    return Response.redirect(`${origin}/?upload=success`, 303);
  } catch (err) {
    return Response.redirect(`${origin}/?upload=error`, 303);
  }
};
