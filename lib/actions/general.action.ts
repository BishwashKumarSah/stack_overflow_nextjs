"use server";
import { Model } from "mongoose";
import Question from "@/database/question.model";
import { connectToDatabase } from "../connectToDb";
import { SearchParams } from "./shared.types";
import Answer from "@/database/answer.model";
import User from "@/database/user.model";
import Tag from "@/database/tag.model";

const searchableTypes = ["answer", "question", "user", "tag"];

export const globalSearch = async (params: SearchParams) => {
  try {
    await connectToDatabase();
    const { query, type } = params;

    const RegExp = { $regex: query, $options: "i" };

    interface ImodelsAndTypes {
      model: Model<any>;
      field: string;
      type: string;
    }

    const modelsAndTypes: ImodelsAndTypes[] = [
      { model: Question, field: "title", type: "question" },
      { model: Answer, field: "content", type: "answer" },
      { model: User, field: "name", type: "user" },
      { model: Tag, field: "name", type: "tag" },
    ];

    const typeLower = type?.toLowerCase();
    let results = [];

    if (!typeLower || !searchableTypes.includes(typeLower)) {
      // SearchForEveryTHing
      //   ! IMPORTANT: WE DONOT USE Async/await in forEach or Map.

      for (const { model, field, type } of modelsAndTypes) {
        const data = await model.find({ [field]: RegExp }).limit(2);

        results.push(
          ...data.map((item) => ({
            title:
              type === "answer" ? `Answer containing ${query}` : item[field],
            type,
            id:
              type === "user"
                ? item.clerkId
                : type === "answer"
                  ? item.question
                  : item._id,
          }))
        );
      }
      //   console.log({ results });
    } else {
      // Search in the specified model type
      const modelObj = modelsAndTypes.find((item) => item.type === typeLower);
      if (!modelObj) {
        throw new Error("Invalid Search Type");
      }

      const queryResult = await modelObj.model
        .find({
          [modelObj.field]: RegExp,
        })
        .limit(8);
      results = queryResult.map((item) => ({
        title:
          type === "answer"
            ? `Answer containing ${query}`
            : item[modelObj.field],
        type,
        id:
          type === "user"
            ? item.clerkId
            : type === "answer"
              ? item.question
              : item._id,
      }));
    }
    return JSON.stringify(results);
  } catch (error) {
    console.log("GeneralActionError", error);
    throw error;
  }
};
