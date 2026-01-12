import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@obracubra.com';
const APP_URL = process.env.APP_URL || 'http://localhost:5000';

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: SMTP_USER && SMTP_PASS ? {
    user: SMTP_USER,
    pass: SMTP_PASS,
  } : undefined,
});

export async function sendVerificationEmail(email: string, token: string): Promise<void> {
  const verificationUrl = `${APP_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: FROM_EMAIL,
    to: email,
    subject: 'Verify your Obracubra account',
    html: `
      <h2>Welcome to Obracubra!</h2>
      <p>Please verify your email address by clicking the link below:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
      <p>This link will expire in 24 hours.</p>
      <p>If you didn't create an account, please ignore this email.</p>
    `,
  };

  // Only send email if SMTP is configured
  if (SMTP_USER && SMTP_PASS) {
    await transporter.sendMail(mailOptions);
  } else {
    console.log('Email verification URL (SMTP not configured):', verificationUrl);
  }
}

export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`;

  const mailOptions = {
    from: FROM_EMAIL,
    to: email,
    subject: 'Reset your Obracubra password',
    html: `
      <h2>Password Reset Request</h2>
      <p>You requested to reset your password. Click the link below to proceed:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request a password reset, please ignore this email.</p>
    `,
  };

  // Only send email if SMTP is configured
  if (SMTP_USER && SMTP_PASS) {
    await transporter.sendMail(mailOptions);
  } else {
    console.log('Password reset URL (SMTP not configured):', resetUrl);
  }
}
