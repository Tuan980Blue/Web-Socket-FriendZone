'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, MapPin, Eye } from 'lucide-react';
import { formatRelativeTime, formatNumber, formatTextWithHighlights } from '@/utils/formatUtils';
import { Post } from '@/data/mockPosts';
import { mockComments } from '@/data/mockPosts';

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onSave?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onComment?: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  onLike, 
  onSave, 
  onShare, 
  onComment 
}) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Get comments for this post
  const postComments = mockComments.filter(comment => comment.postId === post.id);
  
  const handleLike = () => {
    if (onLike) onLike(post.id);
  };
  
  const handleSave = () => {
    if (onSave) onSave(post.id);
  };
  
  const handleShare = () => {
    if (onShare) onShare(post.id);
  };
  
  const handleComment = () => {
    if (onComment) onComment(post.id);
    setShowComments(!showComments);
  };
  
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      // In a real app, this would send the comment to the server
      console.log('Submitting comment:', commentText);
      setCommentText('');
    }
  };
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % post.images.length);
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + post.images.length) % post.images.length);
  };

  return (
    <div className="bg-white dark:bg-[#121212] rounded-xl shadow-md overflow-hidden mb-6 border border-gray-200 dark:border-gray-800">
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href={`/profile/${post.author.username}`} className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full overflow-hidden relative">
              <Image 
                src={post.author.avatar} 
                alt={post.author.fullName}
                fill
                className="object-cover"
              />
            </div>
          </Link>
          <div>
            <Link href={`/profile/${post.author.username}`} className="font-semibold hover:underline">
              {post.author.username}
            </Link>
            {post.location && (
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <MapPin size={12} className="mr-1" />
                <span>{post.location}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center">
          <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">
            {formatRelativeTime(post.createdAt)}
          </span>
          <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>
      
      {/* Post Images */}
      {post.images.length > 0 && (
        <div className="relative">
          <div className="relative w-full max-h-[400px] overflow-hidden bg-gray-100 dark:bg-gray-900">
            <div className="aspect-square w-full max-w-xl mx-auto px-4 sm:px-6 md:px-8 flex items-center justify-center">
              <Image 
                src={post.images[currentImageIndex]} 
                alt="Post image"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={currentImageIndex === 0}
                className="object-contain transition-opacity duration-300 ease-in-out"
                onLoadingComplete={(img) => {
                  img.classList.add('opacity-100');
                  img.classList.remove('opacity-0');
                }}
              />
            </div>
            
            {/* Image Navigation Dots */}
            {post.images.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10">
                {post.images.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentImageIndex 
                        ? 'bg-white scale-125' 
                        : 'bg-white/50 hover:bg-white/70'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            )}
            
            {/* Image Navigation Arrows */}
            {post.images.length > 1 && (
              <>
                <button 
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300 z-10"
                  onClick={prevImage}
                  aria-label="Previous image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>
                <button 
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300 z-10"
                  onClick={nextImage}
                  aria-label="Next image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </>
            )}
            
            {/* Image Counter */}
            {post.images.length > 1 && (
              <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded-full z-10">
                {currentImageIndex + 1}/{post.images.length}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Post Actions */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-4">
            <button 
              className={`p-1 rounded-full ${post.isLiked ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}`}
              onClick={handleLike}
              aria-label="Like post"
            >
              <Heart size={24} fill={post.isLiked ? 'currentColor' : 'none'} />
            </button>
            <button 
              className="p-1 rounded-full text-gray-700 dark:text-gray-300"
              onClick={handleComment}
              aria-label="Comment on post"
            >
              <MessageCircle size={24} />
            </button>
            <button 
              className="p-1 rounded-full text-gray-700 dark:text-gray-300"
              onClick={handleShare}
              aria-label="Share post"
            >
              <Share2 size={24} />
            </button>
          </div>
          <button 
            className={`p-1 rounded-full ${post.isSaved ? 'text-blue-500' : 'text-gray-700 dark:text-gray-300'}`}
            onClick={handleSave}
            aria-label="Save post"
          >
            <Bookmark size={24} fill={post.isSaved ? 'currentColor' : 'none'} />
          </button>
        </div>
        
        {/* Post Stats */}
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
          <span className="mr-4">{formatNumber(post.stats.likes)} likes</span>
          <span className="mr-4">{formatNumber(post.stats.comments)} comments</span>
          <span className="flex items-center">
            <Eye size={16} className="mr-1" />
            {formatNumber(post.stats.views)}
          </span>
        </div>
        
        {/* Post Content */}
        <div className="mb-2">
          <Link href={`/profile/${post.author.username}`} className="font-semibold mr-2 hover:underline">
            {post.author.username}
          </Link>
          <span>{formatTextWithHighlights(post.content)}</span>
        </div>
        
        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {post.tags.map((tag, index) => (
              <Link 
                key={index} 
                href={`/explore/tags/${tag.replace('#', '')}`}
                className="text-blue-500 hover:underline text-sm"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}
        
        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 border-t border-gray-200 dark:border-gray-800 pt-4">
            <h3 className="font-semibold mb-2">Comments</h3>
            
            {/* Comments List */}
            <div className="space-y-4 mb-4 max-h-60 overflow-y-auto">
              {postComments.map((comment) => (
                <div key={comment.id} className="flex">
                  <Link href={`/profile/${comment.author.username}`} className="flex-shrink-0 mr-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden relative">
                      <Image 
                        src={comment.author.avatar} 
                        alt={comment.author.fullName}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </Link>
                  <div className="flex-1">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2">
                      <Link href={`/profile/${comment.author.username}`} className="font-semibold hover:underline">
                        {comment.author.username}
                      </Link>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1 ml-2">
                      <span>{formatRelativeTime(comment.createdAt)}</span>
                      <button className="ml-2 hover:underline">Reply</button>
                      <button className="ml-2 hover:underline">Like</button>
                      {comment.likes > 0 && <span className="ml-2">{formatNumber(comment.likes)}</span>}
                    </div>
                    
                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="ml-6 mt-2 space-y-2">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex">
                            <Link href={`/profile/${reply.author.username}`} className="flex-shrink-0 mr-2">
                              <div className="w-6 h-6 rounded-full overflow-hidden relative">
                                <Image 
                                  src={reply.author.avatar} 
                                  alt={reply.author.fullName}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            </Link>
                            <div className="flex-1">
                              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2">
                                <Link href={`/profile/${reply.author.username}`} className="font-semibold hover:underline">
                                  {reply.author.username}
                                </Link>
                                <p className="text-sm">{reply.content}</p>
                              </div>
                              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1 ml-2">
                                <span>{formatRelativeTime(reply.createdAt)}</span>
                                <button className="ml-2 hover:underline">Reply</button>
                                <button className="ml-2 hover:underline">Like</button>
                                {reply.likes > 0 && <span className="ml-2">{formatNumber(reply.likes)}</span>}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Comment Input */}
            <form onSubmit={handleSubmitComment} className="flex items-center">
              <div className="w-8 h-8 rounded-full overflow-hidden relative flex-shrink-0 mr-2">
                <Image 
                  src="https://randomuser.me/api/portraits/men/1.jpg" 
                  alt="Your avatar"
                  fill
                  className="object-cover"
                />
              </div>
              <input
                type="text"
                placeholder="Add a comment..."
                className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button 
                type="submit"
                className="ml-2 text-blue-500 font-semibold text-sm"
                disabled={!commentText.trim()}
              >
                Post
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard; 