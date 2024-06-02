import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema(
  {
    vidoe: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
    likedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    likeOnComment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
    likeOnTweet: {
      type: Schema.Types.ObjectId,
      ref: "Tweet",
    },
  },
  { timestamps: true }
);

export const Like = mongoose.model("Like", likeSchema);
