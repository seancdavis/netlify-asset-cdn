import { Plus, X } from "lucide-react";
import React, { forwardRef, useState } from "react";

interface TagInputProps {
  tags: string;
  onTagsChange: (tags: string) => void;
  placeholder?: string;
}

const TagInput = forwardRef<HTMLInputElement, TagInputProps>(
  ({ tags, onTagsChange, placeholder = "Add tags..." }, ref) => {
    const [inputValue, setInputValue] = useState("");

    const tagArray = tags
      ? tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag)
      : [];

    const handleAddTag = () => {
      const newTag = inputValue.trim();
      if (newTag && !tagArray.includes(newTag)) {
        const newTags = [...tagArray, newTag];
        onTagsChange(newTags.join(", "));
        setInputValue("");
      }
    };

    const handleRemoveTag = (tagToRemove: string) => {
      const newTags = tagArray.filter((tag) => tag !== tagToRemove);
      onTagsChange(newTags.join(", "));
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        handleAddTag();
      }
    };

    return (
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          {tagArray.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="text-blue-600 hover:text-blue-800">
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            ref={ref}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="flex-1 text-sm border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="button"
            onClick={handleAddTag}
            disabled={!inputValue.trim()}
            className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1">
            <Plus size={14} />
            Add
          </button>
        </div>
      </div>
    );
  }
);

TagInput.displayName = "TagInput";

export default TagInput;
