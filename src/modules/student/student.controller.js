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
    const { student_id, gender, class_id, section_id } = req.body;

    if (!student_id) {
      return res.status(400).json({ message: "Student ID required" });
    }

    // Sirf yahi fields update hongi
    const data = { gender, class_id, section_id };

    const updatedStudent = await studentService.updateStudentService(
      student_id,
      school_id,
      data
    );

    return res.json({
      success: true,
      message: "Student updated successfully",
      data: updatedStudent
    });

  } catch (err) {
    return res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
}