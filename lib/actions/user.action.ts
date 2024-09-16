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

import Answer from "@/database/answer.model";
import { redirect } from "next/navigation";
import { BadgeCriteriaType } from "@/types";
import { getBadgesNumber } from "../utils";

export const getAllUsers = async (params: GetAllUsersParams) => {
  try {
    connectToDatabase();
    const { page = 1, pageSize, filter, searchQuery } = params;
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

    const limit = pageSize || 10;
    const skip = (page - 1) * limit;

    const totalDocuments = await User.countDocuments(query);
    const totalButtons = Math.ceil(totalDocuments / limit);

    const allUsers = await User.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);
    return { allUsers, totalButtons };
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

    const { clerkId, page = 1, pageSize = 20, filter, searchQuery } = params;

    // ? I have also changed the query since the title and description are in saved
    // ? because we are searching based on userId and after we got that user we have saved field
    // ? which contains the questionId and after doning lookup i will get title and description so i
    // ? used saved.title and saved.description

    const query: FilterQuery<IQuestion> = {};
    if (searchQuery) {
      query.$or = [
        { "saved.title": { $regex: new RegExp(searchQuery, "i") } },
        { "saved.description": { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    const limit = pageSize || 20;
    const skip = (page - 1) * limit;

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
            userId: "$_id", // Group by the user's _id
            savedQuestionId: "$saved._id", // Group by the saved question's _id
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
      {
        $facet: {
          totalDocuments: [{ $count: "total" }], // Count total documents
          paginatedResults: [
            { $skip: skip }, // Apply skip
            { $limit: limit }, // Apply limit
          ],
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

    const savedQuestions = userResults[0].paginatedResults.map(
      (user: Partial<IUser>) => user.saved
    );
    const totalDocuments =
      userResults[0].totalDocuments.length > 0
        ? userResults[0].totalDocuments[0].total
        : 0;

    const totalButtons = Math.ceil(totalDocuments / limit);

    return {
      questions: savedQuestions,
      totalButtons,
    };
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

    const aggregatePipeline: PipelineStage[] = [
      { $match: { clerkId: userId } },
      {
        $lookup: {
          from: "questions",
          foreignField: "author",
          localField: "_id",
          as: "questionsTags",
        },
      },
      { $unwind: { path: "$questionsTags" } },
      {
        $lookup: {
          from: "tags",
          foreignField: "_id",
          localField: "questionsTags.tags",
          as: "userTags",
        },
      },
      { $unwind: { path: "$userTags" } },
      {
        $group: {
          _id: "$userTags._id",
          count: { $sum: 1 },
          name: { $first: "$userTags.name" },
          description: { $first: "$userTags.description" },
        },
      },
      { $project: { _id: 1, name: 1, count: 1 } },
      { $sort: { count: -1 } },
    ];
    const newUser = await User.aggregate(aggregatePipeline);

    if (!user) {
      return redirect("/");
    }

    const totalQuestionsCount = await Question.countDocuments({
      author: user._id,
    });

    const totalAnswersCount = await Answer.countDocuments({ author: user._id });

    // ? since questionUpvotes is any array cuz of aggregate so we can just use [x] to get the first index like destructuring
    const [questionUpvotes] = await Question.aggregate([
      { $match: { author: user._id } },
      { $project: { _id: 0, upvotes: { $size: "$upvotes" } } },
      {
        $group: {
          _id: null, // We're not grouping by any specific field, just aggregating all documents
          totalUpvotes: { $sum: "$upvotes" },
        },
      },
    ]);

    // Get the total AnswerUpvotes of a particular User by author id. cuz he is the one who created the answer/question
    const [answerUpvotes] = await Answer.aggregate([
      { $match: { author: user._id } },
      { $project: { _id: 0, upvotes: { $size: "$upvotes" } } },
      {
        $group: {
          _id: null, // We're not grouping by any specific field, just aggregating all documents
          totalUpvotes: { $sum: "$upvotes" },
        },
      },
    ]);

    const [questionViews] = await Question.aggregate([
      { $match: { author: user._id } },
      { $group: { _id: null, totalViews: { $sum: "$views" } } },
    ]);
    // console.log({ questionUpvotes });
    // console.log({ answerUpvotes });
    // console.log({ questionViews });

    const criteria = [
      {
        type: "QUESTION_COUNT" as BadgeCriteriaType,
        count: totalQuestionsCount,
      },
      {
        type: "ANSWER_COUNT" as BadgeCriteriaType,
        count: totalAnswersCount,
      },
      {
        type: "QUESTION_UPVOTES" as BadgeCriteriaType,
        count: questionUpvotes?.totalUpvotes || 0,
      },
      {
        type: "ANSWER_UPVOTES" as BadgeCriteriaType,
        count: answerUpvotes?.totalUpvotes || 0,
      },
      {
        type: "TOTAL_VIEWS" as BadgeCriteriaType,
        count: questionViews?.totalViews || 0,
      },
    ];

    const badgesObj = getBadgesNumber({ criteria });
    const reputation = user.reputation;
    return {
      user,
      totalAnswersCount,
      totalQuestionsCount,
      badgesObj,
      reputation,
      topTags: newUser,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
