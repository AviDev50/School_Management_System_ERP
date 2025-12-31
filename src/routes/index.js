import { Router } from "express";
import schooladmin from "../modules/schooladmin/schooladmin.routes.js";
import superAdmin from "../modules/superadmin/superadmin.routes.js"
import student from "../modules/student/student.routes.js"
import teacher from "../modules/teacher/teacher.routes.js"
import accountant from "../modules/accountant/accountant.routes.js"
import authRoutes from "../modules/authorization/authorization.routes.js";
const router = Router();

router.use("/schooladmin", schooladmin);
router.use("/superAdmin", superAdmin);
router.use("/student", student);
router.use("/teacher", teacher);
router.use("/accountant", accountant);
router.use("/authorization", authRoutes);

export default router;
