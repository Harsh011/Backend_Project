import dotenv from "dotenv";
import { ConnectDb } from "./db/index.js";
import app from "./app.js";

dotenv.config({
  path: "./env",
});

ConnectDb()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Sever is started at ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(`Server is failed to connect `, err);
  });
