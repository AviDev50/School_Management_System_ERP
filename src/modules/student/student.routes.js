import express from "express";
import {
  getAllStudentDetails,
  addStudent,
  deleteStudent,
  getStudentDetailsById,
  login
} from "./student.controller.js";
import { verifyToken } from "../authorization/authorization.controller.js";

const router = express.Router();

router.get("/getAllStudentDetails",getAllStudentDetails);
router.post("/addStudent",verifyToken,addStudent);
router.post("/login",login);
router.delete("/deleteStudent",deleteStudent);
router.get("/getStudentDetailsById/:student_id",getStudentDetailsById)

export default router;