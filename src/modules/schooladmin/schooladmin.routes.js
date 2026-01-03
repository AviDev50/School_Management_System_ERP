import express from "express";
import {
  registerTeacher,
  registerStudent,
  registerAccountant,
  getTotalStudentsListBySchoolId,
  getTotalTeachersListBySchoolId
} from "./schooladmin.controller.js";



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




export default router;
