"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../connectToDb";

export const getUserById = async (params: any) => {
  try {
    connectToDatabase();
    const { userId } = params;
    const user = await User.findOne({ clerkId: userId });
    console.log("user", user);
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
