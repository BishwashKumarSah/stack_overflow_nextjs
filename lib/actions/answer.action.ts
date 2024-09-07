"use server";

import Answer from "@/database/answer.model";
import { connectToDatabase } from "../connectToDb";
import {
  AnswerVoteParams,
  CreateAnswerParams,
  GetAnswersParams,
  GetUserStatsParams,
} from "./shared.types";
import Question from "@/database/question.model";
import { revalidatePath } from "next/cache";
import User from "@/database/user.model";

export const createAnswer = async (params: CreateAnswerParams) => {
  try {
    connectToDatabase();
    const { content, author, question, path } = params;
    const newAnswer = await Answer.create({ content, author, question });

    // Add the answer to the question's answers array.
    await Question.findByIdAndUpdate(question, {
      $push: { answers: newAnswer._id },
    });
    // TODO: Increase the reputations
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAllAnswer = async (params: GetAnswersParams) => {
  try {
    connectToDatabase();
    const { questionId } = params;
    const allAnswers = await Answer.find({ question: questionId })
      .populate({
        path: "author",
        model: "User",
        select: "_id clerkId name picture",
      })
      .sort({ createdAt: -1 });
    return { allAnswers };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export async function upVoteAnswer(params: AnswerVoteParams) {
  try {
    connectToDatabase();
    const { userId, answerId, hasDownVoted, hasUpVoted, path } = params;
    let QueryObj = {};

    if (hasUpVoted) {
      QueryObj = { $pull: { upvotes: userId } };
    } else if (hasDownVoted) {
      QueryObj = { $pull: { downvotes: userId }, $push: { upvotes: userId } };
    } else {
      QueryObj = { $addToSet: { upvotes: userId } };
    }

    const answer = await Answer.findByIdAndUpdate(answerId, QueryObj, {
      new: true,
    });

    if (!answer) {
      throw new Error("Answer Not Found!");
    }

    // TODO: Increase the reputation

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function downVoteAnswer(params: AnswerVoteParams) {
  try {
    connectToDatabase();
    const { userId, answerId, hasDownVoted, hasUpVoted, path } = params;
    let QueryObj = {};

    if (hasDownVoted) {
      QueryObj = { $pull: { downvotes: userId } };
    } else if (hasUpVoted) {
      QueryObj = { $pull: { upvotes: userId }, $push: { downvotes: userId } };
    } else {
      QueryObj = { $addToSet: { downvotes: userId } };
    }

    const answer = await Answer.findByIdAndUpdate(answerId, QueryObj, {
      new: true,
    });

    if (!answer) {
      throw new Error("Answer Not Found!");
    }

    // TODO: Increase the reputation

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserAnswers(params: GetUserStatsParams) {
  try {
    connectToDatabase();
    const { userId, page = 1, pageSize = 10 } = params;
    const totalAnswers = await Answer.countDocuments({ author: userId });
    const answers = await Answer.find({ author: userId })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name username picture",
      })
      .populate({ path: "question", model: Question, select: "_id title" });
    answers.sort((a, b) => b.upvotes.length - a.upvotes.length);
    return { totalAnswers, answers };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
