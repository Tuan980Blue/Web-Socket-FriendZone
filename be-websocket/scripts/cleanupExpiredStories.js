const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Script để cleanup stories đã hết hạn
 * Chạy script này định kỳ (ví dụ: mỗi giờ) để dọn dẹp database
 */

async function cleanupExpiredStories() {
  try {
    console.log('Starting cleanup of expired stories...');
    
    const currentTime = new Date();
    
    // Tìm tất cả stories đã hết hạn
    const expiredStories = await prisma.story.findMany({
      where: {
        expiresAt: {
          lt: currentTime,
        },
        // Chỉ xóa stories không nằm trong highlight
        highlightId: null,
      },
      include: {
        mentions: true,
        hashtags: true,
      },
    });

    console.log(`Found ${expiredStories.length} expired stories to delete`);

    if (expiredStories.length === 0) {
      console.log('No expired stories to clean up');
      return;
    }

    // Xóa mentions của expired stories
    const mentionIds = expiredStories.flatMap(story => 
      story.mentions.map(mention => mention.id)
    );
    
    if (mentionIds.length > 0) {
      await prisma.mention.deleteMany({
        where: {
          id: { in: mentionIds },
        },
      });
      console.log(`Deleted ${mentionIds.length} mentions`);
    }

    // Cập nhật hashtag counts
    const hashtagIds = expiredStories.flatMap(story => 
      story.hashtags.map(hashtag => hashtag.id)
    );
    
    if (hashtagIds.length > 0) {
      await prisma.hashtag.updateMany({
        where: {
          id: { in: hashtagIds },
        },
        data: {
          postCount: {
            decrement: 1,
          },
        },
      });
      console.log(`Updated ${hashtagIds.length} hashtag counts`);
    }

    // Xóa expired stories
    const storyIds = expiredStories.map(story => story.id);
    await prisma.story.deleteMany({
      where: {
        id: { in: storyIds },
      },
    });

    console.log(`Successfully deleted ${storyIds.length} expired stories`);
    
  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Chạy cleanup nếu script được gọi trực tiếp
if (require.main === module) {
  cleanupExpiredStories()
    .then(() => {
      console.log('Cleanup completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Cleanup failed:', error);
      process.exit(1);
    });
}

module.exports = cleanupExpiredStories; 