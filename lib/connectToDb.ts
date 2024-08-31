import mongoose from "mongoose";

let isConnected: boolean = false;

export const connectToDatabase = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URI) {
    return console.log("MONGODB_URI is missing");
  }

  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "stackoverflow",
    });
    isConnected = true;
    console.log("MongoDb is Connected");
  } catch (error) {
    console.log("MongoDb connection failed", error);
  }
};
