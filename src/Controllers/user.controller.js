import { User } from "../Models/users.models.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadCloudnairy } from "../utils/cloundnairy.js";

//follow the steps to create a controllers

//get user details from frontend
//validation - not empty
//check if user already exists: username , email
//checks for images and check for avatar
//uopload them to cloudninary, avatar
// create user object -create entery in db
//remove password and refresh token field form response
//check for user creation
//return res

const registerUser = asyncHandler(async (req, res) => {
  //get user details from frontend
  const { username, password, email, fullName } = req.body;
  //   console.log('email', email)

  //validation - not empty
  if (
    [username, email, password, fullName].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are Required");
  }

  //check if user already exists: username , email
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with username and email already exist");
  }

  //checks for images and check for avatar
  const avatarLoacalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLoacalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  //uopload them to cloudninary, avatar
  const avatar = await uploadCloudnairy(avatarLoacalPath);
  const coverImage = await uploadCloudnairy(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar is required first to upload");
  }

  // create user object -create entery in db
  const user = await User.create({
    fullName,
    email,
    password,
    username: username.toLowerCase(),
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  //remove password and refresh token field form response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  //check for user creation
  if (!createdUser) {
    throw new ApiError(500, "something went wron registering the user");
  }

  //return res
  res
    .status(200)
    .json(new ApiResponse(201, createdUser, "Register user succesfully"));
});

export { registerUser };
