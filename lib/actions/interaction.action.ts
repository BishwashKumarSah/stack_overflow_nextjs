"use server";

import Question from "@/database/question.model";
import { connectToDatabase } from "../connectToDb";
import { ViewQuestionParams } from "./shared.types";
import Interaction from "@/database/interaction.model";
import { revalidatePath } from "next/cache";


export const countViews = async (params: ViewQuestionParams) => {
  try {
    await connectToDatabase();
    const { questionId, userId, path } = params;

    await Question.findByIdAndUpdate(questionId, { $inc: { views: 1 } });
    
    if (userId) {
      const hasViewed = await Interaction.findOne({
        userId,
        action: "view",
        question: questionId,
      });

      if (hasViewed) {
        revalidatePath(path);
        return
      } else {
        await Interaction.create({
          userId,
          action: "view",
          question: questionId,
        });
      }
    }
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
