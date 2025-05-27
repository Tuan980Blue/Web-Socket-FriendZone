const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  }
});

const emailTemplates = {
  emailVerification: (otp) => ({
    subject: 'Verify Your Email Address',
    html: `
      <h1>Email Verification</h1>
      <p>Thank you for registering! Please use the following OTP to verify your email address:</p>
      <h2 style="color: #4CAF50; font-size: 24px; letter-spacing: 2px;">${otp}</h2>
      <p>This OTP will expire in 10 minutes.</p>
      <p>If you didn't request this verification, please ignore this email.</p>
    `,
  }),
  resetPassword: (otp) => ({
    subject: 'Reset Your Password',
    html: `
      <h1>Password Reset Request</h1>
      <p>You have requested to reset your password. Please use the following OTP to proceed:</p>
      <h2 style="color: #4CAF50; font-size: 24px; letter-spacing: 2px;">${otp}</h2>
      <p>This OTP will expire in 10 minutes.</p>
      <p>If you didn't request a password reset, please ignore this email.</p>
    `,
  }),
};

module.exports = {
  transporter,
  emailTemplates,
}; 