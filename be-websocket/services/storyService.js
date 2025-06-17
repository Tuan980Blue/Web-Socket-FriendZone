const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const notificationService = require('./notificationService');

// Create a new story
const createStory = async (req, res) => {
    try {
        const userId = req.user.id;
        const {mediaUrl, mediaType, location, filter, mentions, hashtags} = req.body;

        // Validate input
        if (!mediaUrl || !mediaType) {
            return res.status(400).json({
                success: false,
                error: 'Media URL and media type are required'
            });
        }

        // Validate media type
        const validMediaTypes = ['IMAGE', 'VIDEO', 'AUDIO'];
        if (!validMediaTypes.includes(mediaType)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid media type. Must be IMAGE, VIDEO, or AUDIO'
            });
        }

        // Set expiration time (24 hours from now)
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);

        // Create story
        const story = await prisma.story.create({
            data: {
                mediaUrl,
                mediaType,
                location,
                filter,
                expiresAt,
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

        // Process mentions if any
        if (mentions && mentions.length > 0) {
            await processMentions(mentions, null, story.id, userId);
        }

        // Process hashtags if any
        if (hashtags && hashtags.length > 0) {
            await processHashtags(hashtags, null, story.id, userId);
        }

        res.status(201).json({
            success: true,
            data: story,
        });
    } catch (error) {
        console.error('Error creating story:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
};

// Get stories for current user's feed (stories from followed users)
const getStoriesFeed = async (req, res) => {
    try {
        const userId = req.user.id;
        const currentTime = new Date();

        // First, get the list of users that the current user follows
        const followingUsers = await prisma.follow.findMany({
            where: {
                followerId: userId,
            },
            select: {
                followingId: true,
            },
        });

        const followingUserIds = followingUsers.map(follow => follow.followingId);

        // Get stories from users that the current user follows
        const stories = await prisma.story.findMany({
            where: {
                authorId: {
                    in: followingUserIds,
                },
                expiresAt: {
                    gt: currentTime,
                },
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
                mentions: {
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
                hashtags: true,
                likes: {
                    where: {
                        userId: userId,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Group stories by author and add like information
        const storiesByUser = stories.reduce((acc, story) => {
            const authorId = story.author.id;
            if (!acc[authorId]) {
                acc[authorId] = {
                    author: story.author,
                    stories: [],
                };
            }

            // Add like information to each story
            const storyWithLikeInfo = {
                ...story,
                isLikedByCurrentUser: story.likes.length > 0,
                likeCount: story.likeCount,
            };

            // Remove likes array to reduce payload
            delete storyWithLikeInfo.likes;

            acc[authorId].stories.push(storyWithLikeInfo);
            return acc;
        }, {});

        res.status(200).json({
            success: true,
            data: Object.values(storiesByUser),
        });
    } catch (error) {
        console.error('Error getting stories feed:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
};

// Get user's own stories
const getMyStories = async (req, res) => {
    try {
        const userId = req.user.id;
        const currentTime = new Date();

        const stories = await prisma.story.findMany({
            where: {
                authorId: userId,
                expiresAt: {
                    gt: currentTime,
                },
            },
            include: {
                mentions: {
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
                hashtags: true,
                likes: {
                    where: {
                        userId: userId,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Add like information to each story
        const storiesWithLikeInfo = stories.map(story => {
            const storyWithLikeInfo = {
                ...story,
                isLikedByCurrentUser: story.likes.length > 0,
                likeCount: story.likeCount,
            };

            // Remove likes array to reduce payload
            delete storyWithLikeInfo.likes;

            return storyWithLikeInfo;
        });

        res.status(200).json({
            success: true,
            data: storiesWithLikeInfo,
        });
    } catch (error) {
        console.error('Error getting my stories:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
};

// Get stories by specific user
const getUserStories = async (req, res) => {
    try {
        const {userId} = req.params;
        const currentTime = new Date();
        const currentUserId = req.user?.id; // Optional for public access

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: {id: userId},
            select: {id: true, username: true, fullName: true, avatar: true},
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found',
            });
        }

        const stories = await prisma.story.findMany({
            where: {
                authorId: userId,
                expiresAt: {
                    gt: currentTime,
                },
            },
            include: {
                mentions: {
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
                hashtags: true,
                likes: currentUserId ? {
                    where: {
                        userId: currentUserId,
                    },
                } : false,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Add like information to each story
        const storiesWithLikeInfo = stories.map(story => {
            const storyWithLikeInfo = {
                ...story,
                isLikedByCurrentUser: currentUserId ? story.likes.length > 0 : false,
                likeCount: story.likeCount,
            };

            // Remove likes array to reduce payload
            delete storyWithLikeInfo.likes;

            return storyWithLikeInfo;
        });

        res.status(200).json({
            success: true,
            data: {
                author: user,
                stories: storiesWithLikeInfo,
            },
        });
    } catch (error) {
        console.error('Error getting user stories:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
};

// Get story by ID
const getStoryById = async (req, res) => {
    try {
        const {id} = req.params;
        const currentTime = new Date();
        const userId = req.user?.id; // Optional for public access

        const story = await prisma.story.findFirst({
            where: {
                id: id,
                expiresAt: {
                    gt: currentTime,
                },
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
                mentions: {
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
                hashtags: true,
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
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
            },
        });

        if (!story) {
            return res.status(404).json({
                success: false,
                error: 'Story not found or has expired',
            });
        }

        // Check if current user has liked this story
        let isLikedByCurrentUser = false;
        if (userId) {
            const userLike = story.likes.find(like => like.userId === userId);
            isLikedByCurrentUser = !!userLike;
        }

        // Track view if user is authenticated and not the author
        if (userId && userId !== story.authorId) {
            try {
                // Check if user already viewed this story
                const existingView = await prisma.storyView.findFirst({
                    where: {
                        userId: userId,
                        storyId: id,
                    },
                });

                if (!existingView) {
                    // Create view record and increment view count
                    await prisma.$transaction([
                        prisma.storyView.create({
                            data: {
                                userId: userId,
                                storyId: id,
                            },
                        }),
                        prisma.story.update({
                            where: {id},
                            data: {
                                viewCount: {
                                    increment: 1,
                                },
                            },
                        }),
                    ]);
                }
            } catch (error) {
                console.error('Error tracking story view:', error);
                // Continue with response even if view tracking fails
            }
        } else if (userId && userId === story.authorId) {
            // Author viewing their own story - only increment view count, no view record
            await prisma.story.update({
                where: {id},
                data: {
                    viewCount: {
                        increment: 1,
                    },
                },
            });
        } else if (!userId) {
            // For anonymous users, just increment view count
            await prisma.story.update({
                where: {id},
                data: {
                    viewCount: {
                        increment: 1,
                    },
                },
            });
        }

        // Remove likes array from response to avoid large payload, keep only count and isLiked
        const {likes, ...storyWithoutLikes} = story;

        res.status(200).json({
            success: true,
            data: {
                ...storyWithoutLikes,
                likeCount: story.likes.length,
                isLikedByCurrentUser,
            },
        });
    } catch (error) {
        console.error('Error getting story:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
};

// Delete story
const deleteStory = async (req, res) => {
    try {
        const {id} = req.params;
        const userId = req.user.id;

        const story = await prisma.story.findUnique({
            where: {id},
        });

        if (!story) {
            return res.status(404).json({
                success: false,
                error: 'Story not found',
            });
        }

        if (story.authorId !== userId) {
            return res.status(403).json({
                success: false,
                error: 'You are not authorized to delete this story',
            });
        }

        // Delete associated mentions, hashtags, likes, and views
        await prisma.$transaction([
            prisma.mention.deleteMany({
                where: {storyId: id},
            }),
            prisma.hashtag.updateMany({
                where: {storyId: id},
                data: {
                    postCount: {
                        decrement: 1,
                    },
                },
            }),
            prisma.storyLike.deleteMany({
                where: {storyId: id},
            }),
            prisma.storyView.deleteMany({
                where: {storyId: id},
            }),
            prisma.story.delete({
                where: {id},
            }),
        ]);

        res.status(200).json({
            success: true,
            message: 'Story deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting story:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
};

// Create highlight
const createHighlight = async (req, res) => {
    try {
        const userId = req.user.id;
        const {name, coverImage, storyIds} = req.body;

        // Validate input
        if (!name || !coverImage) {
            return res.status(400).json({
                success: false,
                error: 'Name and cover image are required',
            });
        }

        if (!storyIds || !Array.isArray(storyIds) || storyIds.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'At least one story ID is required',
            });
        }

        // Verify all stories belong to the user
        const stories = await prisma.story.findMany({
            where: {
                id: {in: storyIds},
                authorId: userId,
            },
        });

        if (stories.length !== storyIds.length) {
            return res.status(400).json({
                success: false,
                error: 'Some stories do not exist or do not belong to you',
            });
        }

        // Create highlight
        const highlight = await prisma.highlight.create({
            data: {
                name,
                coverImage,
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

        // Update stories to link to highlight
        await prisma.story.updateMany({
            where: {
                id: {in: storyIds},
            },
            data: {
                highlightId: highlight.id,
                isHighlighted: true,
            },
        });

        res.status(201).json({
            success: true,
            data: highlight,
        });
    } catch (error) {
        console.error('Error creating highlight:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
};

// Get user's highlights
const getUserHighlights = async (req, res) => {
    try {
        const {userId} = req.params;

        const highlights = await prisma.highlight.findMany({
            where: {
                authorId: userId,
            },
            include: {
                stories: {
                    include: {
                        mentions: {
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
                        hashtags: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        res.status(200).json({
            success: true,
            data: highlights,
        });
    } catch (error) {
        console.error('Error getting user highlights:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
};

// Delete highlight
const deleteHighlight = async (req, res) => {
    try {
        const {id} = req.params;
        const userId = req.user.id;

        const highlight = await prisma.highlight.findUnique({
            where: {id},
        });

        if (!highlight) {
            return res.status(404).json({
                success: false,
                error: 'Highlight not found',
            });
        }

        if (highlight.authorId !== userId) {
            return res.status(403).json({
                success: false,
                error: 'You are not authorized to delete this highlight',
            });
        }

        // Update stories to remove highlight link
        await prisma.story.updateMany({
            where: {
                highlightId: id,
            },
            data: {
                highlightId: null,
                isHighlighted: false,
            },
        });

        // Delete the highlight
        await prisma.highlight.delete({
            where: {id},
        });

        res.status(200).json({
            success: true,
            message: 'Highlight deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting highlight:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
};

// Like a story
const likeStory = async (req, res) => {
    try {
        const {id} = req.params;
        const userId = req.user.id;
        const currentTime = new Date();

        // Check if story exists and is not expired
        const story = await prisma.story.findFirst({
            where: {
                id: id,
                expiresAt: {
                    gt: currentTime,
                },
            },
        });

        if (!story) {
            return res.status(404).json({
                success: false,
                error: 'Story not found or has expired',
            });
        }

        // Check if user already liked the story
        const existingLike = await prisma.storyLike.findUnique({
            where: {
                userId_storyId: {
                    userId: userId,
                    storyId: id,
                },
            },
        });

        if (existingLike) {
            return res.status(400).json({
                success: false,
                error: 'You have already liked this story',
            });
        }

        // Create like and increment like count
        await prisma.$transaction([
            prisma.storyLike.create({
                data: {
                    userId: userId,
                    storyId: id,
                },
            }),
            prisma.story.update({
                where: {id},
                data: {
                    likeCount: {
                        increment: 1,
                    },
                },
            }),
        ]);

        // Send notification to story author (if not the same user)
        if (story.authorId !== userId) {
            await notificationService.createNotification(
                story.authorId,
                'STORY_REACTION',
                {
                    storyId: id,
                    reactorUsername: req.user.username,
                    reactorFullName: req.user.fullName
                }
            );
        }

        res.status(200).json({
            success: true,
            message: 'Story liked successfully',
        });
    } catch (error) {
        console.error('Error liking story:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
};

// Unlike a story
const unlikeStory = async (req, res) => {
    try {
        const {id} = req.params;
        const userId = req.user.id;

        // Check if like exists
        const existingLike = await prisma.storyLike.findUnique({
            where: {
                userId_storyId: {
                    userId: userId,
                    storyId: id,
                },
            },
        });

        if (!existingLike) {
            return res.status(404).json({
                success: false,
                error: 'You have not liked this story',
            });
        }

        // Delete like and decrement like count
        await prisma.$transaction([
            prisma.storyLike.delete({
                where: {
                    userId_storyId: {
                        userId: userId,
                        storyId: id,
                    },
                },
            }),
            prisma.story.update({
                where: {id},
                data: {
                    likeCount: {
                        decrement: 1,
                    },
                },
            }),
        ]);

        res.status(200).json({
            success: true,
            message: 'Story unliked successfully',
        });
    } catch (error) {
        console.error('Error unliking story:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
};

// Get story likes
const getStoryLikes = async (req, res) => {
    try {
        const {id} = req.params;
        const currentTime = new Date();

        // Check if story exists and is not expired
        const story = await prisma.story.findFirst({
            where: {
                id: id,
                expiresAt: {
                    gt: currentTime,
                },
            },
        });

        if (!story) {
            return res.status(404).json({
                success: false,
                error: 'Story not found or has expired',
            });
        }

        // Get likes with user information
        const likes = await prisma.storyLike.findMany({
            where: {
                storyId: id,
            },
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
            orderBy: {
                createdAt: 'desc',
            },
        });

        res.status(200).json({
            success: true,
            data: {
                count: likes.length,
                likes: likes,
            },
        });
    } catch (error) {
        console.error('Error getting story likes:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
};

// Get story views (who viewed a specific story)
const getStoryViews = async (req, res) => {
    try {
        const {id} = req.params;
        const currentTime = new Date();

        // Check if story exists and is not expired
        const story = await prisma.story.findFirst({
            where: {
                id: id,
                expiresAt: {
                    gt: currentTime,
                },
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

        if (!story) {
            return res.status(404).json({
                success: false,
                error: 'Story not found or has expired',
            });
        }

        // Get views with user information
        const views = await prisma.storyView.findMany({
            where: {
                storyId: id,
            },
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
            orderBy: {
                createdAt: 'desc',
            },
        });

        res.status(200).json({
            success: true,
            data: {
                story: {
                    id: story.id,
                    author: story.author,
                },
                count: views.length,
                views: views,
            },
        });
    } catch (error) {
        console.error('Error getting story views:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
};

// Get views for current user's stories
const getMyStoryViews = async (req, res) => {
    try {
        const userId = req.user.id;
        const currentTime = new Date();

        // Get all stories by current user that haven't expired
        const stories = await prisma.story.findMany({
            where: {
                authorId: userId,
                expiresAt: {
                    gt: currentTime,
                },
            },
            include: {
                views: {
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
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Group views by story
        const storiesWithViews = stories.map(story => ({
            id: story.id,
            mediaUrl: story.mediaUrl,
            mediaType: story.mediaType,
            createdAt: story.createdAt,
            viewCount: story.viewCount,
            views: story.views,
        }));

        res.status(200).json({
            success: true,
            data: storiesWithViews,
        });
    } catch (error) {
        console.error('Error getting my story views:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
};

// Record story view (when user views a story)
const recordStoryView = async (req, res) => {
    try {
        const userId = req.user.id;
        const {id: storyId} = req.params;
        const currentTime = new Date();

        console.log('Recording story view:', {userId, storyId}); // Debug log

        // Validate storyId
        if (!storyId) {
            return res.status(400).json({
                success: false,
                error: 'Story ID is required',
            });
        }

        // Check if story exists and is not expired
        const story = await prisma.story.findFirst({
            where: {
                id: storyId,
                expiresAt: {
                    gt: currentTime,
                },
            },
        });

        if (!story) {
            return res.status(404).json({
                success: false,
                error: 'Story not found or has expired',
            });
        }

        // Don't record view if user is viewing their own story
        if (story.authorId === userId) {
            return res.status(200).json({
                success: true,
                message: 'Own story view not recorded',
            });
        }

        // Check if view already exists
        const existingView = await prisma.storyView.findFirst({
            where: {
                userId: userId,
                storyId: storyId,
            },
        });

        if (existingView) {
            return res.status(200).json({
                success: true,
                message: 'View already recorded',
            });
        }

        // Create story view record using relations
        await prisma.storyView.create({
            data: {
                user: {
                    connect: {id: userId}
                },
                story: {
                    connect: {id: storyId}
                }
            },
        });

        // Update story view count
        await prisma.story.update({
            where: {
                id: storyId,
            },
            data: {
                viewCount: {
                    increment: 1,
                },
            },
        });

        res.status(200).json({
            success: true,
            message: 'Story view recorded successfully',
        });
    } catch (error) {
        console.error('Error recording story view:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
};

// Helper function to process mentions
async function processMentions(mentions, postId, storyId, userId) {
    // Get the user who is creating the mention
    const mentioner = await prisma.user.findUnique({
        where: {id: userId},
        select: {
            id: true,
            username: true,
            fullName: true,
        },
    });

    for (const mention of mentions) {
        const mentionedUser = await prisma.user.findUnique({
            where: {username: mention},
        });

        if (mentionedUser) {
            await prisma.mention.create({
                data: {
                    userId: mentionedUser.id,
                    postId: postId,
                    storyId: storyId,
                },
            });

            // Send notification with correct user information
            await notificationService.createNotification(
                mentionedUser.id,
                'MENTION',
                {
                    mentionerFullName: mentioner.fullName,
                    mentionerUsername: mentioner.username,
                    postId: postId,
                    storyId: storyId,
                }
            );
        }
    }
}

// Helper function to process hashtags
async function processHashtags(hashtags, postId, storyId, userId) {
    for (const hashtag of hashtags) {
        await prisma.hashtag.upsert({
            where: {name: hashtag},
            update: {
                postCount: {
                    increment: 1,
                },
            },
            create: {
                name: hashtag,
                userId: userId,
                postId: postId,
                storyId: storyId,
                postCount: 1,
            },
        });
    }
}

module.exports = {
    createStory,
    getStoriesFeed,
    getMyStories,
    getUserStories,
    getStoryById,
    deleteStory,
    createHighlight,
    getUserHighlights,
    deleteHighlight,
    likeStory,
    unlikeStory,
    getStoryLikes,
    getStoryViews,
    getMyStoryViews,
    recordStoryView,
}; 