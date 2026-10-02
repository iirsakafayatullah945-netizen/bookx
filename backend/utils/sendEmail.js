const nodemailer = require("nodemailer");

// Uses your own Gmail account to send mail. In Google Account
// settings, turn on 2-Step Verification, then create an
// "App Password" (Security > 2-Step Verification > App passwords)
// and put THAT (not your normal Gmail password) in EMAIL_PASS.
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendVerificationEmail(toEmail, name, token) {
  const verifyLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `"Book.X" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Verify your Book.X account",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
        <h2 style="color:#1F5D50;">Welcome to Book.X, ${name}!</h2>
        <p>Please confirm this is your email address to activate your account.</p>
        <p>
          <a href="${verifyLink}"
             style="display:inline-block; padding:12px 24px; background:#1F5D50;
                    color:#ffffff; text-decoration:none; border-radius:8px;">
            Verify My Email
          </a>
        </p>
        <p>Or paste this link into your browser:<br/>${verifyLink}</p>
        <p style="color:#888; font-size:12px;">This link expires in 24 hours.</p>
      </div>
    `
  });
}

module.exports = { sendVerificationEmail };
