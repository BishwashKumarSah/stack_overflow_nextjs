"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../connectToDb";
import { CreateUserParams, GetUserByIdParams } from "./shared.types";

export const getUserById = async (params: GetUserByIdParams) => {
  try {
    connectToDatabase();
    const { userId } = params;
    const user = await User.findOne({ clerkId: userId });
    // console.log("user", user);
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Action Trigg

export const createUser = async (userData: CreateUserParams) => {
  try {
    connectToDatabase();

    const newUser = await User.create(userData);

    return newUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
