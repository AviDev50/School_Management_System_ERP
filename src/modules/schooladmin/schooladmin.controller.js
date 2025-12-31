import * as schoolAdminService from "./schooladmin.service.js";

export async function registerTeacher(req, res) {
  try {
    const result = await schoolAdminService.registerTeacher(req.body, req.user.school_id);
    return res.status(201).json({ success: true, message: "Teacher registered successfully", data: result });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

export async function registerStudent(req, res) {
  try {
    const result = await schoolAdminService.registerStudent(req.body, req.user.school_id);
    return res.status(201).json({ success: true, message: "Student registered successfully", data: result });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

export async function registerAccountant(req, res) {
  try {
    const result = await schoolAdminService.registerAccountant(req.body, req.user.school_id);
    return res.status(201).json({ success: true, message: "Accountant registered successfully", data: result });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}
