import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const registerUser = asyncHandler(async (req, res) => {
  /* for test use only
  res.status(200).json({
    message: "hello where",
  });*/
  /*
    get user details from frantend
    validation (!empty)
    check if user aleady exists:email
    check for img and cover img
    upload them to cloudinary
    create user object - create entry in db
    remove password and refresh token field
    check for user creation
    return res 
  */
  const { email, name, password, username } = req.body;
  // console.log({ email, username });

  if ([email, name, password, username].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Field is required");
  }

  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  });
  // console.log(existedUser);
  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImgLocalPath = req.files?.coverImg[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImgLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar is required");
  }

  const user = await User.create({
    name,
    username,
    email,
    password,
    avatar: avatar.url,
    coverImg: coverImage?.url || "",
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(
      500,
      " Something went wrong while registering the user "
    );
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, " User Succesfully Registered!!!"));
});
export { registerUser };
