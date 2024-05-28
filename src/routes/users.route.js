import { Router } from "express";
import {
  changeCurrentPassword,
  logOutUser,
  loggedInUser,
  refreshAccessToken,
  registerUser,
  getCurrentUser,
  updateUserDetails,
  updateUserAvatar,
  coverUserImage,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImg",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loggedInUser);

//secure Routes
router.route("/logout").post(verifyJWT, logOutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").post(verifyJWT, getCurrentUser);
router.route("/update-details").post(verifyJWT, updateUserDetails);
router
  .route("/update-avatar")
  .post(verifyJWT, upload.single("avatar"), updateUserAvatar);

router
  .route("/update-cover")
  .post(verifyJWT, upload.single("coverImg"), coverUserImage);

export default router;
