"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../connectToDb";
import { GetAllTagsParams, GetTopInteractedTagsParams } from "./shared.types";
import Tag from "@/database/tag.model";

export const getTopInteractedTags = async (
  params: GetTopInteractedTagsParams
) => {
  connectToDatabase();
  try {
    // const { userId, limit = 3 } = params;
    const { userId } = params;

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User Not Found!");
    }
    return [
      { _id: "1", name: "react" },
      { _id: "2", name: "angular" },
      { _id: "3", name: "vue" },
    ];
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAllTags = async (params: GetAllTagsParams) => {
  connectToDatabase();
  try {
    // const { userId, limit = 3 } = params;
    const { page, pageSize, filter, searchQuery } = params;

    const allTags = await Tag.find({});
    return { allTags };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
