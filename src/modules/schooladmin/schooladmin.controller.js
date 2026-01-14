import * as schoolAdminService from "./schooladmin.service.js";

export async function registerTeacher(req, res) {
  try {
    const school_id = req.user.school_id;

    // here we get path from files
    const photos = {};
    if (req.files) {
      photos.teacher_photo = req.files.teacher_photo?.[0]?.path || null;
      photos.aadhar_card = req.files.aadhar_card?.[0]?.path || null;
    }

    const result = await schoolAdminService.registerTeacherService({
      ...req.body,
      ...photos,
      school_id
    });

    return res.status(201).json({
      success: true,
      message: "Teacher registered successfully",
      data: result
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
}

export async function registerStudent(req, res) {
  try {
    const school_id = req.user.school_id;

    //here we add Uploaded files paths
    const photos = {};
    if (req.files) {
      photos.student_photo = req.files.student_photo?.[0]?.path || null;
      photos.aadhar_card = req.files.aadhar_card?.[0]?.path || null;
      photos.father_photo = req.files.father_photo?.[0]?.path || null;
      photos.mother_photo = req.files.mother_photo?.[0]?.path || null;
    }

    const result = await schoolAdminService.registerStudentService({
      ...req.body,
      ...photos,
      school_id
    });

    return res.status(201).json({
      success: true,
      message: "Student registered successfully",
      data: result
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
}

export async function registerAccountant(req, res) {
  try {
    const school_id = req.user.school_id;

    const photos = {};
    if (req.files) {
      photos.accountant_photo = req.files.accountant_photo?.[0]?.path || null;
      photos.aadhar_card = req.files.aadhar_card?.[0]?.path || null;
    }

    const result = await schoolAdminService.registerAccountantService({
      ...req.body,
      ...photos,
      school_id
    });

    return res.status(201).json({
      success: true,
      message: "Accountant registered successfully",
      data: result
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
}

export async function getTotalStudentsListBySchoolId(req, res) {
  try {
    const school_id = req.user.school_id;  // come from Auth middleware se milega
    const { page, limit } = req.query; 
    
    const result = await schoolAdminService.getTotalStudentsListService({
      school_id,
      page,
      limit
    },req);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
}

export async function getTotalTeachersListBySchoolId(req, res) {
  try {
    const school_id = req.user.school_id; 
    const { page, limit } = req.query;     
    
    const result = await schoolAdminService.getTotalTeachersListService({
      school_id,
      page,
      limit
    },req);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    return res.status(200).json(result); 
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
}

export async function getTotalAccountantsListBySchoolId(req, res) {
  try {
    const school_id = req.user.school_id;  
    const { page, limit } = req.query;  
    
    const result = await schoolAdminService.getTotalAccountantsListService({
      school_id,
      page,
      limit
    },req);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    return res.status(200).json(result); 
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
}

export async function addNewClass(req,res) {
  try{const result = await schoolAdminService.addNewClassService(req.body);
  return res.status(201).json({success:true,message:"Class added successfully",data:[result]})
} catch(error){
  return res.status(400).json({success: false, message: error.message});
}
}

export async function createClass(req, res) {
  try {
    const school_id = req.user.school_id;
    const result = await schoolAdminService.createClassService(school_id, req.body);

    res.json({
      success: true,
      message: "Class created successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function updateClass(req, res) { 
  try {
    const { class_id } = req.body;
    const school_id = req.user.school_id;
    console.log(req.body)

    await schoolAdminService.updateClassService(class_id, school_id, req.body);

    res.json({
      success: true,
      message: "Class updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getAllClasses(req, res) {
  try {
    const school_id = req.user.school_id;

    const classes = await schoolAdminService.getAllClassesService(school_id);

    res.json({
      success: true,
      data: classes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function deleteClass(req, res) {
  try {
    const { class_id } = req.body;
    const school_id = req.user.school_id;
    console.log(req.body)

    await schoolAdminService.deleteClassService(class_id, school_id);

    res.json({
      success: true,
      message: "Class deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function createSection(req, res) {
  try {
    const school_id = req.user.school_id;

    const result = await schoolAdminService.createSectionService(school_id, req.body);

    res.json({
      success: true,
      message: "Section created successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function updateSection(req, res) {
  try {
    const { section_id } = req.params;
    const school_id = req.user.school_id;

    await schoolAdminService.updateSectionService(section_id, school_id, req.body);

    res.json({
      success: true,
      message: "Section updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getAllSections(req, res) {
  try {
    const school_id = req.user.school_id;
    const { class_id } = req.query;

    const sections = await schoolAdminService.getAllSectionsService(school_id, class_id);

    res.json({
      success: true,
      data: sections,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function deleteSection(req, res) {
  try {
    const { section_id } = req.body;
    const school_id = req.user.school_id;

    await schoolAdminService.deleteSectionService(section_id, school_id);

    res.json({
      success: true,
      message: "Section deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function createSubject(req, res) {
  try {
    const school_id = req.user.school_id;

    const result = await schoolAdminService.createSubjectService(school_id, req.body);

    res.json({
      success: true,
      message: "Subject created successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function updateSubject(req, res) {
  try {
    const { subject_id, subject_name} = req.body;

    const school_id = req.user.school_id;

    await schoolAdminService.updateSubjectService(subject_id,subject_name,school_id);

    res.json({
      success: true,
      message: "Subject updated successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getAllSubjects(req, res) {
  try {
    const school_id = req.user.school_id;

    const subjects = await schoolAdminService.getAllSubjectsService(school_id);

    res.json({
      success: true,
      data: subjects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function deleteSubject(req, res) {
  try {
    const { subject_id } = req.body;
    const school_id = req.user.school_id;

    await schoolAdminService.deleteSubjectService(subject_id, school_id);

    res.json({
      success: true,
      message: "Subject deleted successfully",
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function createTimetable(req, res) {
  try {
    const school_id = req.user.school_id;
    const {
      class_id,
      section_id,
      subject_id,
      teacher_id,
      day_of_week,
      start_time,
      end_time,
    } = req.body;

    if (
      !class_id ||
      !section_id ||
      !subject_id ||
      !teacher_id ||
      !day_of_week ||
      !start_time ||
      !end_time
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    await schoolAdminService.createTimetableService({
      school_id,
      class_id,
      section_id,
      subject_id,
      teacher_id,
      day_of_week,
      start_time,
      end_time,
    });

    res.status(201).json({
      success: true,
      message: "Timetable created successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}


export async function updateTimetable(req, res) {
  try {
    const school_id = req.user.school_id;
    const { timetable_id } = req.params;

    if (!timetable_id) {
      return res.status(400).json({
        success: false,
        message: "timetable_id required",
      });
    }

    await schoolAdminService.updateTimetableService(
      timetable_id,
      school_id,
      req.body
    );

    res.json({
      success: true,
      message: "Timetable updated successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

export async function deleteTimetable(req, res) {
  try {
    await schoolAdminService.deleteTimetableService(req.body.timetable_id);
    res.json({ message: "Timetable deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getTimetable(req, res) {
  try {
    const school_id = req.user.school_id; 
    const { class_id, section_id} = req.params;
     console.log("PARAMS:", req.params);
     console.log("SCHOOL ID:", school_id);

    if (!class_id || !section_id) {
      return res.status(400).json({
        success: false,
        message: "class_id, section_id required",
      });
    }

    const data = await schoolAdminService.getTimetable(
      school_id,
      class_id,
      section_id
    );

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function createStudentAttendance(req, res) {
  try {
    const school_id = req.user.school_id;
    await schoolAdminService.createAttendanceService(req.body, school_id);
    res.json({ message: "Attendance marked successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateStudentAttendance(req, res) {
  try {
    const school_id = req.user.school_id;
    const { attendance_id } = req.params;

    await schoolAdminService.updateAttendanceService(
      attendance_id,
      req.body,
      school_id
    );

    res.json({ message: "Attendance updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getStudentAttendance(req, res) {
  try {
    const school_id = req.user.school_id;
    const data = await schoolAdminService.getAttendanceService(
      req.query,
      school_id
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function deleteStudentAttendance(req, res) {
  try {
    const school_id = req.user.school_id;
    const { attendance_id } = req.body;

    await schoolAdminService.deleteAttendanceService(
      attendance_id,
      school_id
    );

    res.json({ message: "Attendance deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getStudentById(req, res) {
  try {
    const { student_id } = req.params;
    const school_id = req.user.school_id;
       if (!student_id) {
      return res.status(400).json({
        success: false,
        message: "student_id must be a valid positive number"
      });
    }

    const data = await schoolAdminService.getStudentByIdService(
      student_id,
      school_id,
      req
    );

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    return res.json({
      success: true,
      data
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
}

export async function getTeacherById(req, res) {
  try {
    const { teacher_id } = req.params;
    const school_id = req.user.school_id;

    const data = await schoolAdminService.getTeacherByIdService(
      teacher_id,
      school_id,
      req
    );

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found"
      });
    }

    return res.json({
      success: true,
      data
    });

  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
}

export async function getAccountantById(req, res) {
  try {
    const { accountant_id } = req.params;
    const school_id = req.user.school_id;

    const data = await schoolAdminService.getAccountantByIdService(
      accountant_id,
      school_id,
      req
    );

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Accountant not found"
      });
    }

    return res.json({
      success: true,
      data
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
}

export async function createFee(req, res) {
  try {
    const school_id = req.user.school_id;
    const {
      class_id,
      fee_type,
      amount,
      academic_year,
      status
    } = req.body;

    if (!class_id || !fee_type || !amount) {
      return res.status(400).json({
        success: false,
        message: "class_id, fee_type and amount are required"
      });
    }

    const result = await schoolAdminService.createFeeService({
      school_id,
      class_id,
      fee_type,
      amount,
      academic_year,
      status
    });

    return res.status(201).json({
      success: true,
      message: "Fee created successfully",
      data: result
    });

  } catch (error) {
    console.error("Create Fee Error:", error.message);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "Fee already exists for this class and academic year"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}

export async function getFees(req, res) {
  try {
    const school_id = req.user.school_id;

    let {
      class_id,
      academic_year,
      status,
      page = 1,
      limit = 10
    } = req.query;

    page = Number(page) || 1;
    limit = Number(limit) || 10;

    if (status !== undefined) {
      status = Number(status);
    }

    const result = await schoolAdminService.getFeesService({
      school_id,
      class_id,
      academic_year,
      status,
      page,
      limit
    });

    return res.status(200).json({
      success: true,
      message: "Fees fetched successfully",
      data: result.data,
      pagination: result.pagination
    });

  } catch (error) {
    console.error("Get Fees Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}

export async function updateFeeById(req, res) {
  try {
    const school_id = req.user.school_id;
    const { fee_id } = req.body;

    const {
      class_id,
      fee_type,
      amount,
      academic_year,
      status
    } = req.body;

    if (!fee_id) {
      return res.status(400).json({
        success: false,
        message: "fee_id is required"
      });
    }

    const result = await schoolAdminService.updateFeeService({
      fee_id,
      school_id,
      class_id,
      fee_type,
      amount,
      academic_year,
      status
    });

    return res.status(200).json({
      success: true,
      message: "Fee updated successfully",
      data: result
    });

  } catch (error) {
    console.error("Update Fee Error:", error.message);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "Duplicate fee exists for this class and academic year"
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
}

export async function deleteFeeById(req, res) {
  try {
    const school_id = req.user.school_id;
    const { fee_id } = req.body;

    if (!fee_id) {
      return res.status(400).json({
        success: false,
        message: "fee_id is required"
      });
    }

    await schoolAdminService.deleteFeeService(fee_id, school_id);

    return res.status(200).json({
      success: true,
      message: "Fee deleted successfully"
    });

  } catch (error) {
    console.error("Delete Fee Error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
}

export async function updateStudent(req, res) {
  try {
    const school_id = req.user.school_id;
    const { student_id } = req.body;
    console.log(req.body)

    if (!student_id) {
      return res.status(400).json({
        success: false,
        message: "student_id is required"
      });
    }

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

    const result = await schoolAdminService.updateStudentService({
      ...req.body,
      ...photos,
      school_id
    });

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

    if (!teacher_id) {
      return res.status(400).json({
        success: false,
        message: "teacher_id is required"
      });
    }

    const photos = {};
    if (req.files) {
      if (req.files.teacher_photo)
        photos.teacher_photo = req.files.teacher_photo[0].path;

      if (req.files.aadhar_card)
        photos.aadhar_card = req.files.aadhar_card[0].path;
    }

    const result = await schoolAdminService.updateTeacherService(
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
    const {accountant_id} = req.body

    if (!accountant_id) {
      return res.status(400).json({
        success: false,
        message: "accountant_id is required"
      });
    }

    const photos = {};
    if (req.files) {
      if (req.files.accountant_photo)
        photos.accountant_photo = req.files.accountant_photo[0].path;

      if (req.files.aadhar_card)
        photos.aadhar_card = req.files.aadhar_card[0].path;
    }

    const result = await schoolAdminService.updateAccountantService(
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

export async function deleteStudentById(req, res) {
  try {
    const school_id = req.user.school_id;
    const { student_id } = req.body;

    if (!student_id) {
      return res.status(400).json({
        success: false,
        message: "student_id is required"
      });
    }

    await schoolAdminService.deleteStudentService(student_id, school_id);

    return res.json({
      success: true,
      message: "Student deleted successfully"
    });

  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
}

export async function deleteTeacherById(req, res) {
  try {
    const school_id = req.user.school_id;
    const { teacher_id } = req.body;

    if (!teacher_id) {
      return res.status(400).json({
        success: false,
        message: "teacher_id is required"
      });
    }

    await schoolAdminService.deleteTeacherService(teacher_id, school_id);

    return res.json({
      success: true,
      message: "Teacher deleted successfully"
    });

  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
}

export async function deleteAccountantById(req, res) {
  try {
    const school_id = req.user.school_id;
    const { accountant_id } = req.body;

    if (!accountant_id) {
      return res.status(400).json({
        success: false,
        message: "accountant_id is required"
      });
    }

    await schoolAdminService.deleteAccountantService(accountant_id, school_id);

    return res.json({
      success: true,
      message: "Accountant deleted successfully"
    });

  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
}









