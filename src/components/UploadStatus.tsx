import React, { useState } from "react";

type UploadStatusProps = {
  status?: "success" | "error";
};

const UploadStatus: React.FC<UploadStatusProps> = ({ status }) => {
  const [visible, setVisible] = useState(true);
  if (!visible || !status) return null;
  return (
    <div
      className={`relative pointer-events-auto mb-4 px-4 py-2 rounded flex items-center gap-2 shadow ${
        status === "success"
          ? "bg-green-100 text-green-800 border border-green-300"
          : "bg-red-100 text-red-800 border border-red-300"
      }`}>
      <span>
        {status === "success"
          ? "File uploaded successfully!"
          : "Failed to upload file."}
      </span>
      <button
        type="button"
        className={`ml-2 text-lg font-bold cursor-pointer ${
          status === "success"
            ? "text-green-800 hover:text-green-900"
            : "text-red-800 hover:text-red-900"
        }`}
        aria-label="Close"
        onClick={() => setVisible(false)}>
        &times;
      </button>
    </div>
  );
};

export default UploadStatus;
