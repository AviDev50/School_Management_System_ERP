// middlewares/auth.middleware.js
import jwt from 'jsonwebtoken';

// Middleware - for protects routes
export function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided."
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      user_id: decoded.user_id,
      school_id: decoded.school_id,
      role: decoded.role,
      name: decoded.name,
      email: decoded.email
    };

    if (decoded.role === 'super_admin') {
      req.user = {
        super_admin_id: decoded.super_admin_id,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role //Role extracted from token here
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

// Role check middleware
export function checkRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Insufficient permissions."
      });
    }

    next(); //if role matches then allow access
  };
}

//Here detailed description
// # Authentication (Public)
// POST   /api/auth/login
// POST   /api/auth/super-admin/login
// POST   /api/auth/logout
// POST   /api/auth/verify-token
// GET    /api/auth/me

// # School Admin (Protected - school_admin only)
// GET    /api/schooladmin/dashboard
// POST   /api/schooladmin/teachers
// GET    /api/schooladmin/students

// # Super Admin (Protected - super_admin only)
// GET    /api/superadmin/schools
// POST   /api/superadmin/schools

// # Teacher (Protected - teacher + school_admin)
// GET    /api/teacher/classes
// POST   /api/teacher/attendance

// # Student (Protected - student + teacher + school_admin)
// GET    /api/student/timetable
// GET    /api/student/attendance

// # Accountant (Protected - accountant + school_admin)
// GET    /api/accountant/fees
// POST   /api/accountant/payments