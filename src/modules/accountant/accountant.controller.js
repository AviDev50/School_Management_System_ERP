import * as accountantService from './accountant.service.js';

export async function updateStudent(req, res) {
  try {
    const school_id = req.user.school_id;
    const { student_id } = req.body;

    const photos = {};
    if (req.files) {
      if (req.files.student_photo)
        photos.student_photo = req.files.student_photo[0].path;

      if (req.files.aadhar_card)
        photos.aadhar_card = req.files.aadhar_card[0].path;

      if (req.files.father_photo)
        photos.father_photo = req.files.father_photo[0].path;

      if (req.files.mother_photo)
        photos.mother_photo = req.files.mother_photo[0].path;
    }

    const result = await schoolAdminService.updateStudentService(
      student_id,
      {
        ...req.body,
        ...photos
      },
      school_id
    );

    return res.json({
      success: true,
      message: "Student updated successfully",
      data: result
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
}

export async function updateTeacher(req, res) {
  try {
    const school_id = req.user.school_id;
    const { teacher_id } = req.body;

    const photos = {};
    if (req.files) {
      if (req.files.teacher_photo)
        photos.teacher_photo = req.files.teacher_photo[0].path;

      if (req.files.aadhar_card)
        photos.aadhar_card = req.files.aadhar_card[0].path;
    }

    const result = await accountantService.updateTeacherService(
      teacher_id,
      { ...req.body, ...photos },
      school_id
    );

    return res.json({
      success: true,
      message: "Teacher updated successfully",
      data: result
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
}

export async function updateAccountant(req, res) {
  try {
    const school_id = req.user.school_id;
    const { accountant_id } = req.body;

    const photos = {};
    if (req.files) {
      if (req.files.accountant_photo)
        photos.accountant_photo = req.files.accountant_photo[0].path;

      if (req.files.aadhar_card)
        photos.aadhar_card = req.files.aadhar_card[0].path;
    }

    const result = await accountantService.updateAccountantService(
      accountant_id,
      { ...req.body, ...photos },
      school_id
    );

    return res.json({
      success: true,
      message: "Accountant updated successfully",
      data: result
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
}

