// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
import db from "../../config/db.js";

// Get user by email (for login)
export async function getUserByEmail(user_email, connection = null) {
  const conn = connection || await db.getConnection();
  try {
    const [users] = await conn.query(
      `SELECT 
        user_id, 
        school_id, 
        name, 
        user_email, 
        password, 
        role, 
        status,
        created_at
      FROM users 
      WHERE user_email = ?`,
      [user_email]
    );
    return users[0] || null;
  } finally {
    if (!connection) conn.release();
  }
}

// // Get super admin by email
// export async function getSuperAdminByEmail(email, connection = null) {
//   const conn = connection || await db.getConnection();
//   try {
//     const [admins] = await conn.query(
//       `SELECT 
//         super_admin_id, 
//         name, 
//         email, 
//         password, 
//         status,
//         created_at
//       FROM super_admin 
//       WHERE email = ?`,
//       [email]
//     );
//     return admins[0] || null;
//   } finally {
//     if (!connection) conn.release();
//   }
// }

// // Update last login timestamp
export async function updateLastLogin(userId, connection = null) {
  const conn = connection || await db.getConnection();
  try {
    await conn.query(
      `UPDATE users 
       SET updated_at = CURRENT_TIMESTAMP 
       WHERE user_id = ?`,
      [userId]
    );
  } finally {
    if (!connection) conn.release();
  }
}

// // Update super admin last login
// export async function updateSuperAdminLastLogin(adminId, connection = null) {
//   const conn = connection || await db.getConnection();
//   try {
//     await conn.query(
//       `UPDATE super_admin 
//        SET updated_at = CURRENT_TIMESTAMP 
//        WHERE super_admin_id = ?`,
//       [adminId]
//     );
//   } finally {
//     if (!connection) conn.release();
//   }
// }

// Check if email exists (for registration validation)
export async function checkEmailExists(user_email, connection = null) {
  const conn = connection || await db.getConnection();
  try {
    const [users] = await conn.query(
      'SELECT user_id FROM users WHERE user_email = ?',
      [user_email]
    );
    return users.length > 0;
  } finally {
    if (!connection) conn.release();
  }
}