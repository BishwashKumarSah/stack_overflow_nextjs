"use server";

import User, { IUser } from "@/database/user.model";
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

import { FilterQuery, PipelineStage } from "mongoose";
import Question, { IQuestion } from "@/database/question.model";

import Tag from "@/database/tag.model";
import Answer from "@/database/answer.model";
import { redirect } from "next/navigation";

export const getAllUsers = async (params: GetAllUsersParams) => {
  try {
    connectToDatabase();
    const { page, pageSize, filter, searchQuery } = params;
    const query: FilterQuery<IUser> = {};

    if (searchQuery) {
      query.$or = [
        { name: { $regex: new RegExp(searchQuery, "i") } },
        { username: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }
    let sortOptions = {};
    switch (filter) {
      case "new_users":
        sortOptions = { joinedAt: -1 };
        break;
      case "old_users":
        sortOptions = { joinedAt: 1 };
        break;
      case "top_contributors":
        sortOptions = { reputation: 1 };
        break;

      default:
        break;
    }

    const allUsers = await User.find(query).sort(sortOptions);
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

    // ? I have also changed the query since the title and description are in saved
    // ? because we are searching based on userId and after we got that user we have saved field
    // ? which contains the questionId and after doning lookup i will get title and description so i u
    // ? sed saved.title and saved.description

    const query: FilterQuery<IQuestion> = {};
    if (searchQuery) {
      query.$or = [
        { "saved.title": { $regex: new RegExp(searchQuery, "i") } },
        { "saved.description": { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    const aggregatePipeline: PipelineStage[] = [
      {
        $match: { clerkId },
      },
      {
        $lookup: {
          from: "questions",
          foreignField: "_id",
          localField: "saved",
          as: "saved",
        },
      },
      { $unwind: { path: "$saved" } },
      {
        $match: query, // Apply the query for filtering by title or description
      },
      {
        $lookup: {
          from: "tags",
          foreignField: "_id",
          localField: "saved.tags",
          as: "saved.tags",
        },
      },
      { $unwind: { path: "$saved.tags", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "saved.author",
          as: "saved.author",
        },
      },
      { $unwind: { path: "$saved.author", preserveNullAndEmptyArrays: true } },

      // Add this $group stage to remove duplicates based on user._id and saved._id
      {
        $group: {
          _id: {
            // userId and savedQuestionId are custom names (aliases) for the respective fields.
            userId: "$_id",          // Group by the user's _id
            savedQuestionId: "$saved._id"  // Group by the saved question's _id
          },
          saved: { $first: "$saved" }, // Keep only one instance of saved question
          clerkId: { $first: "$clerkId" },
          name: { $first: "$name" },
          username: { $first: "$username" },
          email: { $first: "$email" },
          picture: { $first: "$picture" },
          bio: { $first: "$bio" },
          location: { $first: "$location" },
          portfolioWebsite: { $first: "$portfolioWebsite" },
          joinedAt: { $first: "$joinedAt" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
        },
      },
    ];

    switch (filter) {
      case "most_recent":
        aggregatePipeline.push({ $sort: { "saved.createdAt": -1 } });
        break;

      case "oldest":
        aggregatePipeline.push({ $sort: { "saved.createdAt": 1 } });
        break;

      case "most_voted":
        aggregatePipeline.push(
          {
            $addFields: {
              upvotecount: { $size: { $ifNull: ["$saved.upvotes", []] } },
            }, // Handle null or undefined upvotes
          },
          { $sort: { upvotecount: -1 } } // Sort by upvotecount in descending order
        );
        break;

      case "most_viewed":
        aggregatePipeline.push({ $sort: { "saved.views": -1 } });
        break;

      case "most_answered":
        aggregatePipeline.push(
          {
            $addFields: {
              answercount: { $size: { $ifNull: ["$saved.answers", []] } },
            },
          },
          { $sort: { answercount: -1 } }
        );
        break;

      default:
        break;
    }

    const userResults = await User.aggregate(aggregatePipeline).exec();

    // const user = await User.findOne({ clerkId }).populate({
    //   path: "saved",
    //   model: "Question",
    //   match: query,
    //   options: {
    //     sort: { createdAt: -1 },
    //   },
    //   populate: [
    //     { path: "author", model: User, select: "_id clerkId name picture" },
    //     { path: "tags", model: Tag, select: "_id name" },
    //   ],
    // });

    if (!userResults || userResults.length === 0) {
      throw new Error("No User Found!");
    }

    console.log("USSSSSER", userResults);

    const savedQuestions = userResults.map((user) => user.saved);

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
