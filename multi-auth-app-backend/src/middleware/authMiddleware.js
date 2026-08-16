import { verifyToken } from '../utils/jwt.js';
import User from '../models/User.js';

export const protectJWT = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = verifyToken(token);

      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User belonging to this token no longer exists',
        });
      }

      req.user = user.toSanitizedJSON ? user.toSanitizedJSON() : user;
      req.tokenPayload = decoded;
      return next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token has expired. Please login again.',
          errorType: 'TOKEN_EXPIRED',
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Invalid or malformed token. Authorization denied.',
        errorType: 'INVALID_TOKEN',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No Authorization Bearer token provided.',
      errorType: 'NO_TOKEN',
    });
  }
};
