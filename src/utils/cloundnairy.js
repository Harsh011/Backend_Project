import { v2 as cloudinary } from "cloudinary";
import { response } from "express";
import fs from "fs";

cloudinary.config({
  cloud_name: process.envCLOUNDNAIRY_CLOUD_NAME,
  api_key: process.envCLOUNDNAIRY_API_KEY,
  api_secret: process.envCLOUNDNAIRY_API_SECRET,
});

const uploadCloudnairy = async (locaFilePath) => {
  try {
    if (!locaFilePath) return null;
    //upload the file on cloudnairy
    const response = await cloudinary.uploader.upload(locaFilePath, {
      resource_type: "auto",
    });
    //file has been upload successfully
    console.log("file has upload on cloudnairy", response.url);
    return response;
  } catch (error) {
    fs.unlinkSync(locaFilePath); //removwe the locally save temporary file as the upload operation got failed
  }
};

export { uploadCloudnairy };
