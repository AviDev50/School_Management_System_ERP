import { Router } from "express";
import schooladmin from "../modules/schooladmin/schooladmin.routes.js";
import superAdmin from "../modules/superadmin/superadmin.routes.js"
import student from "../modules/student/student.routes.js"
import teacher from "../modules/teacher/teacher.routes.js"
import accountant from "../modules/accountant/accountant.routes.js"
import { authMiddleware,checkRole } from "../middlewares/auth.middleware.js";
const router = Router();

// router.use("/schooladmin", schooladmin);
// router.use("/superAdmin", superAdmin);
// router.use("/student", student);
// router.use("/teacher", teacher);
// router.use("/accountant", accountant);
//router.use("/authorization", authRoutes);

//Direct module routes
 router.use("/schooladmin", authMiddleware, checkRole(["school_admin"]), schooladmin);
 router.use("/superAdmin", authMiddleware, checkRole(["super_admin"]), superAdmin);
 router.use("/student", authMiddleware, checkRole(["student"]), student);
 router.use("/teacher", authMiddleware, checkRole(["teacher"]), teacher);
 router.use("/accountant", authMiddleware, checkRole(["accountant"]), accountant);
 
 
 

export default router;
