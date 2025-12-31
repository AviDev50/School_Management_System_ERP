import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as authModel from "./authorization.model.js";

export async function login(data) {
  const { user_email, password } = data;

  if (!user_email || !password) {
    throw new Error("Email and password required");
  }

  const user = await authModel.getUserByEmail(user_email);

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    {
      user_id: user.user_id,
      role: user.role,
      school_id: user.school_id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    token,
    user: {
      user_id: user.user_id,
      role: user.role,
      school_id: user.school_id,
    },
  };
}
