"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../connectToDb";
import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from "./shared.types";
import Tag from "@/database/tag.model";
import Question from "@/database/question.model";

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

export const GetQuestionsByTagId = async (
  params: GetQuestionsByTagIdParams
) => {
  connectToDatabase();
  try {
    // const { userId, limit = 3 } = params;
    const { tagId, page = 1, pageSize = 10, searchQuery } = params;

    const tagQuestions = await Tag.findById(tagId).populate({
      path: "questions",
      model: Question,
      match: searchQuery
        ? { title: { $regex: searchQuery, $options: "i" } }
        : {},
      options: {
        sort: { createdAt: -1 },
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    });
    if (!tagQuestions) {
      throw new Error("Tags Not Found!");
    }
    return { tagTitle: tagQuestions.name, questions: tagQuestions.questions };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
