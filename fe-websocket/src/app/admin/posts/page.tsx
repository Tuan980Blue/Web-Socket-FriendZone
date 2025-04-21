'use client'

import { useState } from 'react';
import Image from 'next/image';
import {
  Search,
  MoreVertical,
  Eye,
  EyeOff,
  Trash2,
  Filter,
  Video
} from 'lucide-react';

// Mock data - Replace with actual API calls
const mockPosts: Post[] = [
  {
    id: 1,
    image: 'https://picsum.photos/400/300?random=1',
    type: 'image' as const,
    caption: 'Beautiful sunset at the beach',
    author: {
      id: 1,
      username: 'john_doe',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    },
    likes: 123,
    comments: 45,
    createdAt: '2024-03-15',
    status: 'visible' as const,
  },
  {
    id: 2,
    image: 'https://picsum.photos/400/300?random=2',
    type: 'video' as const,
    caption: 'Check out this amazing video!',
    author: {
      id: 2,
      username: 'jane_smith',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
    },
    likes: 89,
    comments: 12,
    createdAt: '2024-03-14',
    status: 'hidden' as const,
  },
  // Add more mock posts as needed
];

type Post = {
  id: number;
  image: string;
  type: 'image' | 'video';
  caption: string;
  author: {
    id: number;
    username: string;
    avatar: string;
  };
  likes: number;
  comments: number;
  createdAt: string;
  status: 'visible' | 'hidden';
};

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [filter, setFilter] = useState<'all' | 'visible' | 'hidden'>('all');

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.caption.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || post.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleToggleVisibility = (postId: number) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, status: post.status === 'visible' ? 'hidden' : 'visible' }
        : post
    ));
  };

  const handleDeletePost = (postId: number) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      setPosts(posts.filter(post => post.id !== postId));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Posts</h1>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search posts..."
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
            onChange={(e) => setFilter(e.target.value as 'all' | 'visible' | 'hidden')}
          >
            <option value="all">All Posts</option>
            <option value="visible">Visible</option>
            <option value="hidden">Hidden</option>
          </select>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
          >
            <div className="relative aspect-square">
              <Image
                src={post.image}
                alt={post.caption}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {post.type === 'video' && (
                <div className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1">
                  <Video size={20} className="text-white" />
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                <div className="flex items-center text-white">
                  <Image
                    src={post.author.avatar}
                    alt={post.author.username}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <span className="ml-2 text-sm font-medium">
                    {post.author.username}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-900 dark:text-white line-clamp-2">
                {post.caption}
              </p>
              <div className="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-4">
                  <span>{post.likes} likes</span>
                  <span>{post.comments} comments</span>
                </div>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => setSelectedPost(post)}
                  className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <Eye size={20} />
                </button>
                <button
                  onClick={() => handleToggleVisibility(post.id)}
                  className={`${
                    post.status === 'visible'
                      ? 'text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300'
                      : 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'
                  }`}
                >
                  {post.status === 'visible' ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                <button
                  onClick={() => handleDeletePost(post.id)}
                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Post Details Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Post Details
              </h2>
              <button
                onClick={() => setSelectedPost(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <MoreVertical size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="relative aspect-video">
                <Image
                  src={selectedPost.image}
                  alt={selectedPost.caption}
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {selectedPost.type === 'video' && (
                  <div className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1">
                    <Video size={20} className="text-white" />
                  </div>
                )}
              </div>
              <div className="flex items-center">
                <Image
                  src={selectedPost.author.avatar}
                  alt={selectedPost.author.username}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {selectedPost.author.username}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(selectedPost.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className="text-gray-900 dark:text-white">
                {selectedPost.caption}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span>{selectedPost.likes} likes</span>
                <span>{selectedPost.comments} comments</span>
                <span className={`px-2 py-1 rounded-full ${
                  selectedPost.status === 'visible'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {selectedPost.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 