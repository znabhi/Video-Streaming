import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
  {
    videoFile: {
      type: String, // cloudnary
      required: true,
    },
    videoOwner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: string,
      required: true,
    },
    description: {
      type: string,
      // required: true,
    },
    keyWords: {
      type: string,
      // required: true,
    },
    duration: {
      type: Number, // cloudnary
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    vidoeThumnail: {
      type: String,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.models("Video", videoSchema);
