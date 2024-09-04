"use server";

import Answer from "@/database/answer.model";
import { connectToDatabase } from "../connectToDb";
import { CreateAnswerParams } from "./shared.types";
import Question from "@/database/question.model";
import { revalidatePath } from "next/cache";

export const createAnswer = async (params: CreateAnswerParams) => {
  try {
    connectToDatabase();
    const { content, author, question, path } = params;
    const newAnswer = await Answer.create({ content, author, question });

    // Add the answer to the question's answers array.
    await Question.findByIdAndUpdate(question, {
      $push: { answers: newAnswer._id },
    });
    //TODO: Increase the reputations
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
