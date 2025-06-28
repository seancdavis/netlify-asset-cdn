import React, { useState } from "react";
import { Upload } from "lucide-react";
import UploadModal from "./UploadModal";

const Header: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <header className="w-full bg-white shadow flex items-center justify-between px-6 py-3">
        <a
          href="/"
          className="flex items-center gap-2 text-blue-700 font-bold text-xl">
          <img src="/favicon.svg" alt="Logo" className="w-8 h-8" />
          Asset CDN
        </a>
        <button
          type="button"
          className="flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition cursor-pointer"
          onClick={() => setModalOpen(true)}>
          <Upload size={18} /> Upload
        </button>
      </header>
      <UploadModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default Header;
