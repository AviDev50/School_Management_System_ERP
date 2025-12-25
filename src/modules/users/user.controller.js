import { registerSchoolWithAdmin, loginUser } from "../users/user.service.js";

export const register = async (req, res) => {
  try {
    const result = await registerSchoolWithAdmin(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password);
    res.json(result);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};
