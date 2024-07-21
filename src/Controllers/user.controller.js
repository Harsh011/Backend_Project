import { User } from "../Models/users.models.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadCloudnairy } from "../utils/cloundnairy.js";
import jwt from "jsonwebtoken";

const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and acceess token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
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
  //   const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

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

  console.log(createdUser);
  //check for user creation
  if (!createdUser) {
    throw new ApiError(500, "something went wron registering the user");
  }

  //return res
  res
    .status(200)
    .json(new ApiResponse(201, createdUser, "Register user succesfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  //req body
  // username and email
  //find user
  //password check
  //access and refresh token
  //send cookie

  //req body
  const { username, email, password } = req.body;

  // username and email
  if (!username && !email) {
    throw new ApiError(400, "username and email is required");
  }

  // Here is an alternative of above code based on logic discussed in video:
  // if (!(username || email)) {
  //     throw new ApiError(400, "username or email is required")

  // }

  //find user
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User is not exist");
  }

  //password check
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  //access and refresh token
  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  const loggedUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  //send cookie
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedUser,
          accessToken,
          refreshToken,
        },
        "User is successfully login"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User is logout"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expires or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessTokenAndRefreshToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refresh"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "invalid refresh token");
  }
});
export { registerUser, loginUser, logoutUser, refreshAccessToken };
