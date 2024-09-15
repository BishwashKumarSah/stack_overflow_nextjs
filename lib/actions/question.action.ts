"use server";

import { connectToDatabase } from "../connectToDb";
import Tag from "@/database/tag.model";
import {
  CreateQuestionParams,
  DeleteQuestionParams,
  EditQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
  GetUserStatsParams,
  QuestionVoteParams,
} from "./shared.types";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";
import { FilterQuery, PipelineStage } from "mongoose";
import Question, { IQuestion } from "@/database/question.model";
import Interaction from "@/database/interaction.model";

export async function getQuestions(params: GetQuestionsParams) {
  try {
    connectToDatabase();
    const { searchQuery, filter, page = 1, pageSize = 10 } = params;
    const query: FilterQuery<IQuestion> = {};

    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, "i") } },
        { description: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    // Main aggregation pipeline stages
    const mainPipeline: PipelineStage[] = [
      { $match: query },
      {
        $lookup: {
          from: "tags",
          localField: "tags",
          foreignField: "_id",
          as: "tags",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
    ];

    // Apply sorting based on the filter
    switch (filter) {
      case "newest":
        mainPipeline.push({ $sort: { createdAt: -1 } });
        break;
      case "frequent":
        mainPipeline.push({ $sort: { views: -1 } });
        break;
      case "unanswered":
        mainPipeline.push(
          {
            $addFields: { answercount: { $size: "$answers" } },
          },
          { $match: { answercount: 0 } },
          { $sort: { createdAt: -1 } }
        );
        break;
      default:
        break;
    }

    // Define the $facet stage separately
    const facetStage: PipelineStage[] = [
      {
        $facet: {
          metadata: [{ $count: "totalDocuments" }],
          questions: [{ $skip: (page - 1) * pageSize }, { $limit: pageSize }],
        },
      },
    ];

    // Combine the main pipeline with the facet stage
    const aggregatePipeline: PipelineStage[] = [...mainPipeline, ...facetStage];

    const result = await Question.aggregate(aggregatePipeline).exec();

    // console.log("RESULT", result[0].metadata,result[0].questions);

    const totalDocuments = result[0]?.metadata?.[0]?.totalDocuments || 0;

    const totalButtons = Math.ceil(totalDocuments / pageSize);
    const questions = result[0]?.questions || [];

    return { questions, totalButtons };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getQuestionsById(params: GetQuestionByIdParams) {
  try {
    connectToDatabase();
    const { questionId } = params;
    const questionDetails = await Question.findById(questionId)
      .populate({
        path: "tags",
        model: Tag,
        select: "_id name",
      })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name picture ",
      });
    return questionDetails;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createQuestion(params: CreateQuestionParams) {
  // eslint-disable-next-line no-empty
  try {
    connectToDatabase();
    const { title, description, tags, author, path } = params;

    // Create a question

    const question = await Question.create({
      title,
      description,
      author,
    });

    const tagDocument = [];
    // This check if the tag is already there in Tag schema or not. If there is then just push into questions array else create a new tag with name:tag and push into question array.
    // upsert == update and insert It looks for an existing tag in the Tag collection that matches the tag name (case-insensitive).
    // If the tag doesn’t exist, it creates a new tag with the given name and adds the question ID to its questions array.
    // The _id of each tag (whether new or existing) is added to the tagDocuments array.
    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $push: { questions: question._id } },
        { upsert: true, new: true }
      );
      tagDocument.push(existingTag);
    }

    // here we are just taking the newly created questions and adding the tags from line 15
    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocument } },
    });

    // Here we are creating Interaction for //! Recommendation system
    await Interaction.create({
      userId: author,
      action: "ask_question",
      question: question._id,
      tags: tagDocument,
    });

    // ? Increase the author reputation for creating a question.
    await User.findByIdAndUpdate(author, { $inc: { reputation: 5 } });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function upVoteQuestion(params: QuestionVoteParams) {
  try {
    connectToDatabase();
    const { userId, questionId, hasDownVoted, hasUpVoted, path } = params;
    let QueryObj = {};

    if (hasUpVoted) {
      QueryObj = { $pull: { upvotes: userId } };
    } else if (hasDownVoted) {
      QueryObj = { $pull: { downvotes: userId }, $push: { upvotes: userId } };
    } else {
      QueryObj = { $addToSet: { upvotes: userId } };
    }

    const question = await Question.findByIdAndUpdate(questionId, QueryObj, {
      new: true,
    });

    if (!question) {
      throw new Error("Question Not Found!");
    }

    // Increase the reputation

    // Here if the user has already upvoted then if again if he click the upvote button we need to undo the prev upvote and decrease the
    // reputation by -1. else increase the reputation by +1 cuz he is contributing to the site
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasUpVoted ? -1 : 1 },
    });

    // If other user has upvoted the author question then it should also increase the author reputations.

    await User.findByIdAndUpdate(question.author, {
      $inc: { reputation: hasUpVoted ? -10 : 10 },
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function downVoteQuestion(params: QuestionVoteParams) {
  try {
    connectToDatabase();
    const { userId, questionId, hasDownVoted, hasUpVoted, path } = params;
    let QueryObj = {};

    if (hasDownVoted) {
      QueryObj = { $pull: { downvotes: userId } };
    } else if (hasUpVoted) {
      QueryObj = { $pull: { upvotes: userId }, $push: { downvotes: userId } };
    } else {
      QueryObj = { $addToSet: { downvotes: userId } };
    }

    const question = await Question.findByIdAndUpdate(questionId, QueryObj, {
      new: true,
    });

    if (!question) {
      throw new Error("Question Not Found!");
    }

    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasDownVoted ? 2 : -2 },
    });

    await User.findByIdAndUpdate(question.author, {
      $inc: { reputation: hasDownVoted ? 10 : -10 },
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserQuestions(params: GetUserStatsParams) {
  try {
    connectToDatabase();
    const { userId, page = 1, pageSize = 10 } = params;

    const totalQuestions = await Question.countDocuments({ author: userId });
    const questions = await Question.find({ author: userId })
      .populate({ path: "tags", model: Tag, select: "_id name" })
      .populate({
        path: "author",
        model: User,
        select: "_id name username clerkId picture",
      });

    // ? If we use a - b then it will sort in ascending but b-a will sort in descending
    // ? Picks two elements, a and b.
    // ? The function checks the length of b.scores and subtracts the length of a.scores.
    // ? If the result is positive, b should come before a (meaning b has more scores than a).
    // ? If the result is negative, a should come before b (meaning a has more scores than b).
    // ? If the result is zero, their order stays the same.

    questions.sort((a, b) => {
      // First, compare by views
      if (b.views !== a.views) {
        return b.views - a.views;
      }
      // If views are equal, compare by the number of upvotes
      return b.upvotes.length - a.upvotes.length;
    });

    const limit = pageSize || 10;
    const skip = (page - 1) * limit;

    const totalButtons = Math.ceil(totalQuestions / limit);

    const paginatedQuestions = questions.slice(skip, skip + limit);

    return { totalQuestions, Questions: paginatedQuestions, totalButtons };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteQuestionsById(params: DeleteQuestionParams) {
  try {
    const { questionId, path } = params;

    await connectToDatabase();
    await Question.findOneAndDelete({ _id: questionId });
    //! Check the Question Schema for further deletion like tags,answers,interaction
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateQuestiion(params: EditQuestionParams) {
  // eslint-disable-next-line no-empty
  try {
    connectToDatabase();
    const { questionId, title, description, path } = params;

    const question = await Question.findByIdAndUpdate(
      questionId,
      { title, description },
      { new: true }
    );

    // If the question does not exist, return an error or throw an exception
    if (!question) {
      throw new Error("Question not found with the given ID");
    }
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getTopQuestions() {
  // eslint-disable-next-line no-empty
  try {
    connectToDatabase();
    const TopQuestions = await Question.aggregate([
      {
        $addFields: {
          upvotescount: { $size: "$upvotes" },
        },
      },
      {
        $sort: {
          views: -1,
          upvotescount: -1,
        },
      },
      { $limit: 5 },
    ]);

    return { TopQuestions };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
