import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectionDB = async () => {
  // lkjdlks
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DB_NAME}`
    );
    console.log(
      `\n MongoDB connected !! DB Host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MongoDb connection Error", error);
  }
};

export default connectionDB;
