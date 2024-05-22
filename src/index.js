// require("dotenv").config({ path: "./env" });
import connectionDB from "./db/index.js";
import dotenv from "dotenv";
dotenv.config({
  path: "./env",
});

connectionDB()
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server is Running at Port: ${process.env.PORT}`);
    });
  })
  .catch(() => {
    console.log("MongoDB Connection Failed");
  });

/*(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
  } catch (error) {
    console.log("error");
  }
})();*/
