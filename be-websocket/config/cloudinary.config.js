const { v2: cloudinary } = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME, // Lấy từ biến môi trường
  api_key: process.env.CLOUDINARY_API_KEY, // Lấy từ biến môi trường
  api_secret: process.env.CLOUDINARY_API_SECRET, // Lấy từ biến môi trường
});

const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result !== 'ok') {
      throw new Error(`Failed to delete image: ${result.result}`);
    }
    return result;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw error;
  }
};

module.exports = {
  cloudinary,
  deleteImage
};