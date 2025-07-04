import { Clipboard, Download, Eye, File } from "lucide-react";
import React, { useState } from "react";
import type { Upload } from "../types";

interface AssetItemProps {
  file: Upload;
}

const AssetItem: React.FC<AssetItemProps> = ({ file }) => {
  const [copied, setCopied] = useState(false);

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

  return (
    <li className="flex items-center gap-4 bg-white p-4 rounded shadow border border-gray-200">
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
  );
};

export default AssetItem;
