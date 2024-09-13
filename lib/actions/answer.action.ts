"use server";

import Answer from "@/database/answer.model";
import { connectToDatabase } from "../connectToDb";
import {
  AnswerVoteParams,
  CreateAnswerParams,
  DeleteAnswerParams,
  GetAnswersParams,
  GetUserStatsParams,
} from "./shared.types";
import Question from "@/database/question.model";
import { revalidatePath } from "next/cache";
import User from "@/database/user.model";
import { PipelineStage } from "mongoose";

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
    const { questionId, filter } = params;

    const aggregatePipeline: PipelineStage[] = [
      { $match: { question: questionId } },
      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "author",
          as: "author",
        },
      },
      { $unwind: "$author" },
      {
        $project: {
          "author.username": 0,
          "author.email": 0,
          "author.saved": 0,
          "author.bio": 0,
          "author.location": 0,
          "author.portfolioWebsite": 0,
        },
      },
    ];

    switch (filter) {
      case "highestUpvotes":
        aggregatePipeline.push(
          { $addFields: { upvotescount: { $size: "$upvotes" } } },
          { $sort: { upvotescount: -1 } }
          // { $project: { upvotescount: 0 } }
        );
        break;

      case "lowestUpvotes":
        aggregatePipeline.push(
          { $addFields: { upvotescount: { $size: "$upvotes" } } },
          { $sort: { upvotescount: 1 } },
          { $project: { upvotescount: 0 } }
        );
        break;

      case "recent":
        aggregatePipeline.push({ $sort: { createdAt: -1 } });
        break;

      case "old":
        aggregatePipeline.push({ $sort: { createdAt: 1 } });
        break;

      default:
        break;
    }

    // const allAnswers = await Answer.find({ question: questionId })
    //   .populate({
    //     path: "author",
    //     model: "User",
    //     select: "_id clerkId name picture",
    //   })
    //   .sort({ createdAt: -1 });

    const allAnswers = await Answer.aggregate(aggregatePipeline).exec();

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

    console.log({ userId, answerId, hasDownVoted, hasUpVoted, path });
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

    console.log("ANswer", answer);

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

    const limit = pageSize || 10;
    const skip = (page - 1) * limit;
    const totalButtons = Math.ceil(totalAnswers / limit);

    const paginatedAnswers = answers.slice(skip, skip + limit);
    return { totalAnswers, answers: paginatedAnswers, totalButtons };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteAnswerById(params: DeleteAnswerParams) {
  try {
    const { answerId, path } = params;
    await connectToDatabase();
    await Answer.findOneAndDelete({ _id: answerId });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
