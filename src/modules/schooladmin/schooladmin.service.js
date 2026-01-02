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
