import { Clipboard, Download, Edit2, Eye, File, Save, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import type { Upload } from "../types";
import TagInput from "./TagInput";

interface AssetItemProps {
  file: Upload;
  onTagsUpdate?: (blobKey: string, tags: string) => void;
}

const AssetItem: React.FC<AssetItemProps> = ({ file, onTagsUpdate }) => {
  const [copied, setCopied] = useState(false);
  const [isEditingTags, setIsEditingTags] = useState(false);
  const [currentTags, setCurrentTags] = useState(file.tags || "");
  const tagInputRef = useRef<HTMLInputElement>(null);

  // Helper to check if a file is an image
  const isImage = (filename: string) => {
    return /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(filename);
  };

  const isViewableInBrowser = (filename: string) => {
    return /\.(jpg|jpeg|png|gif|webp|bmp|svg|pdf|txt|md|csv)$/i.test(filename);
  };

  const handleCopyLink = () => {
    const origin = window.location.origin;
    const path = isImage(file.filename)
      ? `/i/${file.blob_key}`
      : `/u/${file.blob_key}`;
    const url = origin + path;
    navigator.clipboard.writeText(url);

    // Show feedback
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const handleSaveTags = async () => {
    if (onTagsUpdate) {
      await onTagsUpdate(file.blob_key, currentTags);
    }
    setIsEditingTags(false);
  };

  const handleCancelEdit = () => {
    setCurrentTags(file.tags || "");
    setIsEditingTags(false);
  };

  const handleStartEdit = () => {
    setIsEditingTags(true);
  };

  const handleTagClick = (tag: string) => {
    // Navigate to search page with tag-specific query
    window.location.href = `/search?q=tag:${encodeURIComponent(tag)}`;
  };

  // Focus the input when editing starts
  useEffect(() => {
    if (isEditingTags && tagInputRef.current) {
      // Small delay to ensure the input is rendered
      setTimeout(() => {
        tagInputRef.current?.focus();
      }, 100);
    }
  }, [isEditingTags]);

  const tagArray = file.tags
    ? file.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag)
    : [];

  return (
    <li className="flex items-start gap-4 bg-white p-4 rounded shadow border border-gray-200">
      {isImage(file.filename) ? (
        <img
          src={`/api/upload/${file.blob_key}`}
          alt={file.filename}
          className="w-16 h-16 object-cover rounded"
        />
      ) : (
        <span className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded text-gray-400">
          <File className="w-8 h-8" />
        </span>
      )}
      <div className="flex-1">
        <div className="font-medium">{file.filename}</div>
        <div className="text-xs text-gray-500">
          Uploaded at {new Date(file.uploaded_at).toLocaleString()}
        </div>

        {/* Tags Section */}
        <div className="mt-2">
          {isEditingTags ? (
            <div className="space-y-2">
              <TagInput
                ref={tagInputRef}
                tags={currentTags}
                onTagsChange={setCurrentTags}
                placeholder="Add tags..."
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSaveTags}
                  className="inline-flex items-center gap-1 text-green-700 text-sm font-medium hover:underline">
                  <Save size={14} />
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="inline-flex items-center gap-1 text-gray-600 text-sm font-medium hover:underline">
                  <X size={14} />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {tagArray.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {tagArray.map((tag, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleTagClick(tag)}
                      className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full hover:bg-blue-200 transition-colors cursor-pointer"
                      title={`Search for files tagged with "${tag}"`}>
                      {tag}
                    </button>
                  ))}
                </div>
              ) : (
                <span className="text-gray-400 text-sm">No tags</span>
              )}
              <button
                type="button"
                onClick={handleStartEdit}
                className="inline-flex items-center gap-1 text-blue-700 text-sm font-medium hover:underline">
                <Edit2 size={14} />
                Edit
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-6 mt-2">
          <a
            href={`/api/download/${file.blob_key}`}
            download
            className="inline-flex items-center gap-1 text-blue-700 hover:underline text-sm font-medium transition">
            <Download size={16} /> Download
          </a>
          {isImage(file.filename) && (
            <a
              href={`/playground/${file.blob_key}`}
              className="inline-flex items-center gap-1 text-blue-700 text-sm font-medium transition cursor-pointer hover:underline">
              <Eye size={16} />
              <span>Playground</span>
            </a>
          )}
          {isViewableInBrowser(file.filename) && (
            <button
              type="button"
              className="inline-flex items-center gap-1 text-blue-700 text-sm font-medium transition cursor-pointer"
              onClick={handleCopyLink}>
              <Clipboard size={16} />
              <span className="hover:underline">Copy Link</span>
              {copied && (
                <span className="ml-2 text-green-600 text-xs no-underline">
                  Copied!
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </li>
  );
};

export default AssetItem;
