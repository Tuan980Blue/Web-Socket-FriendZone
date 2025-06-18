import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconX, IconUpload, IconMapPin, IconHash, IconAt, IconPalette, IconAlertCircle } from '@tabler/icons-react';
import { CreateStoryData } from '@/types/story';
import { uploadService } from '@/services/uploadService';

interface AddStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStory: (data: CreateStoryData) => void;
  isLoading?: boolean;
}

interface FileValidation {
  isValid: boolean;
  error?: string;
}

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
const ALLOWED_AUDIO_TYPES = ['audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a'];

const AddStoryModal: React.FC<AddStoryModalProps> = ({ isOpen, onClose, onAddStory, isLoading }) => {
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState<'IMAGE' | 'VIDEO' | 'AUDIO'>('IMAGE');
  const [location, setLocation] = useState('');
  const [filter, setFilter] = useState('');
  const [mentions, setMentions] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragAreaRef = useRef<HTMLDivElement>(null);

  // Validate file
  const validateFile = useCallback((file: File): FileValidation => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`
      };
    }

    // Check file type
    const allowedTypes = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES, ...ALLOWED_AUDIO_TYPES];
    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'File type not supported. Please use image, video, or audio files.'
      };
    }

    return { isValid: true };
  }, []);

  // Cleanup preview URL to prevent memory leaks
  const cleanupPreviewUrl = useCallback(() => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
  }, [previewUrl]);

  const handleFileSelect = useCallback(async (file: File) => {
    // Cleanup previous preview
    cleanupPreviewUrl();

    // Validate file
    const validation = validateFile(file);
    if (!validation.isValid) {
      setValidationErrors([validation.error!]);
      return;
    }

    setValidationErrors([]);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      // Auto-detect media type
      if (ALLOWED_IMAGE_TYPES.includes(file.type)) {
        setMediaType('IMAGE');
      } else if (ALLOWED_VIDEO_TYPES.includes(file.type)) {
        setMediaType('VIDEO');
      } else if (ALLOWED_AUDIO_TYPES.includes(file.type)) {
        setMediaType('AUDIO');
      }

      // Upload file to server and get real URL
      // For now, only upload images since backend only supports images
      if (ALLOWED_IMAGE_TYPES.includes(file.type)) {
        const uploadRes = await uploadService.uploadImage(file);
        setMediaUrl(uploadRes.secure_url);
        setIsUploading(false);
        setUploadProgress(100);
      } else {
        // For video/audio, just use blob URL for now
        setMediaUrl(url);
        setIsUploading(false);
        setUploadProgress(100);
        setValidationErrors(['Video and audio upload not supported yet. Please use images only.']);
      }
    } catch (error) {
      setValidationErrors(['Failed to upload file. Please try again.']);
      setIsUploading(false);
      setUploadProgress(0);
      setMediaUrl('');
      setPreviewUrl('');
      console.log(error);
    }
  }, [cleanupPreviewUrl, validateFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  // Validate form before submission
  const validateForm = useCallback((): boolean => {
    const errors: string[] = [];

    if (!mediaUrl) {
      errors.push('Please select a media file');
    }

    if (mentions) {
      const mentionList = mentions.split(',').map(m => m.trim()).filter(Boolean);
      const invalidMentions = mentionList.filter(mention => !mention.startsWith('@') && mention.length < 3);
      if (invalidMentions.length > 0) {
        errors.push('Invalid mentions format. Use @username format');
      }
    }

    if (hashtags) {
      const hashtagList = hashtags.split(',').map(h => h.trim()).filter(Boolean);
      const invalidHashtags = hashtagList.filter(hashtag => !hashtag.startsWith('#') && hashtag.length < 2);
      if (invalidHashtags.length > 0) {
        errors.push('Invalid hashtags format. Use #hashtag format');
      }
    }

    setValidationErrors(errors);
    return errors.length === 0;
  }, [mediaUrl, mentions, hashtags]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!mediaUrl) return;

    // Process mentions and hashtags
    const processedMentions = mentions 
      ? mentions.split(',').map(m => m.trim().replace('@', '')).filter(Boolean)
      : undefined;
    
    const processedHashtags = hashtags 
      ? hashtags.split(',').map(h => h.trim().replace('#', '')).filter(Boolean)
      : undefined;

    onAddStory({
      mediaUrl,
      mediaType,
      location: location || undefined,
      filter: filter || undefined,
      mentions: processedMentions,
      hashtags: processedHashtags,
    });
  }, [mediaUrl, mediaType, location, filter, mentions, hashtags, validateForm, onAddStory]);

  const resetForm = useCallback(() => {
    cleanupPreviewUrl();
    setMediaUrl('');
    setMediaType('IMAGE');
    setLocation('');
    setFilter('');
    setMentions('');
    setHashtags('');
    setPreviewUrl('');
    setValidationErrors([]);
    setUploadProgress(0);
    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [cleanupPreviewUrl]);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      cleanupPreviewUrl();
    };
  }, [cleanupPreviewUrl]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md overflow-hidden max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Create Story</h3>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <IconX size={20} className="text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                  <IconAlertCircle size={16} />
                  <span className="text-sm font-medium">Please fix the following errors:</span>
                </div>
                <ul className="mt-2 text-sm text-red-600 dark:text-red-400 space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Media Upload Area */}
            <div
              ref={dragAreaRef}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                isDragging
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
            >
              {previewUrl ? (
                <div className="space-y-4">
                  {mediaType === 'IMAGE' ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-h-48 mx-auto rounded-lg object-cover"
                    />
                  ) : mediaType === 'VIDEO' ? (
                    <video
                      src={previewUrl}
                      controls
                      className="max-h-48 mx-auto rounded-lg"
                    />
                  ) : (
                    <audio
                      src={previewUrl}
                      controls
                      className="max-h-48 mx-auto"
                    />
                  )}
                  
                  {/* Upload Progress */}
                  {isUploading && (
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  )}
                  
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-blue-500 hover:text-blue-600 text-sm font-medium transition-colors"
                    disabled={isUploading}
                  >
                    Change Media
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                    <IconUpload size={24} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">
                      Drag and drop your media here
                    </p>
                    <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">
                      or click to browse
                    </p>
                    <p className="text-gray-400 dark:text-gray-600 text-xs mt-2">
                      Max size: 50MB • Supported: JPG, PNG, GIF, MP4, WebM, MP3, WAV
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    disabled={isUploading}
                  >
                    Choose File
                  </button>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*,audio/*"
                onChange={handleFileInput}
                className="hidden"
              />
            </div>

            {/* Media Type Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Media Type</label>
              <div className="flex space-x-2">
                {(['IMAGE', 'VIDEO', 'AUDIO'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setMediaType(type)}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      mediaType === type
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                <IconMapPin size={16} className="mr-2" />
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Add location..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-colors"
                maxLength={100}
              />
            </div>

            {/* Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                <IconPalette size={16} className="mr-2" />
                Filter
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-colors"
              >
                <option value="">No filter</option>
                <option value="vintage">Vintage</option>
                <option value="blackwhite">Black & White</option>
                <option value="warm">Warm</option>
                <option value="cool">Cool</option>
                <option value="bright">Bright</option>
                <option value="sepia">Sepia</option>
                <option value="blur">Blur</option>
              </select>
            </div>

            {/* Mentions */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                <IconAt size={16} className="mr-2" />
                Mentions
              </label>
              <input
                type="text"
                value={mentions}
                onChange={(e) => setMentions(e.target.value)}
                placeholder="@username1, @username2, ..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-colors"
                maxLength={200}
              />
            </div>

            {/* Hashtags */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                <IconHash size={16} className="mr-2" />
                Hashtags
              </label>
              <input
                type="text"
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                placeholder="#hashtag1, #hashtag2, ..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-colors"
                maxLength={200}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!mediaUrl || isLoading || isUploading}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors"
            >
              {isLoading ? 'Creating Story...' : isUploading ? 'Uploading...' : 'Create Story'}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddStoryModal; 