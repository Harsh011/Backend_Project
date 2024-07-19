import mongoose from "mongoose";

import { DB_Name } from "../constant.js";

export const ConnectDb = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DB_Name}`
    );
    console.log(
      `MongoDb is connect to successfully at at port ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MongoDb is faliled to connect", error);
    process.exit(1);
  }
};
