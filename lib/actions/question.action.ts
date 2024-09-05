"use server";

import Question from "@/database/question.model";
import { connectToDatabase } from "../connectToDb";
import Tag from "@/database/tag.model";
import {
  CreateQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
  QuestionVoteParams,
} from "./shared.types";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";

export async function getQuestions(params: GetQuestionsParams) {
  try {
    connectToDatabase();
    const questions = await Question.find({})
      .populate({ path: "tags", model: Tag })
      .populate({ path: "author", model: User })
      .sort({ createdAt: -1 });
    return { questions };
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

    // TODO: Increase the reputation

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

    // TODO: Increase the reputation

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
