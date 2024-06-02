import mongoose, { mongo } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/vidoe.model.js";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const getVideoComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId) {
    throw new ApiError(400, "Not Get video id");
  }
  const allComment = await Comment.aggregate([
    {
      $match: {
        video: new mongoose.Types.ObjectId(videoId),
      },
    },
  ]);
  return res
    .status(200)
    .json(new ApiResponse(200, allComment, "Successfully Get All Comments"));
});

const addComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user?._id;
  const { content } = req.body;

  //   console.log(content);

  if (!videoId) {
    throw new ApiError(400, "Video not Found");
  }
  if (!userId) {
    throw new ApiError(400, "Authentication is Required");
  }
  if (!content) {
    throw new ApiError(400, "Please Enter Some Content");
  }

  const comment = await Comment.create({
    content,
    video: new mongoose.Types.ObjectId(videoId),
    owner: new mongoose.Types.ObjectId(userId),
  });

  if (!comment) {
    throw new ApiError(400, "Comment Not Save");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Successfully Commited!"));
});

const editComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user?._id;
  const { content } = req.body;

  if (!commentId || !userId) {
    throw new ApiError(400, "Comment ID or user ID not provided");
  }

  if (!content) {
    throw new ApiError(400, "Please provide comment content");
  }

  const updatedComment = await Comment.findOneAndUpdate(
    {
      _id: commentId,
      owner: userId, // Simplify by using userId directly
    },
    {
      content: content,
    }
  );

  if (!updatedComment) {
    throw new ApiError(404, "Comment not found");
  }

  // Respond with success
  res.status(200).json({
    status: 200,
    data: updatedComment,
    message: "Comment updated successfully",
  });
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user?._id;
  if (!commentId || !userId) {
    throw new ApiError(
      400,
      !commentId ? "Comment ID is required" : "User ID not found"
    );
  }

  const comment = await Comment.findOneAndDelete({
    _id: commentId,
    owner: new mongoose.Types.ObjectId(req.user._id),
  });
  if (!comment) {
    throw new ApiError(
      404,
      "Comment not found or you don't have permission to delete it"
    );
  }
  res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment deleted successfully"));
});

export { getVideoComment, addComment, deleteComment, editComment };
