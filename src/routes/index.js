import { Router } from "express";
import schooladmin from "../modules/schooladmin/schooladmin.routes.js";
import superAdminRoutes from "../modules/superadmin/superadmin.routes.js"
import parent from "../modules/parent/parent.routes.js"
import student from "../modules/student/student.routes.js"
import teacher from "../modules/teacher/teacher.routes.js"
import accountant from "../modules/accountant/accountant.routes.js"

const router = Router();

router.use("/schooladmin", schooladmin);
router.use("/superAdminRoutes", superAdminRoutes);
router.use("/parent", parent);
router.use("/student", student);
router.use("/teacher", teacher);
router.use("/accountant", accountant);

export default router;
