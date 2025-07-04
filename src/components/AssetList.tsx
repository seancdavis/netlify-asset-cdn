import { File } from "lucide-react";
import React from "react";
import type { Upload } from "../types";
import AssetItem from "./AssetItem";

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
        <div key={file.blob_key} className={index > 0 ? "mt-4" : ""}>
          <AssetItem file={file} />
        </div>
      ))}
    </>
  );
};

export default AssetList;
