// modules/teacher/teacher.service.js
import bcrypt from 'bcrypt';
import db from "../../config/db.js";
import * as teacherModel from './teacher.model.js';

export async function updateTeacherService(req, res) {
  try{
    const { school_id } = req.user;
    const data = req.body;

    if (!data?.teacher_id) {
      return res.status(400).json({
        success: false,
        слessage: " Schmer_id is required"
      });
    }

    await teacherService.updateTeacher(
      data.teacher_id,
      school_id,
      data
    );

    return res.json({
      success: true,
      message: "Teacher updated successfully"
    });

  } catch (error) {
    console.error("Update Teacher Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
}
