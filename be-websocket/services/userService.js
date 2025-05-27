const prisma = require('../prisma/client');
const bcrypt = require('bcryptjs');

class UserService {
  // Validate password
  validatePassword(password) {
    const errors = [];
    
    // Check length (8-32 characters)
    if (password.length < 8 || password.length > 32) {
      errors.push('Password must be between 8 and 32 characters');
    }

    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    // Check for at least one lowercase letter
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    // Check for at least one number
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    // Check for at least one special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)');
    }

    // Check for common passwords (you can expand this list)
    const commonPasswords = ['password123', '12345678', 'qwerty123', 'admin123'];
    if (commonPasswords.includes(password.toLowerCase())) {
      errors.push('Password is too common');
    }

    if (errors.length > 0) {
      throw new Error(errors.join('. '));
    }

    return true;
  }

  // Create new user
  async createUser(userData) {
    // Validate password before hashing
    this.validatePassword(userData.password);
    
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
        postsCount: true,
        role: true
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
  async findById(id, includePassword = false) {
    const select = {
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
      postsCount: true,
      role: true
    };

    if (includePassword) {
      select.password = true;
    }

    return prisma.user.findUnique({
      where: { id },
      select
    });
  }

  // Search users by fullName, email, or username
  async searchUsers(query) {
    const searchQuery = query.toLowerCase();
    return prisma.user.findMany({
      where: {
        OR: [
          { fullName: { contains: searchQuery, mode: 'insensitive' } },
          { email: { contains: searchQuery, mode: 'insensitive' } },
          { username: { contains: searchQuery, mode: 'insensitive' } }
        ]
      },
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
      },
      take: 10 // Limit results to 10 users
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

  // Update user information
  async updateUser(id, userData) {
    // Remove sensitive fields that shouldn't be updated directly
    const { password, email, role, ...updateData } = userData;

    return prisma.user.update({
      where: { id },
      data: updateData,
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
        postsCount: true,
        role: true
      }
    });
  }

  // Update user password
  async updatePassword(id, newPassword, currentPassword) {
    // Validate new password
    this.validatePassword(newPassword);

    // Get current user with password
    const user = await this.findById(id, true);
    if (!user) {
      throw new Error('User not found');
    }

    // Check if new password is different from current password
    const isSamePassword = await this.comparePassword(newPassword, user.password);
    if (isSamePassword) {
      throw new Error('New password must be different from current password');
    }

    // Verify current password
    const isMatch = await this.comparePassword(currentPassword, user.password);
    if (!isMatch) {
      throw new Error('Current password is incorrect');
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    return prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
        updatedAt: new Date()
      }
    });
  }

  // Reset password (for OTP-based password reset)
  async resetPassword(id, newPassword) {
    // Validate new password
    this.validatePassword(newPassword);

    // Get current user with password
    const user = await this.findById(id, true);
    if (!user) {
      throw new Error('User not found');
    }

    // Check if new password is different from current password
    const isSamePassword = await this.comparePassword(newPassword, user.password);
    if (isSamePassword) {
      throw new Error('New password must be different from current password');
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    return prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
        updatedAt: new Date()
      }
    });
  }

}

module.exports = new UserService(); 