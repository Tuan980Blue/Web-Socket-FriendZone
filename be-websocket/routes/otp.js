const express = require('express');
const router = express.Router();
const OTPService = require('../services/otpService');
const { OTPType } = require('@prisma/client');
const prisma = require('../prisma/client');
const bcrypt = require('bcryptjs');

// Send OTP for email verification
router.post('/send-verification', async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Send OTP
    await OTPService.createAndSendOTP(email, OTPType.EMAIL_VERIFICATION);

    res.json({ message: 'Verification OTP sent successfully' });
  } catch (error) {
    console.error('Error in send-verification:', error);
    res.status(500).json({ error: 'Failed to send verification OTP' });
  }
});

// Verify email OTP
router.post('/verify-email', async (req, res) => {
  try {
    const { email, code } = req.body;

    const isValid = await OTPService.verifyOTP(email, code, OTPType.EMAIL_VERIFICATION);

    if (!isValid) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // Update user's email verification status
    await prisma.user.update({
      where: { email },
      data: { isEmailVerified: true },
    });

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Error in verify-email:', error);
    res.status(500).json({ error: 'Failed to verify email' });
  }
});

// Send OTP for password reset
router.post('/send-reset-password', async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Send OTP
    await OTPService.createAndSendOTP(email, OTPType.RESET_PASSWORD);

    res.json({ message: 'Password reset OTP sent successfully' });
  } catch (error) {
    console.error('Error in send-reset-password:', error);
    res.status(500).json({ error: 'Failed to send password reset OTP' });
  }
});

// Verify password reset OTP
router.post('/verify-reset-password', async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    const isValid = await OTPService.verifyOTP(email, code, OTPType.RESET_PASSWORD);

    if (!isValid) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // Update user's password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error in verify-reset-password:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

// Cleanup expired OTPs (can be called by a cron job)
router.post('/cleanup', async (req, res) => {
  try {
    await OTPService.cleanupExpiredOTPs();
    res.json({ message: 'Expired OTPs cleaned up successfully' });
  } catch (error) {
    console.error('Error in cleanup:', error);
    res.status(500).json({ error: 'Failed to cleanup expired OTPs' });
  }
});

module.exports = router; 