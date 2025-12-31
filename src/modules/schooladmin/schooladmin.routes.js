import express from "express";
import {
  registerTeacher,
  registerStudent,
  registerAccountant,
} from "./schooladmin.controller.js";
import { verifyToken} from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/role.middleware.js";


const router = express.Router();

// // Only SCHOOL_ADMIN can create these users
// router.post("/registerTeacher-",allowRoles("SCHOOL_ADMIN"), registerTeacher);
// router.post("/registerTeacher", allowRoles("SCHOOL_ADMIN"), registerStudent);
// router.post("/registerTeacher", allowRoles("SCHOOL_ADMIN"), registerAccountant);
router.post("/registerTeacher",registerTeacher);
router.post("/registerStudent",registerStudent);
router.post("/registerAccountant",registerAccountant);

export default router;
