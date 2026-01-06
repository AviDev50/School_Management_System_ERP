import * as authService from './authorization.service.js';

// User Login (school_admin, teacher, student, accountant)
export async function login(req, res) {
  try {
    const { user_email, password } = req.body;

    // Input validation
    if (!user_email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // Call login service
    const result = await authService.loginService(user_email, password);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result
    });

  } catch (error) {
    console.error("Login Error:", error.message);

    // Handle specific errors
    if (error.message === "Invalid credentials") {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    if (error.message.includes("inactive")) {
      return res.status(403).json({
        success: false,
        message: error.message
      });
    }

    if (error.message === "Invalid email format") {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later."
    });
  }
}

// // Super Admin Login
// export async function superAdminLogin(req, res) {
//   try {
//     const { email, password } = req.body;

//     // Input validation
//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Email and password are required"
//       });
//     }

//     // Call super admin login service
//     const result = await authService.superAdminLoginService(email, password);

//     return res.status(200).json({
//       success: true,
//       message: "Login successful",
//       data: result
//     });

//   } catch (error) {
//     console.error("Super Admin Login Error:", error.message);

//     // Handle specific errors
//     if (error.message === "Invalid credentials") {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid email or password"
//       });
//     }

//     if (error.message.includes("inactive")) {
//       return res.status(403).json({
//         success: false,
//         message: error.message
//       });
//     }

//     if (error.message === "Invalid email format") {
//       return res.status(400).json({
//         success: false,
//         message: error.message
//       });
//     }

//     return res.status(500).json({
//       success: false,
//       message: "Internal server error. Please try again later."
//     });
//   }
// }

// // Logout
// export async function logout(req, res) {
//   try {
//     // Frontend will handle token removal from localStorage/sessionStorage
    
//     return res.status(200).json({
//       success: true,
//       message: "Logout successful"
//     });

//   } catch (error) {
//     console.error("Logout Error:", error.message);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error"
//     });
//   }
// }

// Verify Token - Check if JWT token is valid
export async function verifyToken(req, res) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer')) {
      return res.status(401).json({
        success: false,
        message: "No token provided"
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Here we Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Here we Return user data from token
    return res.status(200).json({
      success: true,
      message: "Token is valid",
      data: {
        user_id: decoded.user_id,
        school_id: decoded.school_id,
        role: decoded.role,
        name: decoded.name,
        user_email: decoded.user_email
      }
    });

  } catch (error) {
    console.error("Verify Token Error:", error.message);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: "Token expired. Please login again."
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: "Invalid token"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}

// Get Current User Info (Protected Route)
export async function getCurrentUser(req, res) {
  try {
    // req.user is set by authMiddleware
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login first."
      });
    }

    return res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: req.user
    });
    
  } catch (error) {
    console.error("Get Current User Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}