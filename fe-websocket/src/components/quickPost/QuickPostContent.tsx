import React from 'react';
import { X } from 'lucide-react';
import { Loader2 } from 'lucide-react';

interface QuickPostContentProps {
  postContent: string;
  setPostContent: (content: string) => void;
  images: string[];
  setImages: (images: string[]) => void;
  onRemoveImage: (index: number) => void;
  isUploading: boolean;
}

export default function QuickPostContent({
  postContent,
  setPostContent,
  images,
  onRemoveImage,
  isUploading
}: QuickPostContentProps) {
  return (
    <div className="space-y-4">
      {/* Textarea */}
      <textarea
        value={postContent}
        onChange={(e) => setPostContent(e.target.value)}
        placeholder="Bạn đang nghĩ gì thế?"
        className="w-full min-h-[100px] p-2 rounded-lg bg-transparent border border-[#DBDBDB] dark:border-[#262626] focus:outline-none focus:ring-2 focus:ring-[#DD2A7B] resize-none"
      />

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {images.map((image, index) => (
            <div key={index} className="relative aspect-square">
              <img
                src={image}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                onClick={() => onRemoveImage(index)}
                className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Uploading Indicator */}
      {isUploading && (
        <div className="flex items-center justify-center space-x-2 text-[#8E8E8E]">
          <Loader2 className="animate-spin" size={16} />
          <span>Đang tải lên ảnh...</span>
        </div>
      )}
    </div>
  );
} 