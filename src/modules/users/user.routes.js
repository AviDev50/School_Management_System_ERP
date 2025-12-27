import express from "express";
import {
  registerUser,
  login,
  getSchoolDetailsById,
} from "./user.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/registerUser", registerUser);
router.post("/login", login);
// router.get("/getSchoolDetailsById/:id", verifyToken, getSchoolDetailsById);
router.get("/getSchoolDetailsById/:id",getSchoolDetailsById);

export default router;
