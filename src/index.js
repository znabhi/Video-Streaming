// require("dotenv").config({ path: "./env" });
import connectionDB from "./db/index.js";
import dotenv from "dotenv";
connectionDB();

dotenv.config({
  path: "./env",
});

/*(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
  } catch (error) {
    console.log("error");
  }
})();*/
