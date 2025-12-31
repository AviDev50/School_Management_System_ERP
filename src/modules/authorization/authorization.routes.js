import express from "express";
import { loginForAll } from "./authorization.controller.js";

const router = express.Router();

router.post("/loginForAll", loginForAll);

export default router;
