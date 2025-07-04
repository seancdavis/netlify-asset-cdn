import { Clipboard, Download, Eye, File } from "lucide-react";
import React, { useState } from "react";
import type { Upload } from "../types";

interface AssetListProps {
  files: Upload[];
  emptyMessage?: string;
  emptySubMessage?: string;
}

const AssetList: React.FC<AssetListProps> = ({
  files,
  emptyMessage = "No files found",
  emptySubMessage = "Try a different search term",
}) => {
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  // Helper to check if a file is an image
  const isImage = (filename: string) => {
    return /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(filename);
  };

  const isViewableInBrowser = (filename: string) => {
    return /\.(jpg|jpeg|png|gif|webp|bmp|svg|pdf|txt|md|csv)$/i.test(filename);
  };

  const handleCopyLink = (blobKey: string, isImage: boolean) => {
    const origin = window.location.origin;
    const path = isImage ? `/i/${blobKey}` : `/u/${blobKey}`;
    const url = origin + path;
    navigator.clipboard.writeText(url);

    // Show feedback
    setCopiedStates((prev) => ({ ...prev, [blobKey]: true }));
    setTimeout(() => {
      setCopiedStates((prev) => ({ ...prev, [blobKey]: false }));
    }, 1200);
  };

  if (files.length === 0) {
    return (
      <li className="text-gray-500 bg-white p-8 rounded shadow border border-gray-200 text-center">
        <File className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>{emptyMessage}</p>
        <p className="text-sm text-gray-400 mt-2">{emptySubMessage}</p>
      </li>
    );
  }

  return (
    <>
      {files.map((file: Upload, index: number) => (
        <li
          key={file.blob_key}
          className={`flex items-center gap-4 bg-white p-4 rounded shadow border border-gray-200 ${
            index > 0 ? "mt-4" : ""
          }`}>
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
          <div>
            <div className="font-medium">{file.filename}</div>
            <div className="text-xs text-gray-500">
              Uploaded at {new Date(file.uploaded_at).toLocaleString()}
            </div>
            <div className="flex items-center gap-6 mt-2">
              <a
                href={`/api/download/${file.blob_key}`}
                download
                className="inline-flex items-center gap-1 text-blue-700 hover:underline text-sm font-medium transition">
                <Download size={16} /> Download
              </a>
              {isViewableInBrowser(file.filename) && (
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-blue-700 text-sm font-medium transition copy-link-btn cursor-pointer"
                  onClick={() =>
                    handleCopyLink(file.blob_key, isImage(file.filename))
                  }>
                  <Clipboard size={16} />
                  <span className="hover:underline">Copy Link</span>
                  {copiedStates[file.blob_key] && (
                    <span className="ml-2 text-green-600 text-xs no-underline">
                      Copied!
                    </span>
                  )}
                </button>
              )}
              {isImage(file.filename) && (
                <a
                  href={`/playground/${file.blob_key}`}
                  className="inline-flex items-center gap-1 text-blue-700 text-sm font-medium transition cursor-pointer hover:underline">
                  <Eye size={16} />
                  <span>Playground</span>
                </a>
              )}
            </div>
          </div>
        </li>
      ))}
    </>
  );
};

export default AssetList;
