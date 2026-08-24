const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { sendOtpEmail, sendWelcomeEmail } = require('../utils/email');

// ── In-memory stores (matches Java OtpService + PendingUserService) ───

const OTP_EXPIRY_MINUTES = 10;
const PENDING_EXPIRY_MINUTES = 15;

// email → { otp, expiry }
const otpStore = new Map();

// email → { registerData, expiry }
const pendingStore = new Map();

function generateOtp(email) {
    const otp = String(Math.floor(Math.random() * 1_000_000)).padStart(6, '0');
    otpStore.set(email, {
        otp,
        expiry: Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
    });
    return otp;
}

function validateAndConsumeOtp(email, otp) {
    const entry = otpStore.get(email);
    if (!entry) {
        throw new Error('No OTP found for this email. Please request a new one.');
    }
    if (Date.now() > entry.expiry) {
        otpStore.delete(email);
        throw new Error('OTP has expired. Please request a new one.');
    }
    if (entry.otp !== otp) {
        throw new Error('Invalid OTP. Please try again.');
    }
    otpStore.delete(email);
    return true;
}

function savePending(email, data) {
    pendingStore.set(email, {
        registerData: data,
        expiry: Date.now() + PENDING_EXPIRY_MINUTES * 60 * 1000
    });
}

function getPending(email) {
    const entry = pendingStore.get(email);
    if (!entry) return null;
    if (Date.now() > entry.expiry) {
        pendingStore.delete(email);
        return null;
    }
    return entry.registerData;
}

function hasPending(email) {
    return getPending(email) !== null;
}

// ── HEALTH CHECK — matches Java AuthController.ping() ─────────────────
router.get('/ping', (req, res) => {
    res.json({ status: 'ok', service: 'ICMS Backend' });
});

// ── REGISTER — stores pending data and sends OTP ─────────────────────
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, contactNumber } = req.body;

        // Check if email already registered in DB
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Save registration data temporarily
        savePending(email, { name, email, password, contactNumber });

        // Generate and send OTP
        const otp = generateOtp(email);
        await sendOtpEmail(email, name, otp);

        res.json({
            message: 'OTP sent to your email. Please verify to complete registration.',
            email
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// ── VERIFY OTP — validates OTP and creates the user account ──────────
router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Validate OTP (throws on failure)
        validateAndConsumeOtp(email, otp);

        // Get pending registration data
        const pending = getPending(email);
        if (!pending) {
            return res.status(400).json({ message: 'Registration session expired. Please register again.' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(pending.password, salt);

        // Create user account
        const user = new User({
            name: pending.name,
            email: pending.email,
            password: hashedPassword,
            role: 'STUDENT',
            contact_number: pending.contactNumber
        });
        await user.save();

        // Remove pending entry
        pendingStore.delete(email);

        // Send welcome email
        await sendWelcomeEmail(user.email, user.name);

        res.json({
            message: 'Account created successfully! Please login.',
            userId: user._id
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// ── RESEND OTP — regenerates and resends OTP ─────────────────────────
router.post('/resend-otp', async (req, res) => {
    try {
        const { email } = req.body;

        if (!hasPending(email)) {
            return res.status(400).json({ message: 'No pending registration found. Please register again.' });
        }

        const pending = getPending(email);
        otpStore.delete(email); // Clear old OTP
        const otp = generateOtp(email);
        await sendOtpEmail(email, pending.name, otp);

        res.json({ message: 'OTP resent to your email.' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// ── LOGIN ────────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT (matches Java JwtUtil — sub=email, role claim)
        const token = jwt.sign(
            {
                sub: user.email,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: parseInt(process.env.JWT_EXPIRATION) / 1000 || 86400 }
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                contactNumber: user.contact_number
            }
        });
    } catch (error) {
        res.status(401).json({ message: 'Invalid email or password' });
    }
});

// ── GET PROFILE — used by frontend authAPI.getProfile() ──────────────
router.get('/profile', auth, async (req, res) => {
    try {
        const email = req.query.email || req.user.email;
        const user = await User.findOne({ email }).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            contactNumber: user.contact_number
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
