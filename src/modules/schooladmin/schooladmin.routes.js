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
  deleteTimetable
} from "./schooladmin.controller.js";
import {
  authMiddleware,
  checkRole,
} from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/registerTeacher", registerTeacher);
router.post("/registerStudent", registerStudent);
router.post("/registerAccountant", registerAccountant);
router.post("/getTotalStudentsListBySchoolId", getTotalStudentsListBySchoolId);
router.post("/getTotalTeachersListBySchoolId", getTotalTeachersListBySchoolId);
router.post("/getTotalTeachersListBySchoolId", getTotalTeachersListBySchoolId);
router.post(
  "/createClass",
  authMiddleware,
  checkRole(["school_admin"]),
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
  "/getTimetable",
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

export default router;
