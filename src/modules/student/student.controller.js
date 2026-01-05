import * as studentService from "./student.service.js";

export async function getStudentDetailsById(req, res) {
  try {
    const result = await studentService.getStudentByIdService(req.params);
    return res.status(201).json({ success: true, message: "Student details get successfully", data: result });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

export async function updateStudent(req, res) {
  try {
    const { school_id } = req.user;
    const body = req.body || {};

    const student_id = body.student_id;

    if (!student_id) {
      return res.status(400).json({
        success: false,
        message: "student_id is required"
      });
    }

    const result = await studentService.updateStudentService(
      student_id,
      school_id,
      body
    );

    return res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: result
    });

  } catch (error) {
    console.error("Update Student Error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
}
