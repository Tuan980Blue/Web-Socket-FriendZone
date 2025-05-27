const { transporter, emailTemplates } = require('../config/email');
const prisma = require('../prisma/client');
const { OTPType } = require('@prisma/client');

class OTPService {
  // Generate a random 6-digit OTP
  static generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Create and send OTP
  static async createAndSendOTP(email, type) {
    try {
      // Generate OTP
      const otp = this.generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Save OTP to database
      await prisma.oTP.create({
        data: {
          email,
          code: otp,
          type,
          expiresAt,
        },
      });

      // Get email template based on type
      const template = emailTemplates[type === OTPType.EMAIL_VERIFICATION ? 'emailVerification' : 'resetPassword'](otp);

      // Send email
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: template.subject,
        html: template.html,
      });

      return true;
    } catch (error) {
      console.error('Error in createAndSendOTP:', error);
      throw error;
    }
  }

  // Verify OTP without marking it as used
  static async verifyOTP(email, code, type) {
    try {
      const otp = await prisma.oTP.findFirst({
        where: {
          email,
          code,
          type,
          isUsed: false,
          expiresAt: {
            gt: new Date(),
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      if (!otp) {
        return { isValid: false, otp: null };
      }

      return { isValid: true, otp };
    } catch (error) {
      console.error('Error in verifyOTP:', error);
      throw error;
    }
  }

  // Mark OTP as used after successful operation
  static async markOTPAsUsed(otpId) {
    try {
      await prisma.oTP.update({
        where: { id: otpId },
        data: { isUsed: true },
      });
      return true;
    } catch (error) {
      console.error('Error in markOTPAsUsed:', error);
      throw error;
    }
  }

  // Clean up expired OTPs
  static async cleanupExpiredOTPs() {
    try {
      await prisma.oTP.deleteMany({
        where: {
          OR: [
            { expiresAt: { lt: new Date() } },
            { isUsed: true },
          ],
        },
      });
    } catch (error) {
      console.error('Error in cleanupExpiredOTPs:', error);
      throw error;
    }
  }
}

module.exports = OTPService; 