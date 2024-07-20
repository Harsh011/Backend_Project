import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUNDNAIRY_CLOUD_NAME,
  api_key: process.env.CLOUNDNAIRY_API_KEY,
  api_secret: process.env.CLOUNDNAIRY_API_SECRET,
});

const uploadCloudnairy = async (locaFilePath) => {
  try {
    if (!locaFilePath) return null;
    //upload the file on cloudnairy
    const response = await cloudinary.uploader.upload(locaFilePath, {
      resource_type: "auto",
    });
    //file has been upload successfully
    // console.log("file has upload on cloudnairy", response.url);
    fs.unlinkSync(locaFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(locaFilePath); //removwe the locally save temporary file as the upload operation got failed
    return null;
  }
};

export { uploadCloudnairy };
