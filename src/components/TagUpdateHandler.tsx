import React from "react";
import type { Upload } from "../types";
import AssetList from "./AssetList";

interface TagUpdateHandlerProps {
  files: Upload[];
  emptyMessage?: string;
  emptySubMessage?: string;
}

const TagUpdateHandler: React.FC<TagUpdateHandlerProps> = ({
  files,
  emptyMessage,
  emptySubMessage,
}) => {
  const handleTagsUpdate = async (blobKey: string, tags: string) => {
    try {
      const response = await fetch("/api/update-tags", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ blob_key: blobKey, tags }),
      });

      if (!response.ok) {
        throw new Error("Failed to update tags");
      }

      // Refresh the page to show updated tags
      window.location.reload();
    } catch (error) {
      console.error("Error updating tags:", error);
      alert("Failed to update tags. Please try again.");
    }
  };

  return (
    <AssetList
      files={files}
      emptyMessage={emptyMessage}
      emptySubMessage={emptySubMessage}
      onTagsUpdate={handleTagsUpdate}
    />
  );
};

export default TagUpdateHandler;
