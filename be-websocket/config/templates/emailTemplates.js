const emailTemplates = {
  emailVerification: (otp) => ({
    subject: 'Verify Your Email Address',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');
          
          body {
            font-family: 'Poppins', sans-serif;
            line-height: 1.4;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
          }
          .container {
            max-width: 500px;
            margin: 10px auto;
            background: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: #fff;
            padding: 15px;
            text-align: center;
          }
          .logo {
            max-width: 80px;
            margin-bottom: 5px;
          }
          .header h1 {
            color: #f8309c;
            font-size: 20px;
            font-weight: 600;
            margin: 0;
          }
          .content {
            padding: 20px;
          }
          .welcome-text {
            font-size: 18px;
            font-weight: 500;
            color: #333;
            margin-bottom: 10px;
          }
          .message {
            color: #555;
            font-size: 14px;
            margin-bottom: 15px;
          }
          .otp-container {
            background: #f8f9fa;
            border-radius: 6px;
            padding: 15px;
            text-align: center;
            margin: 15px 0;
            border: 1px solid #eee;
          }
          .otp-label {
            color: #555;
            font-size: 14px;
            margin-bottom: 8px;
          }
          .otp-code {
            font-size: 28px;
            font-weight: 600;
            color: #f8309c;
            letter-spacing: 4px;
            margin: 8px 0;
            font-family: 'Poppins', monospace;
          }
          .expiry-text {
            color: #666;
            font-size: 12px;
            margin-top: 5px;
          }
          .warning {
            background: #fff3f3;
            border-left: 3px solid #f8309c;
            padding: 10px;
            margin: 15px 0;
            border-radius: 0 4px 4px 0;
          }
          .warning-text {
            color: #f8304e;
            font-size: 12px;
            font-weight: 500;
            margin: 0;
          }
          .footer {
            background: #f8f9fa;
            padding: 15px;
            text-align: center;
            border-top: 1px solid #eee;
          }
          .footer-text {
            color: #666;
            font-size: 12px;
            margin: 3px 0;
          }
          .social-links {
            margin: 8px 0;
          }
          .social-icon {
            display: inline-block;
            margin: 0 5px;
            width: 24px;
            height: 24px;
            background: #eee;
            border-radius: 50%;
            text-align: center;
            line-height: 24px;
            color: #333;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="https://res.cloudinary.com/dcjexzmll/image/upload/v1748341930/ChatGPT_Image_May_27_2025_05_09_26_PM_yseicz.png" alt="FriendZone Logo" class="logo">
            <h1>Welcome to FriendZone!</h1>
          </div>
          <div class="content">
            <div class="welcome-text">Hello there! 👋</div>
            <p class="message">Thank you for joining FriendZone! Please verify your email using the code below:</p>
            
            <div class="otp-container">
              <div class="otp-label">Your verification code</div>
              <div class="otp-code">${otp}</div>
              <div class="expiry-text">This code will expire in 10 minutes</div>
            </div>

            <div class="warning">
              <p class="warning-text">⚠️ Never share this code with anyone.</p>
            </div>

            <p class="message">If you didn't create an account, please ignore this email.</p>
          </div>
          <div class="footer">
            <div class="social-links">
              <a href="#" class="social-icon">📱</a>
              <a href="#" class="social-icon">💬</a>
              <a href="#" class="social-icon">📧</a>
            </div>
            <p class="footer-text">© ${new Date().getFullYear()} FriendZone. All rights reserved.</p>
            <p class="footer-text">This is an automated message, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),
  resetPassword: (otp) => ({
    subject: 'Reset Your Password',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');
          
          body {
            font-family: 'Poppins', sans-serif;
            line-height: 1.4;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f56db2;
          }
          .container {
            max-width: 500px;
            margin: 10px auto;
            background: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: #fff;
            padding: 15px;
            text-align: center;
          }
          .logo {
            max-width: 80px;
            margin-bottom: 5px;
          }
          .header h1 {
            color: #3a3939;
            font-size: 20px;
            font-weight: 600;
            margin: 0;
          }
          .content {
            padding: 20px;
          }
          .message {
            color: #555;
            font-size: 14px;
            margin-bottom: 15px;
          }
          .otp-container {
            background: #f8f9fa;
            border-radius: 6px;
            padding: 15px;
            text-align: center;
            margin: 15px 0;
            border: 1px solid #eee;
          }
          .otp-label {
            color: #555;
            font-size: 14px;
            margin-bottom: 8px;
          }
          .otp-code {
            font-size: 28px;
            font-weight: 600;
            color: #f62295;
            letter-spacing: 4px;
            margin: 8px 0;
            font-family: 'Poppins', monospace;
          }
          .expiry-text {
            color: #666;
            font-size: 12px;
            margin-top: 5px;
          }
          .warning {
            background: #fff3f3;
            border-left: 3px solid #f8304e;
            padding: 10px;
            margin: 15px 0;
            border-radius: 0 4px 4px 0;
          }
          .warning-text {
            color: #f8304e;
            font-size: 12px;
            font-weight: 500;
            margin: 0;
          }
          .footer {
            background: #f8f9fa;
            padding: 15px;
            text-align: center;
            border-top: 1px solid #eee;
          }
          .footer-text {
            color: #666;
            font-size: 12px;
            margin: 3px 0;
          }
          .social-links {
            margin: 8px 0;
          }
          .social-icon {
            display: inline-block;
            margin: 0 5px;
            width: 24px;
            height: 24px;
            background: #eee;
            border-radius: 50%;
            text-align: center;
            line-height: 24px;
            color: #333;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="https://res.cloudinary.com/dcjexzmll/image/upload/v1748341930/ChatGPT_Image_May_27_2025_05_09_26_PM_yseicz.png" alt="FriendZone Logo" class="logo">
            <h1>Reset Your Password</h1>
          </div>
          <div class="content">
            <p class="message">We received a request to reset your password. Use the code below to proceed:</p>
            
            <div class="otp-container">
              <div class="otp-label">Your reset code</div>
              <div class="otp-code">${otp}</div>
              <div class="expiry-text">This code will expire in 10 minutes</div>
            </div>

            <div class="warning">
              <p class="warning-text">⚠️ Never share this code with anyone.</p>
            </div>

            <p class="message">If you didn't request a password reset, please ignore this email.</p>
          </div>
          <div class="footer">
            <div class="social-links">
              <a href="#" class="social-icon">📱</a>
              <a href="#" class="social-icon">💬</a>
              <a href="#" class="social-icon">📧</a>
            </div>
            <p class="footer-text">© ${new Date().getFullYear()} FriendZone. All rights reserved.</p>
            <p class="footer-text">This is an automated message, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),
};

module.exports = emailTemplates; 