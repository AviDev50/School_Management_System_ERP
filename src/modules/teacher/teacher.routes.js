import express from "express";
import {
  // login,
 // addTeacher 
 updateTeacher
} from "./teacher.controller.js";
import {authMiddleware,checkRole} from "../../middlewares/auth.middleware.js";

const router = express.Router();
router.put(
  '/updateTeacher',
  authMiddleware,
  checkRole(['school_admin']),
  updateTeacher
);

//router.post("/login", login);
// router.get("/getSchoolDetailsById/:id", verifyToken, getSchoolDetailsById);
//router.post("/addTeacher",addTeacher);

export default router
