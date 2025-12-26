import express from "express";
import { registerUser,login,getSchoolDetailsById} from "../users/user.controller.js";

const router = express.Router();

router.post("/registerUser",registerUser);
router.post("/login",login);
router.get("/getSchoolDetailsById/:id",getSchoolDetailsById)

export default router;


