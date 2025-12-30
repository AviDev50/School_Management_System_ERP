import express from "express";
import {
  registerSchoolAdminWithSchool,
  login,
  getSchoolDetailsById,
  getAllSchoolDetails
} from "./schooladmin.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/registerSchoolAdminWithSchool",registerSchoolAdminWithSchool);//adding school user here
router.post("/login", login);
// router.get("/getSchoolDetailsById/:id", verifyToken,allowRoles, getSchoolDetailsById);
router.get("/getSchoolDetailsById/:school_id",getSchoolDetailsById);
router.get("/getAllSchoolDetails",getAllSchoolDetails);

export default router
