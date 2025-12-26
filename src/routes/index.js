import { Router } from "express";
import userRoutes from "../modules/users/user.routes.js";
import superAdminRoutes from "../modules/superadmin/superadmin.routes.js"

const router = Router();

router.use("/users", userRoutes);
router.use("/superAdmin", superAdminRoutes);


export default router;
