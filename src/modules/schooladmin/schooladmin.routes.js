import express from "express";
import {
  registerTeacher,
  registerStudent,
  registerAccountant,
  getTotalStudentsListBySchoolId,
  getTotalTeachersListBySchoolId,
  getTotalAccountantsListBySchoolId,
  createClass,
  updateClass,
  getAllClasses,
  deleteClass,
  createSection,
  updateSection,
  getAllSections,
  deleteSection,
  createSubject,
  updateSubject,
  getAllSubjects,
  deleteSubject,
  createTimetable,
  getTimetable,
  updateTimetable,
  deleteTimetable,
  createStudentAttendance,
  updateStudentAttendance,
  getStudentAttendance,
  deleteStudentAttendance,
  getStudentById,
  getTeacherById,
  getAccountantById,
  createFee,
  getFees,
  updateFeeById,
  deleteFeeById,
  updateStudent,
  updateTeacher,
  updateAccountant,
  deleteStudentById,
  deleteTeacherById,
  deleteAccountantById
} from "./schooladmin.controller.js";
import {
  authMiddleware,
  checkRole,
} from "../../middlewares/auth.middleware.js";
import {studentUpload} from "../../middlewares/student.multer.js"
import { teacherUpload } from "../../middlewares/teacher.multer.js";
import { accountantUpload } from "../../middlewares/accountant.multer.js";
import { checkPermission } from "../../middlewares/permission.middleware.js";

const router = express.Router();
// here we add Student with images
// router.post(
//   "/registerStudent",
//   authMiddleware,
//   checkRole(["school_admin"]),
//   studentUpload,
//   registerStudent
// );
router.post('/registerStudent', 
  authMiddleware, 
  checkPermission('add_student'),  //added Permission check here
  studentUpload, 
  registerStudent
);

// here we add Teacher with images
router.post(
  "/registerTeacher",
  authMiddleware,
 checkPermission('add_teacher'),
  teacherUpload,
  registerTeacher
);

// here we add Accountant with images
router.post(
  "/registerAccountant",
  authMiddleware,
  checkPermission('add_accountant'),
  accountantUpload,
  registerAccountant
);

router.get("/getTotalStudentsListBySchoolId",authMiddleware,
 checkPermission('view_students'),getTotalStudentsListBySchoolId);

router.get("/getTotalTeachersListBySchoolId",authMiddleware,
 checkPermission('view_teachers'),getTotalTeachersListBySchoolId);

 router.get("/getTotalAccountantsListBySchoolId",authMiddleware,
 checkPermission('view_accountants'),getTotalAccountantsListBySchoolId);

 router.get("/getStudentById/:student_id",authMiddleware,
 checkPermission('view_students'),getStudentById);

 router.get("/getTeacherById/:teacher_id",authMiddleware,
 checkPermission('view_students'),getTeacherById);

 router.get("/getAccountantById/:accountant_id",authMiddleware,
 checkPermission('view_students'),getAccountantById);

router.post(
  "/createClass",
 authMiddleware,
 checkPermission('manage_classes'),
  createClass
);

router.put(
  "/updateClass",
  authMiddleware,
  checkRole(["school_admin"]),
  updateClass
);

router.get(
  "/getAllClasses",
  authMiddleware,
  checkPermission('manage_classes'),
  getAllClasses
);
router.delete(
  "/deleteClass",
  authMiddleware,
  checkPermission('manage_classes'),
  deleteClass
);

router.post(
  "/createSection",
  authMiddleware,
  checkPermission('manage_classes'),
  createSection
);

router.put(
  "/updateSection",
  authMiddleware,
 checkPermission('manage_classes'),
  updateSection
);

router.get(
  "/getAllSections",
  authMiddleware,
  checkPermission('manage_classes'),
  getAllSections
);

router.delete(
  "/deleteSection",
  authMiddleware,
  checkPermission('manage_classes'),
  deleteSection
);

router.post(
  "/createSubject",
  authMiddleware,
  checkPermission('manage_classes'),
  createSubject
);

router.put(
  "/updateSubject",
  authMiddleware,
 checkPermission('manage_classes'),
  updateSubject
);

router.get(
  "/getAllSubjects",
  authMiddleware,
  checkPermission('manage_classes'),
  getAllSubjects
);

router.delete(
  "/deleteSubject",
  authMiddleware,
  checkPermission('manage_classes'),
  deleteSubject
);

router.post(
  "/createTimetable",
  authMiddleware,
  checkPermission('manage_classes'),
  createTimetable
);

router.put(
  "/updateTimetable",
  authMiddleware,
  checkPermission('manage_classes'),
  updateTimetable
);

router.get(
  "/getTimetable/:class_id/:section_id",
  authMiddleware,
  checkPermission('manage_classes'),
  getTimetable
);

router.delete(
  "/deleteTimetable",
  authMiddleware,
  checkPermission('manage_classes'),
  deleteTimetable
);

router.post(
  "/createStudentAttendance",
  authMiddleware,
  checkPermission('manage_classes'),
  createStudentAttendance
);

router.put(
  "/updateStudentAttendance",
  authMiddleware,
  checkPermission('manage_classes'),
  updateStudentAttendance
);

router.get(
  "/getStudentAttendance/:class_id/:section_id",
  authMiddleware,
  checkPermission('manage_classes'),
  getStudentAttendance
);

router.post(
  "/createFee",
  authMiddleware,
  checkPermission('manage_fees'),
  createFee
);

//getting all fee here
router.get(
  "/getFees",
  authMiddleware,
  checkPermission('manage_fees'),
  getFees
);

router.put(
  "/updateFeeById",
  authMiddleware,
  checkPermission('manage_fees'),
  updateFeeById
);

router.delete(
  "/deleteFeeById",
  authMiddleware,
  checkPermission('manage_fees'),
  deleteFeeById
);

router.put(
  "/updateStudent",
  authMiddleware,
  checkPermission("edit_student"),
  studentUpload,
  updateStudent
);

router.put(
  "/updateTeacher",
  authMiddleware,
  checkPermission("edit_teacher"),
  teacherUpload,
  updateTeacher
);

router.put(
  "/updateAccountant",
  authMiddleware,
  checkPermission("edit_accountants"),
  accountantUpload,
  updateAccountant
);

router.delete(
  "/deleteStudentById",
  authMiddleware,
  checkPermission("edit_student"),
  accountantUpload,
  deleteStudentById
);

router.delete(
  "/deleteTeacherById",
  authMiddleware,
  checkPermission("edit_teacher"),
  accountantUpload,
  deleteTeacherById
);

router.delete(
  "/deleteAccountantById",
  authMiddleware,
  checkPermission("edit_accountants"),
  accountantUpload,
  deleteAccountantById
);



export default router;
