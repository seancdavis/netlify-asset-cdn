import { Search, Upload } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import UploadModal from "./UploadModal";

const Header: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Get initial search query from URL if on search page
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get("q");
    if (query) {
      setSearchQuery(query);
    }
  }, []);

  // Keyboard shortcut: slash key focuses search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger if not already typing in an input
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(
        searchQuery.trim()
      )}`;
    }
  };

  return (
    <>
      <header className="w-full bg-white shadow flex items-center justify-between px-6 py-3">
        <a
          href="/"
          className="flex items-center gap-2 text-blue-700 font-bold text-xl">
          <img src="/favicon.svg" alt="Logo" className="w-8 h-8" />
          Asset CDN
        </a>

        <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4">
          <div className="relative">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              title="Press / to focus"
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
          </div>
        </form>

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
