import express from "express";
import {
  registerSchoolAdminWithSchool,
  login,
  getSchoolDetailsById,
  getAllSchoolDetails,
  getAllStudentDetails,
  addStudent,
  deleteStudent,
  getStudentDetailsById,
  
} from "./user.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/registerSchoolAdminWithSchool",registerSchoolAdminWithSchool);//adding school user here
router.post("/login", login);
// router.get("/getSchoolDetailsById/:id", verifyToken, getSchoolDetailsById);
router.get("/getSchoolDetailsById/:school_id",getSchoolDetailsById);
router.get("/getAllSchoolDetails",getAllSchoolDetails);
router.get("/getAllStudentDetails",getAllStudentDetails);
router.post(
  "/addStudent",
  verifyToken,
  addStudent
);
router.delete("/deleteStudent",deleteStudent);
router.get("/getStudentDetailsById/:student_id",getStudentDetailsById)


export default router
