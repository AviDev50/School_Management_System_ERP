import express from "express";
import {
  getStudentDetailsById,
  upsertStudentById
} from "./student.controller.js";

const router = express.Router();

router.get("/getStudentDetailsById/:student_id",getStudentDetailsById)
router.post("/upsertStudentById",upsertStudentById)

export default router;