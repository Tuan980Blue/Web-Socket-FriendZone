'use client'

import { useState } from 'react';
import Image from 'next/image';
import {
  Search,
  Filter,
  Image as ImageIcon,
  Video,
  Trash2,
  Download,
  Calendar,
  HardDrive
} from 'lucide-react';

// Mock data - Replace with actual API calls
const mockMedia = [
  {
    id: 1,
    url: 'https://picsum.photos/400/300?random=1',
    type: 'image' as const,
    caption: 'Beautiful sunset at the beach',
    author: {
      id: 1,
      username: 'john_doe',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    },
    size: 2.5,
    createdAt: '2024-03-15',
  },
  {
    id: 2,
    url: 'https://picsum.photos/400/300?random=2',
    type: 'video' as const,
    caption: 'Check out this amazing video!',
    author: {
      id: 2,
      username: 'jane_smith',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
    },
    size: 15.8,
    createdAt: '2024-03-14',
  },
  // Add more mock media as needed
];

type Media = {
  id: number;
  url: string;
  type: 'image' | 'video';
  caption: string;
  author: {
    id: number;
    username: string;
    avatar: string;
  };
  size: number;
  createdAt: string;
};

export default function MediaPage() {
  const [media, setMedia] = useState<Media[]>(mockMedia);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'image' | 'video'>('all');
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);

  const filteredMedia = media.filter(item => {
    const matchesSearch = 
      item.caption.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.author.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || item.type === filter;
    return matchesSearch && matchesFilter;
  });

  const handleDeleteMedia = (mediaId: number) => {
    if (window.confirm('Are you sure you want to delete this media?')) {
      setMedia(media.filter(item => item.id !== mediaId));
    }
  };

  const formatFileSize = (size: number) => {
    if (size < 1024) {
      return `${size.toFixed(1)} MB`;
    }
    return `${(size / 1024).toFixed(1)} GB`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Media Manager</h1>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <HardDrive size={20} />
          <span>Total Storage: {formatFileSize(media.reduce((acc, item) => acc + item.size, 0))}</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search media..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg">
          <Filter size={20} className="text-gray-400" />
          <select
            className="bg-transparent focus:outline-none"
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'image' | 'video')}
          >
            <option value="all">All Media</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
          </select>
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMedia.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden group"
          >
            <div className="relative aspect-square">
              <Image
                src={item.url}
                alt={item.caption}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {item.type === 'video' && (
                <div className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1">
                  <Video size={20} className="text-white" />
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity">
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedMedia(item)}
                      className="p-2 bg-white rounded-full hover:bg-gray-100"
                    >
                      <ImageIcon size={20} className="text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDeleteMedia(item.id)}
                      className="p-2 bg-white rounded-full hover:bg-gray-100"
                    >
                      <Trash2 size={20} className="text-red-600" />
                    </button>
                    <a
                      href={item.url}
                      download
                      className="p-2 bg-white rounded-full hover:bg-gray-100"
                    >
                      <Download size={20} className="text-gray-600" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center">
                <Image
                  src={item.author.avatar}
                  alt={item.author.username}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.author.username}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-900 dark:text-white line-clamp-2">
                {item.caption}
              </p>
              <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                <HardDrive size={14} className="mr-1" />
                {formatFileSize(item.size)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Media Details Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full">
            <div className="space-y-6">
              <div className="relative aspect-video">
                <Image
                  src={selectedMedia.url}
                  alt={selectedMedia.caption}
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {selectedMedia.type === 'video' && (
                  <div className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1">
                    <Video size={20} className="text-white" />
                  </div>
                )}
              </div>
              <div className="flex items-center">
                <Image
                  src={selectedMedia.author.avatar}
                  alt={selectedMedia.author.username}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {selectedMedia.author.username}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Calendar size={14} className="mr-1" />
                    {new Date(selectedMedia.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Caption
                </h3>
                <p className="text-gray-900 dark:text-white">
                  {selectedMedia.caption}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <HardDrive size={16} className="mr-1" />
                  {formatFileSize(selectedMedia.size)}
                </div>
                <div className="flex gap-2">
                  <a
                    href={selectedMedia.url}
                    download
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    Download
                  </a>
                  <button
                    onClick={() => handleDeleteMedia(selectedMedia.id)}
                    className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 