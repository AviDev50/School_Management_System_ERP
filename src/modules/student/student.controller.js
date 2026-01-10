import * as studentService from "./student.service.js";

export async function getStudentDetailsById(req, res) {
  try {
    const result = await studentService.getStudentByIdService(req.params, req);

    return res.status(200).json({
      success: true,
      message: "Student details get successfully",
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
}
