import { Router } from "express";
import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "../Controllers/user.controller.js";
import { upload } from "../middlewears/multer.middlewear.js";
import { verifyJWT } from "../middlewears/auth.middlewear.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

//secure routes
router.route("/logout").post(verifyJWT, logoutUser);

router.route("/refreshToken").post(refreshAccessToken);
export default router;
