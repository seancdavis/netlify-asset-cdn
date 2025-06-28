import React, { useEffect } from "react";

type UploadModalProps = {
  open: boolean;
  onClose: () => void;
};

const UploadModal: React.FC<UploadModalProps> = ({ open, onClose }) => {
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}></div>
      <div className="relative bg-white rounded-lg shadow-lg p-8 w-full max-w-md z-10">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl cursor-pointer"
          type="button"
          aria-label="Close"
          onClick={onClose}>
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4">Upload a File</h2>
        <form
          action="/api/upload"
          method="post"
          encType="multipart/form-data"
          className="flex flex-col gap-4">
          <label htmlFor="file" className="font-medium text-gray-700">
            Select file:
          </label>
          <input
            type="file"
            id="file"
            name="file"
            required
            className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition">
            Upload
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;
