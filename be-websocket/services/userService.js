const prisma = require('../prisma/client');
const bcrypt = require('bcryptjs');

class UserService {
  // Create new user
  async createUser(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    return prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword
      }
    });
  }

  // Find user by email
  async findByEmail(email) {
    return prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        username: true,
        email: true,
        password: true,
        fullName: true,
        avatar: true,
        bio: true,
        status: true,
        lastSeen: true,
        createdAt: true,
        updatedAt: true,
        isPrivate: true,
        website: true,
        location: true,
        phoneNumber: true,
        gender: true,
        birthDate: true,
        followersCount: true,
        followingCount: true,
        postsCount: true
      }
    });
  }

  // Find user by username
  async findByUsername(username) {
    return prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        email: true,
        password: true,
        fullName: true,
        avatar: true,
        bio: true,
        status: true,
        lastSeen: true,
        createdAt: true,
        updatedAt: true,
        isPrivate: true,
        website: true,
        location: true,
        phoneNumber: true,
        gender: true,
        birthDate: true,
        followersCount: true,
        followingCount: true,
        postsCount: true
      }
    });
  }

  // Find user by ID
  async findById(id) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        avatar: true,
        bio: true,
        status: true,
        lastSeen: true,
        createdAt: true,
        updatedAt: true,
        isPrivate: true,
        website: true,
        location: true,
        phoneNumber: true,
        gender: true,
        birthDate: true,
        followersCount: true,
        followingCount: true,
        postsCount: true
      }
    });
  }

  // Update user
  async updateUser(id, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    
    return prisma.user.update({
      where: { id },
      data
    });
  }

  // Delete user
  async deleteUser(id) {
    return prisma.user.delete({
      where: { id }
    });
  }

  // Compare password
  async comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  // Update user status
  async updateStatus(id, status) {
    return prisma.user.update({
      where: { id },
      data: { 
        status,
        lastSeen: new Date()
      }
    });
  }

  // Get all users
  async getAllUsers() {
    return prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        password: true,
        fullName: true,
        avatar: true,
        bio: true,
        status: true,
        lastSeen: true,
        createdAt: true,
        updatedAt: true,
        isPrivate: true,
        website: true,
        location: true,
        phoneNumber: true,
        gender: true,
        birthDate: true,
        followersCount: true,
        followingCount: true,
        postsCount: true
      }
    });
  }
}

module.exports = new UserService(); 