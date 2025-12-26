import * as superAdminService from "../superadmin/superadmin.service.js";

export async function registerSuperAdmin(req, res) {
  try {
    const result = await superAdminService.registerSuperAdmin(req.body);

    return res
      .status(result.success ? 201 : 400)
      .json({
        success: result.success,
        message: result.message,
        data: result.data || []
      });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      data: []
    });
  }
}

export async function loginSuperAdmin(req, res) {
  try {
    const { email, password } = req.body;

    const result = await superAdminService.loginSuperAdmin(email, password);

    if (!result.success) {
      return res.status(401).json({
        success: false,
        message: result.message,
        token: null
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token: result.token
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      token: null
    });
  }
}
