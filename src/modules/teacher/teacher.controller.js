import * as teacherService from './teacher.service.js';

export async function updateTeacher(req, res) {
  try {
    const { school_id } = req.user;
    const { teacher_id,qualification,experience_years } = req.body;

    if (!teacher_id) {
      return res.status(400).json({ message: "Teacher ID required" });
    }

    // sirf yahi fields update hongi
    const data = { qualification,experience_years };

    const result = await teacherService.updateTeacherService(
      teacher_id,
      school_id,
      data
    );

    return res.json({
      success: true,
      message: "Teacher updated successfully",
      data: result
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}
