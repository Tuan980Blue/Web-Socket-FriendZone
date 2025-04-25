const { v2: cloudinary } = require('cloudinary');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require("node:fs");
const { deleteImage } = require('../config/cloudinary.config');

// Function to extract public_id from Cloudinary URL
const extractPublicId = (url) => {
  try {
    if (!url) return null;
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    // Remove the version number and file extension
    const publicId = pathParts.slice(-2).join('/').replace(/\.[^/.]+$/, '');
    return publicId;
  } catch (error) {
    console.error('Error extracting public_id from URL:', error);
    return null;
  }
};

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'friendzone',
      resource_type: 'auto' // Automatically detect resource type
    });

    // Clean up temporary file
    try {
      fs.unlinkSync(req.file.path);
    } catch (cleanupError) {
      console.error('Error cleaning up temporary file:', cleanupError);
      // Continue with response even if cleanup fails
    }

    // Return the secure URL
    res.json({
      success: true,
      secure_url: result.secure_url,
      public_id: result.public_id
    });
  } catch (error) {
    // Clean up temporary file in case of error
    if (req.file?.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupError) {
        console.error('Error cleaning up temporary file after upload error:', cleanupError);
      }
    }
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Error uploading image' });
  }
};

const updateUserAvatar = async (req, res) => {
  try {
    const { userId } = req.params;
    const { secure_url } = req.body;

    if (!secure_url) {
      return res.status(400).json({ error: 'Secure URL is required' });
    }

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Get current user info to get old avatar URL
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { avatar: true }
    });

    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // If there's an old avatar, delete it from Cloudinary
    if (currentUser.avatar) {
      try {
        const publicId = extractPublicId(currentUser.avatar);
        if (publicId) {
          console.log('Deleting old avatar with public_id:', publicId);
          await deleteImage(publicId);
        } else {
          console.warn('Could not extract public_id from old avatar URL:', currentUser.avatar);
        }
      } catch (error) {
        console.error('Error deleting old avatar:', error);
        // Continue with the update process even if deletion fails
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { avatar: secure_url }
    });

    res.json({
      success: true,
      user: updatedUser
    });
  } catch (error) {
    console.error('Update avatar error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(500).json({ error: 'Error updating avatar' });
  }
};

const updatePostImage = async (req, res) => {
  try {
    const { postId } = req.params;
    const { secure_url } = req.body;

    if (!secure_url) {
      return res.status(400).json({ error: 'Secure URL is required' });
    }

    if (!postId) {
      return res.status(400).json({ error: 'Post ID is required' });
    }

    const postIdNum = parseInt(postId);
    if (isNaN(postIdNum)) {
      return res.status(400).json({ error: 'Invalid post ID format' });
    }

    const post = await prisma.post.findUnique({
      where: { id: postIdNum }
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const updatedPost = await prisma.post.update({
      where: { id: postIdNum },
      data: { image: secure_url }
    });

    res.json({
      success: true,
      post: updatedPost
    });
  } catch (error) {
    console.error('Update post image error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(500).json({ error: 'Error updating post image' });
  }
};

module.exports = {
  uploadImage,
  updateUserAvatar,
  updatePostImage
}; 