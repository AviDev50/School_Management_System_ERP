import db from "../../config/db.js";
import bcrypt from "bcrypt";
import * as schoolAdminModel from "./schoolAdmin.model.js";

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
     // gender,
      qualification,
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
       // gender,
        qualification,
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
      school_id,
      name,
      user_email,
      password,
      admission_no,
      gender,
      class_id,
      section_id,
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
        admission_no,
        gender,
        class_id,
        section_id,
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
      school_id,
      name,
      user_email,
      password,
      qualification,
      accountant_photo,
      aadhar_card
    } = data;

    const user_id = await registerUser(
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

export async function getTotalStudentsListService(data) {
  try {
    const { school_id, page = 1, limit = 10 } = data;

    if (!school_id) {
      return {
        success: false,
        message: "School ID is required",
      };
    }

    const offset = (page - 1) * limit;

    const result = await schoolAdminModel.getStudentsList({
      school_id,
      limit: Number(limit),
      offset,
    });

    const totalCount = await schoolAdminModel.getTotalStudentsCount(school_id);

    return {
      success: true,
      message: "Students list fetched successfully",
      data: result,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  } catch (error) {
    console.error("Service Error:", error);
    return {
      success: false,
      message: "Something went wrong while fetching students",
    };
  }
}

//added pagination here
export async function getTotalTeachersListService(data) {
  try{
  const {school_id,page = 1, limit = 10} = data

  const offset = (page-1) * limit

  const result = await schoolAdminModel.getTeachersList({
    school_id,
    limit:Number(limit),
    offset
  })

   const totalCount = await schoolAdminModel.getTotalTeachersCount(school_id);
 return {
      success: true,
      message: "Teachers list fetched successfully",
      data: result,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  } catch (error) {
    console.error("Service Error:", error);
    return {
      success: false,
      message: "Something went wrong while fetching students",
    };
  }
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


export async function createAttendanceService(data, school_id) {
  return schoolAdminModel.insertAttendance(data, school_id);
}

export async function updateAttendanceService(attendance_id, data, school_id) {
  return schoolAdminModel.updateAttendance(
    attendance_id,
    data,
    school_id
  );
}

export async function getAttendanceService(query, school_id) {
  return schoolAdminModel.getAttendance(query, school_id);
}

export async function deleteAttendanceService(attendance_id, school_id) {
  return schoolAdminModel.deleteAttendance(
    attendance_id,
    school_id
  );
}



