import express from "express";
import {
  registerTeacher,
  registerStudent,
  registerAccountant,
  getTotalStudentsListBySchoolId,
  getTotalTeachersListBySchoolId,
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
  deleteStudentAttendance
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

router.post("/getTotalStudentsListBySchoolId", getTotalStudentsListBySchoolId);
router.post("/getTotalTeachersListBySchoolId", getTotalTeachersListBySchoolId);
router.post("/getTotalTeachersListBySchoolId", getTotalTeachersListBySchoolId);
router.post(
  "/createClass",
 authMiddleware,
 // checkRole(["school_admin"]),
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
  checkRole(["school_admin"]),
  getAllClasses
);
router.delete(
  "/deleteClass",
  authMiddleware,
  checkRole(["school_admin"]),
  deleteClass
);
router.post(
  "/createSection",
  authMiddleware,
  checkRole(["school_admin"]),
  createSection
);
router.put(
  "/updateSection",
  authMiddleware,
  checkRole(["school_admin"]),
  updateSection
);

router.get(
  "/getAllSections",
  authMiddleware,
  checkRole(["school_admin"]),
  getAllSections
);

router.delete(
  "/deleteSection",
  authMiddleware,
  checkRole(["school_admin"]),
  deleteSection
);

router.post(
  "/createSubject",
  authMiddleware,
  checkRole(["school_admin"]),
  createSubject
);

router.put(
  "/updateSubject",
  authMiddleware,
  checkRole(["school_admin"]),
  updateSubject
);

router.get(
  "/getAllSubjects",
  authMiddleware,
  checkRole(["school_admin"]),
  getAllSubjects
);

router.delete(
  "/deleteSubject",
  authMiddleware,
  checkRole(["school_admin"]),
  deleteSubject
);

router.post(
  "/createTimetable",
  authMiddleware,
  checkRole(["school_admin"]),
  createTimetable
);

router.put(
  "/updateTimetable",
  authMiddleware,
  checkRole(["school_admin"]),
  updateTimetable
);

router.get(
  "/getTimetable/:class_id/:section_id",
  authMiddleware,
  checkRole(["school_admin"]),
  getTimetable
);

router.delete(
  "/deleteTimetable",
  authMiddleware,
  checkRole(["school_admin"]),
  deleteTimetable
);

router.post(
  "/createStudentAttendance",
  authMiddleware,
  checkRole(["school_admin"]),
  createStudentAttendance
);

router.put(
  "/updateStudentAttendance",
  authMiddleware,
  checkRole(["school_admin"]),
  updateStudentAttendance
);

router.get(
  "/getStudentAttendance/:class_id/:section_id",
  authMiddleware,
  checkRole(["school_admin"]),
  getStudentAttendance
);


router.delete(
  "/deleteStudentAttendance",
  authMiddleware,
  checkRole(["school_admin"]),
  deleteStudentAttendance
);


export default router;
