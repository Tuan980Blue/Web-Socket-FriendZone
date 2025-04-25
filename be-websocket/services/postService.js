const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createPost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { content, images, location, isArchived, isHighlighted, filter, tags } = req.body;

    // Validate input
    if (!content || typeof content !== 'string') {
      return res.status(400).json({ error: 'Content is required and must be a string' });
    }

    if (images.length > 10) {
      return res.status(400).json({ error: 'Maximum 10 images allowed' });
    }

    // Create post
    const post = await prisma.post.create({
      data: {
        content,
        images,
        location,
        isArchived: isArchived || false,
        isHighlighted: isHighlighted || false,
        filter,
        tags: tags || [],
        authorId: userId,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatar: true,
          },
        },
      },
    });

    // Update user's posts count
    await prisma.user.update({
      where: { id: userId },
      data: {
        postsCount: {
          increment: 1,
        },
      },
    });

    // Process hashtags if any
    if (tags && tags.length > 0) {
      await processHashtags(tags, post.id, userId);
    }

    res.status(201).json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatar: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                fullName: true,
                avatar: true,
              },
            },
          },
        },
        likes: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                fullName: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found',
      });
    }

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error('Error getting post:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found',
      });
    }

    if (post.authorId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'You are not authorized to delete this post',
      });
    }

    // Delete associated hashtags
    await prisma.hashtag.updateMany({
      where: {
        postId: id,
      },
      data: {
        postCount: {
          decrement: 1,
        },
      },
    });

    // Delete the post
    await prisma.post.delete({
      where: { id },
    });

    // Update user's posts count
    await prisma.user.update({
      where: { id: userId },
      data: {
        postsCount: {
          decrement: 1,
        },
      },
    });

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// Helper function to process hashtags
async function processHashtags(tags, postId, userId) {
  for (const tag of tags) {
    await prisma.hashtag.upsert({
      where: { name: tag },
      update: {
        postCount: {
          increment: 1,
        },
        post: {
          connect: {
            id: postId,
          },
        },
      },
      create: {
        name: tag,
        userId,
        postId,
        postCount: 1,
      },
    });
  }
}

const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await prisma.post.findMany({
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatar: true,
          },
        },
      },
    });

    const total = await prisma.post.count();

    res.json({
      posts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error getting posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const searchPosts = async (req, res) => {
  try {
    const { query, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const posts = await prisma.post.findMany({
      where: {
        OR: [
          { content: { contains: query, mode: 'insensitive' } },
          { tags: { hasSome: [query] } }
        ]
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatar: true,
          },
        },
      },
    });

    const total = await prisma.post.count({
      where: {
        OR: [
          { content: { contains: query, mode: 'insensitive' } },
          { tags: { hasSome: [query] } }
        ]
      }
    });

    res.json({
      posts,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error searching posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getMyPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await prisma.post.findMany({
      where: {
        authorId: userId
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatar: true,
          },
        },
      },
    });

    const total = await prisma.post.count({
      where: {
        authorId: userId
      }
    });

    res.json({
      posts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error getting my posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const posts = await prisma.post.findMany({
      where: {
        authorId: userId,
        isArchived: false // Only get non-archived posts
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatar: true,
          },
        },
      },
    });

    const total = await prisma.post.count({
      where: {
        authorId: userId,
        isArchived: false
      }
    });

    res.json({
      posts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error getting user posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createPost,
  getPostById,
  deletePost,
  getPosts,
  searchPosts,
  getMyPosts,
  getUserPosts
}; 