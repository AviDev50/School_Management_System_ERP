import * as studentService from "./student.service.js";

export async function getStudentDetailsById(req, res) {
  try {
    const result = await studentService.getStudentByIdService(req.params);
    return res.status(201).json({ success: true, message: "Student details get successfully", data: result });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

export async function upsertStudentById(req, res) {
  try {
    const result = await studentService.upsertStudentService(req.body);
    console.log(req.body)

    return res.status(200).json({
      success: true,
      message: "Student details saved successfully",
      data: result
    });

  } catch (error) {
    console.error("Upsert Student Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to save student details"
    });
  }
}



