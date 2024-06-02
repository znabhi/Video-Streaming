import { Video } from "../models/vidoe.model.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const videoFileLocalPath = req.file?.path;
  const { title, description, keyWords, views, vidoeThumnail } = req.body;

  // console.log(req.file);
  const fileExtenstion = videoFileLocalPath?.split(".").pop().toLowerCase();

  if (fileExtenstion !== "mp4") {
    throw new ApiError(400, "Please Select MP4 File");
  }

  if (!videoFileLocalPath) {
    throw new ApiError(400, "Not Get Video file");
  }

  const videoCloudinayPath = await uploadOnCloudinary(videoFileLocalPath);
  const cloudinaryVideoURL = await videoCloudinayPath?.url;
  const videoDuration = await videoCloudinayPath?.duration;

  if (!cloudinaryVideoURL && !videoDuration) {
    throw new ApiError(400, "Error while uploading");
  }

  const video = await Video.create({
    videoFile: cloudinaryVideoURL,
    duration: videoDuration,
    title,
    description,
    keyWords,
    views,
    vidoeThumnail,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Successfully Uploaded Video"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  // Check if videoId exists
  if (!videoId) {
    throw new ApiError(404, "Video ID is required");
  }

  // Find video details by ID
  const videoDetails = await Video.findById(videoId);

  // If video details not found, throw an error
  if (!videoDetails) {
    throw new ApiError(404, "Video not found");
  }

  // Send response with video details
  return res.status(200).json({
    status: "success",
    data: videoDetails,
    message: "Successfully retrieved video details",
  });
});

const updateVideoDetails = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description, keywords } = req.body;
  const thumnailLocalPath = req.file?.path;
  // Check if videoId exists
  if (!videoId) {
    throw new ApiError(400, "Video ID is required");
  }
  // Check if title and description are provided
  if (!title) {
    throw new ApiError(400, "Title is required");
  }
  if (!thumnailLocalPath) {
    throw new ApiError(400, "Sorry.. Image Not Found");
  }

  const uploadThumbnailCloudinary = await uploadOnCloudinary(thumnailLocalPath);

  if (!uploadThumbnailCloudinary?.url) {
    throw new ApiError(400, "Image Not Uploaded On cloudinary");
  }

  // Find the video by ID
  const video = await Video.findById(videoId);

  // Check if the video exists
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  // Check if the provided title is the same as the existing one
  if (title === video.title) {
    throw new ApiError(
      400,
      "New title must be different from the existing one"
    );
  }

  // Update video details
  video.title = title;
  video.description = description;
  video.keywords = keywords || [];
  video.vidoeThumnail = uploadThumbnailCloudinary.url;

  // Save the updated video
  await video.save();

  // Send success response
  return res.status(200).json({
    status: "success",
    message: "Successfully updated video details",
    data: video,
  });
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId) {
    throw new ApiError(400, "Video Details Not Fatched");
  }

  const videoCheck = await Video.findById(videoId);

  if (!videoCheck) {
    throw new ApiError(400, "Sorry... Not Found this video");
  }

  const video = await Video.findByIdAndDelete(videoId);
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Succefully Deleted Video"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId) {
    throw new ApiError(400, "Video Not Found");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(400, "Not Get video details");
  }

  if (video.isPublished === true) {
    video.isPublished = false;
  } else if (video.isPublished === false) {
    video.isPublished = true;
  }

  await video.save();

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Successfully Get details"));
});

export {
  getAllVideos,
  getVideoById,
  updateVideoDetails,
  deleteVideo,
  togglePublishStatus,
};
