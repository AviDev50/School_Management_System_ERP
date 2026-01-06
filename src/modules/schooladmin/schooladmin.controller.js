import * as schoolAdminService from "./schooladmin.service.js";

export async function registerTeacher(req, res) {
  try {
    const result = await schoolAdminService.registerTeacherService(req.body);
    return res.status(201).json({ success: true, message: "Teacher registered successfully", data: result });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

export async function registerStudent(req, res) {
  try {
    const result = await schoolAdminService.registerStudentService(req.body);
    console.log(req.body)
    return res.status(201).json({ success: true, message: "Student registered successfully", data: result });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

export async function registerAccountant(req, res) {
  try {
    const result = await schoolAdminService.registerAccountantService(req.body);
    return res.status(201).json({ success: true, message: "Accountant registered successfully", data: result });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

export async function getTotalStudentsListBySchoolId(req,res) {
  try {
    const result = await schoolAdminService.getTotalStudentsListService(req.body);
    return res.status(201).json({success: true, message: "All Students list get successfully",data:[result]})
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

export async function getTotalTeachersListBySchoolId(req,res) {
  try{const result = await schoolAdminService.getTotalTeachersListService(req.body);
  return res.status(201).json({success:true,message:"All teachers details get successfully",data:[result]})
} catch(error){
  return res.status(400).json({success: false, message: error.message});
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

    await deleteSectionService(section_id, school_id);

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


