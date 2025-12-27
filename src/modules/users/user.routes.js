import express from "express";
import {
  registerUser,
  login,
  getSchoolDetailsById,
  getAllSchoolDetails,
  getAllStudentDetails,
  addStudent,
  deleteStudent,
  getStudentDetailsById
} from "./user.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/registerUser", registerUser);//adding school user here
router.post("/login", login);
// router.get("/getSchoolDetailsById/:id", verifyToken, getSchoolDetailsById);
router.get("/getSchoolDetailsById/:id",getSchoolDetailsById);
router.get("/getAllSchoolDetails",getAllSchoolDetails);
router.get("/getAllStudentDetails",getAllStudentDetails);
router.post("/addStudent",addStudent);
router.delete("/deleteStudent",deleteStudent);
router.get("/getStudentDetailsById/:student_id",getStudentDetailsById);


export default router
