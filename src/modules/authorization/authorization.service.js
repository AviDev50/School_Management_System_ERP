import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as authModel from './authorization.model.js';

// User Login Service
export async function loginService(user_email, password) {
  
  if (!user_email || !password) {
    throw new Error("Email and password are required");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(user_email)) {
    throw new Error("Invalid email format");
  }

  const user = await authModel.getUserByEmail(user_email.toLowerCase());
  
  if (!user) {
    throw new Error("Invalid credentials");
  }

  //Here we Check if user is active
  if (user.status !== 1) {
    throw new Error("Account is inactive. Please contact your school administrator.");
  }

  // Here we Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  
  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  // Here we Update last login
  await authModel.updateLastLogin(user.user_id);

  //Here we Generate JWT token
  const token = jwt.sign(
    {
      user_id: user.user_id,
      school_id: user.school_id,
      role: user.role,
      name: user.name,
      user_email: user.user_email
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '99h' }
  );

  //Here we Return user data
  return {
    token,
    user: {
      user_id: user.user_id,
      school_id: user.school_id,
      name: user.name,
      user_email: user.user_email,
      role: user.role
    }
  };
}

// Super Admin Login Service
// export async function superAdminLoginService(email, password) {
//   // Validation
//   if (!email || !password) {
//     throw new Error("Email and password are required");
//   }

//   // Email format validation
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   if (!emailRegex.test(email)) {
//     throw new Error("Invalid email format");
//   }

//   // Get super admin from database
//   const admin = await authModel.getSuperAdminByEmail(email.toLowerCase());
  
//   if (!admin) {
//     throw new Error("Invalid credentials");
//   }

//   // Check if admin is active
//   if (admin.status !== 1) {
//     throw new Error("Account is inactive");
//   }

//   // Verify password
//   const isPasswordValid = await bcrypt.compare(password, admin.password);
  
//   if (!isPasswordValid) {
//     throw new Error("Invalid credentials");
//   }

//   // Update last login
//   await authModel.updateSuperAdminLastLogin(admin.super_admin_id);

//   // Generate JWT token
//   const token = jwt.sign(
//     {
//       super_admin_id: admin.super_admin_id,
//       name: admin.name,
//       email: admin.email,
//       role: 'super_admin'
//     },
//     process.env.JWT_SECRET,
//     { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
//   );

//   // Return admin data (without password)
//   return {
//     token,
//     user: {
//       super_admin_id: admin.super_admin_id,
//       name: admin.name,
//       email: admin.email,
//       role: 'super_admin'
//     }
//   };
// }

// Verify Token Service (for token validation)
// export async function verifyTokenService(token) {
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     return {
//       valid: true,
//       user: decoded
//     };
//   } catch (error) {
//     return {
//       valid: false,
//       error: error.message
//     };
//   }
// }