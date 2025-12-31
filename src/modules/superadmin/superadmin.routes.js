// import express from "express";
// import {
//  //registerSuperAdmin,
//  //loginSuperAdmin,
// } from "./superadmin.controller.js";

// import {
//   verifyToken,
//   //allowRoles
// } from "../../middlewares/auth.middleware.js";

// const router = express.Router();

// /* Public APIs */
//router.post("/registerSuperAdmin", registerSuperAdmin);
//router.post("/loginSuperAdmin",loginSuperAdmin);

/* Protected API */
// router.get(
//   "/profile",
//   verifyToken,
//   allowRoles("SUPER_ADMIN"),
//   (req, res) => {
//     res.json({
//       success: true,
//       message: "Super Admin profile access granted",
//       user: req.user,
//     });
//   }
// );

// export default router;
import express from "express";
import { createSchoolWithAdmin} from "./superadmin.controller.js";
import { verifyToken} from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/role.middleware.js";

const router = express.Router();

router.post(
  "/createSchoolWithAdmin",
  // verifyToken,
 // allowRoles("super_admin"),
  createSchoolWithAdmin
);


export default router;
