import express from "express";
import {
  registerSuperAdmin,
  loginSuperAdmin
} from "../superadmin/superadmin.controller.js";

const router = express.Router();

router.post("/registerSuperAdmin",registerSuperAdmin);
router.post("/loginSuperAdmin",loginSuperAdmin);

export default router;
