import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../../config/db.js"; 


export const registerSchoolWithAdmin = async (data) => {
  const { school_name, email, phone, address, admin_name, admin_email, password } = data;

  const [existing] = await db.query(
    "SELECT user_id FROM users WHERE email = ?",
    [admin_email]
  );
  if (existing.length) throw new Error("Email already exists");

  const [schoolResult] = await db.query(
    "INSERT INTO schools (school_name, email, phone, address) VALUES (?,?,?,?)",
    [school_name, email, phone, address]
  );

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.query(
    `INSERT INTO users (school_id, name, email, password, role)
     VALUES (?,?,?,?,?)`,
    [schoolResult.insertId, admin_name, admin_email, hashedPassword, "school_admin"]
  );

  return { message: "School & Admin registered successfully" };
};

export const loginUser = async (email, password) => {
  const [users] = await db.query(
    "SELECT * FROM users WHERE email = ? AND status = 1",
    [email]
  );

  if (!users.length) throw new Error("Invalid credentials");

  const user = users[0];
  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid credentials");

  const token = jwt.sign(
    {
      user_id: user.user_id,
      school_id: user.school_id,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return { token };
};
