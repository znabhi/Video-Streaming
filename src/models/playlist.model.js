import mongoose, { Schema } from "mongoose";

const playlistSchema = new Schema(
  {
    playlistName: {
      type: String,
      required: true,
    },
    playlistDiscription: {
      type: String,
    },
    playlistCreatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    playlistVideos: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
  },
  { timestamps: true }
);

export const Playlist = mongoose.model("Playlist", playlistSchema);
