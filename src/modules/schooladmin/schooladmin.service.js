import bcrypt from "bcrypt";
import * as schoolAdminModel from "./schoolAdmin.model.js";
import db from "../../config/db.js";

// Common function for all 
async function registerUser(
  { name, user_email, password, role, school_id },
  connection
) {
  if (!school_id || !name || !user_email || !password) {
    throw new Error("Required fields missing");
  }

  const existing = await schoolAdminModel.getUserByEmail(
    user_email,
    connection
  );
  
  if (existing) throw new Error("Email already exists");

  const hashedPassword = await bcrypt.hash(password, 10);

  const userId = await schoolAdminModel.createUser(
    {
      name,
      user_email,
      password: hashedPassword,
      role,
      school_id
    },
    connection
  );

  return { user_id: userId, role };
}

// Exported functions for all 
export async function registerTeacherService(data){
  const connection = await db.getConnection()
    try {
      await connection.beginTransaction();

      const{school_id,name,user_email,password,qualification,experience_years,joining_date} = data

      const user = await registerUser({school_id,name,user_email,password,role:"Teacher"},connection)

      await schoolAdminModel.createTeacher({
      school_id,user_id: user.user_id,qualification,experience_years,joining_date
      },connection)

     await connection.commit()
     return user

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
      admission_no,
      gender,
      class_id,
      section_id
    } = data;

    // Creating user profile here in users table
    const user = await registerUser(
      {
        name,
        user_email,
        password,
        role: "STUDENT",
        school_id
      },
      connection
    );

    // Creating student profile here in student table
    await schoolAdminModel.createStudent(
      {
        school_id,
        user_id: user.user_id,
        admission_no,
        gender,
        class_id,
        section_id
      },
      connection
    );

    await connection.commit();
    return user;

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

    const{school_id,name,user_email,password,qualification} = data

    // Creating user profile here in users table
    const user = await registerUser(
      {
        name,
        user_email,
        password,
        role:"Accountant",
        school_id
      },
      connection
    );

    // Creating student profile here in student table
    await schoolAdminModel.createAccountant(
      {
        school_id,user_id:user.user_id,qualification
      },
      connection
    );

    await connection.commit();
    return user;

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


