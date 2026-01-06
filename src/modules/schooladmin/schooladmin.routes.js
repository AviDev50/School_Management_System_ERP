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
  deleteSection
} from "./schooladmin.controller.js";
import { authMiddleware, checkRole } from '../../middlewares/auth.middleware.js';




const router = express.Router();

// // Only SCHOOL_ADMIN can create these users 
// router.post("/registerTeacher-",allowRoles("SCHOOL_ADMIN"), registerTeacher);
// router.post("/registerTeacher", allowRoles("SCHOOL_ADMIN"), registerStudent);
// router.post("/registerTeacher", allowRoles("SCHOOL_ADMIN"), registerAccountant);
router.post("/registerTeacher",registerTeacher);
router.post("/registerStudent",registerStudent);
router.post("/registerAccountant",registerAccountant);
router.post("/getTotalStudentsListBySchoolId",getTotalStudentsListBySchoolId);
router.post("/getTotalTeachersListBySchoolId",getTotalTeachersListBySchoolId);
router.post("/getTotalTeachersListBySchoolId",getTotalTeachersListBySchoolId);
router.post("/createClass",authMiddleware,checkRole(['school_admin']),createClass);
router.put("/updateClass",authMiddleware,checkRole(['school_admin']),updateClass);
router.get("/getAllClasses",authMiddleware,checkRole(['school_admin']),getAllClasses);
router.delete("/deleteClass",authMiddleware,checkRole(['school_admin']),deleteClass);
router.post("/createSection",authMiddleware,checkRole(['school_admin']),createSection);
router.put("/updateSection",authMiddleware,checkRole(['school_admin']),updateSection);
router.get("/getAllSections",authMiddleware,checkRole(['school_admin']),getAllSections);
router.delete("/deleteSection",authMiddleware,checkRole(['school_admin']),deleteSection);



export default router;
