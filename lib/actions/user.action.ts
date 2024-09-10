"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../connectToDb";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  GetUserByIdParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";

import { FilterQuery } from "mongoose";
import Question, { IQuestion } from "@/database/question.model";

import Tag from "@/database/tag.model";
import Answer from "@/database/answer.model";
import { redirect } from "next/navigation";

export const getAllUsers = async (params: GetAllUsersParams) => {
  try {
    connectToDatabase();
    // const { page, pageSize, filter, searchQuery } = params;
    const allUsers = await User.find({}).sort({ createdAt: -1 });
    return { allUsers };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getUserById = async (params: GetUserByIdParams) => {
  try {
    connectToDatabase();
    const { userId } = params;
    const user = await User.findOne({ clerkId: userId });
    // console.log("user", user);
    return { user };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Action Trigger
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

// Update User
export const updateUser = async (params: UpdateUserParams) => {
  try {
    connectToDatabase();

    const { clerkId, updateData, path } = params;

    const updatedUser = await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true,
    });

    revalidatePath(path);
    return { updatedUser };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Delete User
export const deleteUser = async (params: DeleteUserParams) => {
  try {
    connectToDatabase();

    const { clerkId } = params;

    const user = await User.findOne({ clerkId });

    if (!user) {
      throw new Error("User Not Found!");
    }

    // We need to delete everything related to that user like questions,comments,answers,etc.

    // const questionsId = await Question.find({ author: user._id }).distinct(
    //   "_id"
    // );

    // !Delete User Questions
    await Question.deleteMany({ author: user._id });

    const deletedUser = await User.findOneAndDelete({ clerkId });

    return deletedUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Save Question
export const saveQuestion = async (params: ToggleSaveQuestionParams) => {
  try {
    connectToDatabase();

    const { userId, questionId, path } = params;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("No User Found!");
    }

    const hasSaved = user.saved.includes(questionId);

    if (hasSaved) {
      await User.findByIdAndUpdate(
        userId,
        { $pull: { saved: questionId } },
        { new: true }
      );
    } else {
      await User.findByIdAndUpdate(
        userId,
        { $addToSet: { saved: questionId } },
        { new: true }
      );
    }

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Get Saved Questions
export const getSavedQuestions = async (params: GetSavedQuestionsParams) => {
  try {
    connectToDatabase();

    const { clerkId, page = 1, pageSize = 10, filter, searchQuery } = params;

    const filterQuery: FilterQuery<IQuestion> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, "i") } }
      : {};

    const user = await User.findOne({ clerkId }).populate({
      path: "saved",
      model: "Question",
      match: filterQuery,
      options: {
        sort: { createdAt: -1 },
      },
      populate: [
        { path: "author", model: User, select: "_id clerkId name picture" },
        { path: "tags", model: Tag, select: "_id name" },
      ],
    });

    if (!user) {
      throw new Error("No User Found!");
    }

    const savedQuestions = user.saved;

    return { questions: savedQuestions };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Get User Data
export const getUserDetailsById = async (params: GetUserByIdParams) => {
  try {
    connectToDatabase();
    const { userId } = params;
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return redirect("/");
    }

    const totalQuestionsCount = await Question.countDocuments({
      author: user._id,
    });

    const totalAnswersCount = await Answer.countDocuments({ author: user._id });

    return { user, totalAnswersCount, totalQuestionsCount };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
