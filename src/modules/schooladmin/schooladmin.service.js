import fs from "fs";
import db from "../../config/db.js";
import bcrypt from "bcrypt";
import * as schoolAdminModel from "./schooladmin.model.js";

// Common function for all 
export async function registerUserService(data, connection) {
  const existing = await schoolAdminModel.findUserByEmailAndSchool(
    data.user_email,
    data.school_id,
    connection
  );

  if (existing.length > 0) {
    throw new Error("Email already exists");
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(data.password, saltRounds);

  const userData = {
    school_id: data.school_id,
    name: data.name,
    user_email: data.user_email,
    password: hashedPassword,
    role: data.role
  };

  return await schoolAdminModel.insertUser(userData, connection);
}

export async function registerTeacherService(data) {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const {
      school_id,
      name,
      user_email,
      password,
      qualification,
      father_name,
      mother_name,
      mobile_number,
      address,
      teacher_photo,
      aadhar_card
    } = data;

    const user_id = await registerUserService(
      {
        name,
        user_email,
        password,
        role: "teacher",
        school_id
      },
      connection
    );

    await schoolAdminModel.createTeacher(
      {
        school_id,
        user_id,
        qualification,
        father_name,
        mother_name,
        mobile_number,
        address,
        teacher_photo,
        aadhar_card
      },
      connection
    );

    await connection.commit();
    return { user_id };

  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

export async function registerStudentService(data) {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const {
      name,
      user_email,
      password,
      school_id,
      section_id,
      class_id,
      admission_no,
      gender,
      dob,
      mobile_number,
      father_name,
      mother_name,
      address,
      student_photo,
      aadhar_card,
      father_photo,
      mother_photo
    } = data;

    const user_id = await registerUserService(
      {
        name,
        user_email,
        password,
        role: "student",
        school_id
      },
      connection
    );

    await schoolAdminModel.createStudent(
      {
      school_id,
      user_id,
      section_id,
      class_id,
      admission_no,
      gender,
      dob,
      mobile_number,
      father_name,
      mother_name,
      address,
      student_photo,
      aadhar_card,
      father_photo,
      mother_photo
      },
      connection
    );

    await connection.commit();
    return { user_id };

  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

export async function registerAccountantService(data) {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const {
      name,
      user_email,
      password,
      school_id,
      qualification,
      mobile_number,
      experience_years,
      address,
      father_name,
      mother_name,
      accountant_photo,
      aadhar_card
    } = data;

    const user_id = await registerUserService(
      {
        name,
        user_email,
        password,
        role: "accountant",
        school_id
      },
      connection
    );

    await schoolAdminModel.createAccountant(
      {
      school_id,
      user_id,
      qualification,
      mobile_number,
      experience_years,
      address,
      father_name,
      mother_name,
      accountant_photo,
      aadhar_card
      },
      connection
    );

    await connection.commit();
    return { user_id };

  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

export async function getTotalStudentsListService(data, req) {
  const { school_id, page = 1, limit = 10 } = data;

  if (!school_id || isNaN(school_id)) {
    throw new Error("Valid school_id is required");
  }

  const offset = (page - 1) * limit;
  const baseUrl = `${req.protocol}://${req.get("host")}`;

  const result = await schoolAdminModel.getStudentsList({
    school_id,
    limit: Number(limit),
    offset,
  });

  const mappedResult = result.map(row => {
    const {
      student_photo,
      father_photo,
      mother_photo,
      aadhar_card,
      ...safeData
    } = row;

    return {
      ...safeData,

      student_photo_url: student_photo
        ? `${baseUrl}/${student_photo.replace(/\\/g, "/")}`
        : null,

      father_photo_url: father_photo
        ? `${baseUrl}/${father_photo.replace(/\\/g, "/")}`
        : null,

      mother_photo_url: mother_photo
        ? `${baseUrl}/${mother_photo.replace(/\\/g, "/")}`
        : null,

      aadhar_card_url: aadhar_card
        ? `${baseUrl}/${aadhar_card.replace(/\\/g, "/")}`
        : null
    };
  });

  const totalCount = await schoolAdminModel.getTotalStudentsCount(school_id);

  return {
    success: true,
    message: "Students list fetched successfully",
    data: mappedResult,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
}

//added pagination here
export async function getTotalTeachersListService(data, req) {
  const { school_id, page = 1, limit = 10 } = data;

  if (!school_id || isNaN(school_id)) {
    throw new Error("Valid school_id is required");
  }

  const offset = (page - 1) * limit;
  const baseUrl = `${req.protocol}://${req.get("host")}`;

  const result = await schoolAdminModel.getTeachersList({
    school_id,
    limit: Number(limit),
    offset,
  });

  const mappedResult = result.map(row => {
    const {
      teacher_photo,
      aadhar_card,
      ...safeData
    } = row;

    return {
      ...safeData,

      teacher_photo_url: teacher_photo
        ? `${baseUrl}/${teacher_photo.replace(/\\/g, "/")}`
        : null,

      aadhar_card_url: aadhar_card
        ? `${baseUrl}/${aadhar_card.replace(/\\/g, "/")}`
        : null
    };
  });

  const totalCount = await schoolAdminModel.getTotalTeachersCount(school_id);

  return {
    success: true,
    message: "Teachers list fetched successfully",
    data: mappedResult,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
}

export async function getTotalAccountantsListService(data, req) {
  const { school_id, page = 1, limit = 10 } = data;

  if (!school_id || isNaN(school_id)) {
    throw new Error("Valid school_id is required");
  }

  const offset = (page - 1) * limit;
  const baseUrl = `${req.protocol}://${req.get("host")}`;

  const result = await schoolAdminModel.getAccountantsList({
    school_id,
    limit: Number(limit),
    offset,
  });

  const mappedResult = result.map(row => {
    const {
      accountant_photo,
      aadhar_card,
      ...safeData
    } = row;

    return {
      ...safeData,

      accountant_photo_url: accountant_photo
        ? `${baseUrl}/${accountant_photo.replace(/\\/g, "/")}`
        : null,

      aadhar_card_url: aadhar_card
        ? `${baseUrl}/${aadhar_card.replace(/\\/g, "/")}`
        : null
    };
  });

  const totalCount = await schoolAdminModel.getTotalAccountantsCount(school_id);

  return {
    success: true,
    message: "Accountants list fetched successfully",
    data: mappedResult,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
}

export async function createClassService(school_id, data) {
  return await schoolAdminModel.createClass(school_id, data);
}

export async function updateClassService(class_id, school_id, data) {
  const updated = await schoolAdminModel.updateClass(class_id, school_id, data);

  if (!updated) {
    throw new Error("Class not found or not updated");
  }

  return true;
}

export async function getAllClassesService(school_id) {
  return await schoolAdminModel.getAllClasses(school_id);
}

export async function deleteClassService(class_id, school_id) {
  await schoolAdminModel.deleteClass(class_id, school_id);
  return true;
}

export async function createSectionService(school_id, data) {
  return await schoolAdminModel.createSection(school_id, data);
}

export async function updateSectionService(section_id, school_id, data) {
  await schoolAdminModel.updateSection(section_id, school_id, data);
  return true;
}

export async function getAllSectionsService(school_id, class_id) {
  return await schoolAdminModel.getAllSections(school_id, class_id);
}

export async function deleteSectionService(section_id, school_id) {
  await schoolAdminModel.deleteSection(section_id, school_id);
  return true;
}

export async function createSubjectService(school_id, data) {
  return await schoolAdminModel.createSubject(school_id, data);
}

export async function updateSubjectService(subject_id,subject_name, school_id) {
  await schoolAdminModel.updateSubject(subject_id,subject_name,school_id);
  return true;
}

export async function getAllSubjectsService(school_id) {
  return await schoolAdminModel.getAllSubjects(school_id);
}

export async function deleteSubjectService(subject_id, school_id) {
  await schoolAdminModel.deleteSubject(subject_id, school_id);
  return true;
}

export async function createTimetableService(data) {
  return await schoolAdminModel.createTimetable(data);
}

export async function updateTimetableService(timetable_id, data) {
  return await schoolAdminModel.updateTimetable(timetable_id, data);
}

export async function deleteTimetableService(timetable_id) {
  return await schoolAdminModel.deleteTimetable(timetable_id);
}

export async function getTimetable(school_id, class_id, section_id) {
  return await schoolAdminModel.getTimetable({
    school_id,
    class_id,
    section_id,
  });
}

export async function getStudentByIdService(student_id, school_id, req) {

  const result = await schoolAdminModel.getStudentById(
    student_id,
    school_id
  );

  if (!result.length) return null;

  const row = result[0];
  const baseUrl = `${req.protocol}://${req.get("host")}`;

  const {
    student_photo,
    father_photo,
    mother_photo,
    aadhar_card,
    ...safeData
  } = row;

  return {
    ...safeData,

    student_photo_url: student_photo
      ? `${baseUrl}/${student_photo.replace(/\\/g, "/")}`
      : null,

    father_photo_url: father_photo
      ? `${baseUrl}/${father_photo.replace(/\\/g, "/")}`
      : null,

    mother_photo_url: mother_photo
      ? `${baseUrl}/${mother_photo.replace(/\\/g, "/")}`
      : null,

    aadhar_card_url: aadhar_card
      ? `${baseUrl}/${aadhar_card.replace(/\\/g, "/")}`
      : null
  };
}

export async function getTeacherByIdService(teacher_id, school_id, req) {
  const result = await schoolAdminModel.getTeacherById(
    teacher_id,
    school_id
  );

  if (!result.length) return null;

  const row = result[0];
  const baseUrl = `${req.protocol}://${req.get("host")}`;

  const {
    teacher_photo,
    aadhar_card,
    ...safeData
  } = row;

  return {
    ...safeData,

    teacher_photo_url: teacher_photo
      ? `${baseUrl}/${teacher_photo.replace(/\\/g, "/")}`
      : null,

    aadhar_card_url: aadhar_card
      ? `${baseUrl}/${aadhar_card.replace(/\\/g, "/")}`
      : null
  };
}

export async function getAccountantByIdService(accountant_id, school_id, req) {
  const result = await schoolAdminModel.getAccountantById(
    accountant_id,
    school_id
  );

  if (!result.length) return null;

  const row = result[0];
  const baseUrl = `${req.protocol}://${req.get("host")}`;

  const {
    accountant_photo,
    aadhar_card,
    ...safeData
  } = row;

  return {
    ...safeData,

    accountant_photo_url: accountant_photo
      ? `${baseUrl}/${accountant_photo.replace(/\\/g, "/")}`
      : null,

    aadhar_card_url: aadhar_card
      ? `${baseUrl}/${aadhar_card.replace(/\\/g, "/")}`
      : null
  };
}

export async function createFeeService(data) {
  const {
    school_id,
    class_id,
    fee_type,
    amount,
    academic_year,
    status = 1
  } = data;

  if (Number(amount) <= 0) {
    throw new Error("Amount must be greater than zero");
  }

  const insertResult = await schoolAdminModel.insertFee({
    school_id,
    class_id,
    fee_type,
    amount,
    academic_year,
    status
  });

  return {
    fee_id: insertResult.insertId,
    school_id,
    class_id,
    fee_type,
    amount,
    academic_year,
    status
  };
}

export async function getFeesService(filters) {
  const {
    school_id,
    class_id,
    academic_year,
    status,
    page,
    limit
  } = filters;

  const offset = Number((page - 1) * limit);

  const [rows, total] = await Promise.all([
    schoolAdminModel.getFeesList({
      school_id,
      class_id,
      academic_year,
      status,
      limit: Number(limit),
      offset
    }),
    schoolAdminModel.getFeesCount({
      school_id,
      class_id,
      academic_year,
      status
    })
  ]);

  return {
    data: rows,
    pagination: {
      page,
      limit,
      total_records: total,
      total_pages: Math.ceil(total / limit)
    }
  };
}

//here we uses new way payload filtering fields
export async function updateFeeService(data) {
  const { fee_id, school_id, ...rest } = data;

  // here we remove all undefined fields using filter means if any field data not sent from frontend then we don't take that 
  const payload = Object.fromEntries(
    Object.entries(rest).filter(([_, v]) => v !== undefined)
  );

  if (Object.keys(payload).length === 0) {
    throw new Error("Nothing to update");
  }

  if (payload.amount !== undefined && Number(payload.amount) <= 0) {
    throw new Error("Amount must be greater than zero");
  }

  await schoolAdminModel.updateFee(fee_id, school_id, payload);

  return {
    fee_id,
    ...payload
  };
}

export async function deleteFeeService(fee_id, school_id) {

  const fee = await schoolAdminModel.getFeeById(fee_id, school_id);

  if (!fee) {
    throw new Error("Fee not found");
  }

  if (fee.status === 0) {
    throw new Error("Fee already deleted");
  }

  await schoolAdminModel.softDeleteFee(fee_id, school_id);
}

export async function updateStudentService(data) {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const {
      student_id,
      school_id,

      // user fields
      name,
      user_email,
      password,

      // student fields
      admission_no,
      gender,
      class_id,
      section_id,

      // photos
      student_photo,
      aadhar_card,
      father_photo,
      mother_photo
    } = data;

    //here we get old image
    const oldPhotos = await schoolAdminModel.getStudentPhotosById(
      student_id,
      school_id,
      connection
    );

    //here we update user
    const userUpdateData = {};
    if (name) userUpdateData.name = name;
    if (user_email) userUpdateData.user_email = user_email;
    if (password) {
      userUpdateData.password = await bcrypt.hash(password, 10);
    }

    if (Object.keys(userUpdateData).length > 0) {
      await schoolAdminModel.updateUserByStudentId(
        student_id,
        school_id,
        userUpdateData,
        connection
      );
    }

    //here we update student
    const studentUpdateData = {};
    if (admission_no) studentUpdateData.admission_no = admission_no;
    if (gender) studentUpdateData.gender = gender;
    if (class_id) studentUpdateData.class_id = class_id;
    if (section_id) studentUpdateData.section_id = section_id;

    if (student_photo) studentUpdateData.student_photo = student_photo;
    if (aadhar_card) studentUpdateData.aadhar_card = aadhar_card;
    if (father_photo) studentUpdateData.father_photo = father_photo;
    if (mother_photo) studentUpdateData.mother_photo = mother_photo;

    if (Object.keys(studentUpdateData).length > 0) {
      await schoolAdminModel.updateStudentById(
        student_id,
        school_id,
        studentUpdateData,
        connection
      );
    }

    //here we commit transaction
    await connection.commit();

    //here we delete old image after successful commit
    if (student_photo && oldPhotos?.student_photo) {
      fs.unlink(oldPhotos.student_photo, () => {});
    }
    if (aadhar_card && oldPhotos?.aadhar_card) {
      fs.unlink(oldPhotos.aadhar_card, () => {});
    }
    if (father_photo && oldPhotos?.father_photo) {
      fs.unlink(oldPhotos.father_photo, () => {});
    }
    if (mother_photo && oldPhotos?.mother_photo) {
      fs.unlink(oldPhotos.mother_photo, () => {});
    }

    return { student_id };

  } catch (err) {
    await connection.rollback();
    throw err;

  } finally {
    connection.release();
  }
}

export async function updateTeacherService(teacher_id, data, school_id) {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const {
      // user fields
      name,
      user_email,
      password,

      // teacher fields
      qualification,
      experience_years,
      joining_date,

      // photos
      teacher_photo,
      aadhar_card
    } = data;

    //here we get old image
    const oldPhotos = await schoolAdminModel.getTeacherPhotosById(
      teacher_id,
      school_id,
      connection
    );

  //here we update user
    const userUpdateData = {};
    if (name) userUpdateData.name = name;
    if (user_email) userUpdateData.user_email = user_email;
    if (password) {
      userUpdateData.password = await bcrypt.hash(password, 10);
    }

    if (Object.keys(userUpdateData).length > 0) {
      await schoolAdminModel.updateUserByTeacherId(
        teacher_id,
        school_id,
        userUpdateData,
        connection
      );
    }

      //here we update teacher
    const teacherUpdateData = {};
    if (qualification) teacherUpdateData.qualification = qualification;
    if (experience_years !== undefined)
      teacherUpdateData.experience_years = experience_years;
    if (joining_date) teacherUpdateData.joining_date = joining_date;
    if (teacher_photo) teacherUpdateData.teacher_photo = teacher_photo;
    if (aadhar_card) teacherUpdateData.aadhar_card = aadhar_card;

    if (Object.keys(teacherUpdateData).length > 0) {
      await schoolAdminModel.updateTeacherById(
        teacher_id,
        school_id,
        teacherUpdateData,
        connection
      );
    }

    //here we commit
    await connection.commit();
    
    //here we deleted old image after commit
    if (teacher_photo && oldPhotos?.teacher_photo) {
      fs.unlink(oldPhotos.teacher_photo, () => {});
    }
    if (aadhar_card && oldPhotos?.aadhar_card) {
      fs.unlink(oldPhotos.aadhar_card, () => {});
    }

    return { teacher_id };

  } catch (err) {
    await connection.rollback();
    throw err;

  } finally {
    connection.release();
  }
}

export async function updateAccountantService(accountant_id, data, school_id) {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const {
      // user fields
      name,
      user_email,
      password,

      // accountant fields
      qualification,

      // photos
      accountant_photo,
      aadhar_card
    } = data;

   //here we get old image
    const oldPhotos = await schoolAdminModel.getAccountantPhotosById(
      accountant_id,
      school_id,
      connection
    );

   //here we update user
    const userUpdateData = {};
    if (name) userUpdateData.name = name;
    if (user_email) userUpdateData.user_email = user_email;
    if (password) {
      userUpdateData.password = await bcrypt.hash(password, 10);
    }

    if (Object.keys(userUpdateData).length > 0) {
      await schoolAdminModel.updateUserByAccountantId(
        accountant_id,
        school_id,
        userUpdateData,
        connection
      );
    }
    
    //here we update accountant
    const accountantUpdateData = {};
    if (qualification) accountantUpdateData.qualification = qualification;
    if (accountant_photo)
      accountantUpdateData.accountant_photo = accountant_photo;
    if (aadhar_card) accountantUpdateData.aadhar_card = aadhar_card;

    if (Object.keys(accountantUpdateData).length > 0) {
      await schoolAdminModel.updateAccountantById(
        accountant_id,
        school_id,
        accountantUpdateData,
        connection
      );
    }

    //here we commit 
    await connection.commit();

    //here we delete old image after commit
    if (accountant_photo && oldPhotos?.accountant_photo) {
      fs.unlink(oldPhotos.accountant_photo, () => {});
    }
    if (aadhar_card && oldPhotos?.aadhar_card) {
      fs.unlink(oldPhotos.aadhar_card, () => {});
    }

    return { accountant_id };

  } catch (err) {
    await connection.rollback();
    throw err;

  } finally {
    connection.release();
  }
}

export async function deleteStudentService(student_id, school_id) {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    await schoolAdminModel.softDeleteStudent(
      student_id,
      school_id,
      connection
    );

    await schoolAdminModel.softDeleteUserByStudentId(
      student_id,
      school_id,
      connection
    );

    await connection.commit();
    return true;

  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

export async function deleteTeacherService(teacher_id, school_id) {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    await schoolAdminModel.softDeleteTeacher(
      teacher_id,
      school_id,
      connection
    );

    await schoolAdminModel.softDeleteUserByTeacherId(
      teacher_id,
      school_id,
      connection
    );

    await connection.commit();
    return true;

  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

export async function deleteAccountantService(accountant_id, school_id) {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    await schoolAdminModel.softDeleteAccountant(
      accountant_id,
      school_id,
      connection
    );

    await schoolAdminModel.softDeleteUserByAccountantId(
      accountant_id,
      school_id,
      connection
    );

    await connection.commit();
    return true;

  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

export async function createNoticeService(school_id, data) {
  const { title, message} = data;

  if (!school_id) {
    throw new Error("School ID is required");
  }

  if (!title || title.trim() === "") {
    throw new Error("Title is required");
  }

  if (!message || message.trim() === "") {
    throw new Error("Message is required");
  }

  const result = await schoolAdminModel.createNotice({
    school_id,
    title: title.trim(),
    message: message.trim()
  });

  return {
    notice_id: result.insertId,
  };
}


export async function getNoticesService(school_id) {
  if (!school_id) throw new Error("School ID is required");
  return await schoolAdminModel.getNoticesBySchool({ school_id });
}

export async function getNoticeByIdService(notice_id, school_id) {
  if (!notice_id) throw new Error("Notice ID is required");

  const notice = await schoolAdminModel.getNoticeById({ notice_id, school_id });
  if (!notice) throw new Error("Notice not found");

  return notice;
}

export async function updateNoticeService(notice_id, school_id, data) {
  if (!notice_id) throw new Error("Notice ID is required");

  const allowedFields = ["title", "message", "visible_to"];
  const fields = [];
  const values = [];

  for (const key of allowedFields) {
    if (data[key]) {
      fields.push(`${key} = ?`);
      values.push(data[key]);
    }
  }

  if (fields.length === 0) {
    throw new Error("No valid fields to update");
  }

  const result = await schoolAdminModel.updateNotice({
    notice_id,
    school_id,
    fields,
    values,
  });

  if (result.affectedRows === 0) {
    throw new Error("Notice not found or unauthorized");
  }

  return true;
}

export async function deleteNoticeService(notice_id, school_id) {
  if (!notice_id) throw new Error("Notice ID is required");

  const result = await schoolAdminModel.deleteNotice({ notice_id, school_id });

  if (result.affectedRows === 0) {
    throw new Error("Notice not found or unauthorized");
  }

  return true;
}

 //VALID_STATUS = ["P", "A", "L", "H", "OL"];

export async function createAttendanceService(school_id, data, user_id) {
  const {
    student_id,
    class_id,
    section_id,
    attendance_date,
    status,
    remarks
  } = data;

  if (!student_id || !class_id || !section_id || !attendance_date || !status) {
    throw new Error("All required fields must be provided");
  }

  if (!VALID_STATUS.includes(status)) {
    throw new Error("Invalid attendance status");
  }

  const existing = await schoolAdminModel.checkAttendanceExists(
    student_id,
    attendance_date
  );

  if (existing) {
    throw new Error("Attendance already marked for this date");
  }

  return await schoolAdminModel.createAttendance({
    school_id,
    student_id,
    class_id,
    section_id,
    attendance_date,
    status,
    remarks,
    marked_by: user_id
  });
}

export async function getAttendanceService(school_id, filters) {
  return await schoolAdminModel.getAttendance(school_id, filters);
}

export async function updateAttendanceService(attendance_id, school_id, data) {
  if (data.status && !VALID_STATUS.includes(data.status)) {
    throw new Error("Invalid attendance status");
  }

  const updated = await schoolAdminModel.updateAttendance(
    attendance_id,
    school_id,
    data
  );

  if (!updated) {
    throw new Error("Attendance not found");
  }

  return updated;
}

export async function deleteAttendanceService(attendance_id, school_id) {
  const deleted = await schoolAdminModel.deleteAttendance(
    attendance_id,
    school_id
  );

  if (!deleted) {
    throw new Error("Attendance not found");
  }
}

const VALID_STATUS = ["P", "A", "L", "H", "OL"];

export async function createTeacherAttendanceService(
  school_id,
  data,
  marked_by
) {
  const { teacher_id, attendance_date, status, remarks } = data;

  if (!teacher_id || !attendance_date || !status) {
    throw new Error("Required fields missing");
  }

  if (!VALID_STATUS.includes(status)) {
    throw new Error("Invalid attendance status");
  }

  const exists =
    await schoolAdminModel.checkTeacherAttendanceExists(
      teacher_id,
      attendance_date
    );

  if (exists) {
    throw new Error("Attendance already marked for this date");
  }

  return await schoolAdminModel.createTeacherAttendance({
    school_id,
    teacher_id,
    attendance_date,
    status,
    remarks,
    marked_by
  });
}

export async function getTeacherAttendanceService(school_id, filters) {
  return await schoolAdminModel.getTeacherAttendance(
    school_id,
    filters
  );
}

export async function updateTeacherAttendanceService(
  attendance_id,
  school_id,
  data
) {
  if (data.status && !VALID_STATUS.includes(data.status)) {
    throw new Error("Invalid attendance status");
  }

  const updated =
    await schoolAdminModel.updateTeacherAttendance(
      attendance_id,
      school_id,
      data
    );

  if (!updated) {
    throw new Error("Attendance record not found");
  }
}

export async function deleteTeacherAttendanceService(
  attendance_id,
  school_id
) {
  const deleted =
    await schoolAdminModel.deleteTeacherAttendance(
      attendance_id,
      school_id
    );

  if (!deleted) {
    throw new Error("Attendance record not found");
  }
}


