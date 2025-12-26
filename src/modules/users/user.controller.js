import * as userService from "./user.service.js";

export async function registerUser(req, res) {
  try {
    const result = await userService.registerSchoolWithAdmin(req.body);

    return res.status(result.success ? 201 : 400).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
      data: [],
    });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const result = await userService.loginUser(email, password);

    return res.status(result.success ? 200 : 401).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
      data: [],
    });
  }
}

export async function getSchoolDetailsById(req, res) {
  try {
    const {id} = req.params;

    if (!id) {
    return res.status(400).json({
    success: false,
    message: "School ID is required",
  });
}
    const result = await userService.getSchool(id);

    return res.status(result.success ? 200 : 401).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
      data: [],
    });
  }
}

