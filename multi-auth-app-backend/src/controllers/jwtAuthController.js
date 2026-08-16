import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { generateToken, decodeToken, verifyToken } from '../utils/jwt.js';

/**
 * @desc    Register a new user with email and password (JWT Auth)
 * @route   POST /api/auth/jwt/register
 * @access  Public
 */
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, password',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email address already exists',
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user in MongoDB
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      authProvider: 'jwt',
    });

    // Generate JWT
    const token = generateToken(user);
    const sanitized = user.toSanitizedJSON();

    return res.status(201).json({
      success: true,
      message: 'Account created successfully with JWT authentication',
      token,
      user: sanitized,
    });
  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration',
    });
  }
};

/**
 * @desc    Authenticate user & get token (JWT Auth)
 * @route   POST /api/auth/jwt/login
 * @access  Public
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check if user registered via social / external provider
    if (user.authProvider !== 'jwt' && !user.password) {
      return res.status(400).json({
        success: false,
        message: `This account was registered using ${user.authProvider.toUpperCase()} OAuth. Please sign in using ${user.authProvider.toUpperCase()}.`,
      });
    }

    // Verify password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate JWT
    const token = generateToken(user);
    const sanitized = user.toSanitizedJSON();

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: sanitized,
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during login',
    });
  }
};

/**
 * @desc    Get current logged in user profile (Protected)
 * @route   GET /api/auth/jwt/me
 * @access  Private (JWT Protected)
 */
export const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'User profile retrieved successfully',
      user: req.user,
      tokenPayload: req.tokenPayload,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching user profile',
    });
  }
};

/**
 * @desc    Educational tool: Inspect & verify any JWT token
 * @route   POST /api/auth/jwt/inspect
 * @access  Public
 */
export const inspectToken = (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a token string in the body',
      });
    }

    const decoded = decodeToken(token);
    let isValid = false;
    let verificationError = null;

    try {
      verifyToken(token);
      isValid = true;
    } catch (err) {
      isValid = false;
      verificationError = err.message;
    }

    return res.status(200).json({
      success: true,
      isValid,
      verificationError,
      header: decoded?.header || null,
      payload: decoded?.payload || null,
      signature: decoded?.signature || null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to inspect token: ' + error.message,
    });
  }
};
