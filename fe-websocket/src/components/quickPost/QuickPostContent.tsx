import React from 'react';
import { Textarea } from '@mantine/core';

interface QuickPostContentProps {
  postContent: string;
  setPostContent: (content: string) => void;
  images: string[];
  setImages: (images: string[]) => void;
}

const QuickPostContent: React.FC<QuickPostContentProps> = ({
  postContent,
  setPostContent,
  images,
  setImages
}) => {
  return (
    <div className="space-y-4">
      <Textarea
        value={postContent}
        onChange={(e) => setPostContent(e.target.value)}
        placeholder="Bạn đang nghĩ gì thế?"
        minRows={3}
        maxRows={6}
        className="w-full"
      />

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {images.map((image, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
              <img
                src={image}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setImages(images.filter((_, i) => i !== index))}
                className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuickPostContent; 