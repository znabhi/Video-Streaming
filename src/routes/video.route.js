import { Router } from "express";
import {
  getAllVideos,
  updateVideoDetails,
  getVideoById,
  deleteVideo,
  togglePublishStatus,
} from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/video-file").get(upload.single("videoFile"), getAllVideos);

router
  .route("/:videoId")
  .get(getVideoById)
  .patch(upload.single("vidoeThumnail"), updateVideoDetails)
  .post(deleteVideo);

router.route("/toggle/publish/:videoId").patch(togglePublishStatus);
export default router;
