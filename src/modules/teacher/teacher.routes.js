import express from "express";
import {
  login,
  addTeacher 
} from "./teacher.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/login", login);
// router.get("/getSchoolDetailsById/:id", verifyToken, getSchoolDetailsById);
router.post("/addTeacher",addTeacher);

export default router
