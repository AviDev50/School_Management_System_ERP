// middlewares/auth.middleware.js
import jwt from 'jsonwebtoken';

// Middleware - for protects routes
export function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    //here i add bearer token validation
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided."
      });
    }

    const token = authHeader.split(' ')[1];
    //here we verify jwt and decode 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //here in authmiddleware we set req.user
    req.user = {
      user_id: decoded.user_id,
      school_id: decoded.school_id,
      role: decoded.role,
      name: decoded.name,
      user_email: decoded.user_email
    };

    if (decoded.role === 'super_admin') {
      req.user = {
        super_admin_id: decoded.super_admin_id,
        name: decoded.name,
        user_email: decoded.user_email,
        role: decoded.role,
        school_id: null  //Role extracted from token here
      }; 
    }

    next();  // Calls next handler continue to check role

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: "Token expired. Please login again."
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: "Invalid token."
      });
    }

    return res.status(500).json({
      success: false,
      message: "Authentication failed"
    });
  }
}

// Role check middleware, we paas role at the time of route
export function checkRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized not allowed"
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Insufficient permissions to user."
      });
    }

    next(); //if role matches then allow access
  };
}
