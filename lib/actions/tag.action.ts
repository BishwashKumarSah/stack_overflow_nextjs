"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../connectToDb";
import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from "./shared.types";
import Tag, { ITag } from "@/database/tag.model";
import Question, { IQuestion } from "@/database/question.model";
import { FilterQuery, PipelineStage } from "mongoose";

export const getTopInteractedTags = async (
  params: GetTopInteractedTagsParams
) => {
  try {
    connectToDatabase();
    // const { userId, limit = 3 } = params;
    const { userId } = params;

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User Not Found!");
    }
    return [
      { _id: "1", name: "react" },
      { _id: "2", name: "angular" },
      { _id: "3", name: "vue" },
    ];
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAllTags = async (params: GetAllTagsParams) => {
  try {
    connectToDatabase();
    const { page = 1, pageSize = 20, filter, searchQuery } = params;
    const limit = pageSize || 20;
    const skip = (page - 1) * limit;

    const query: FilterQuery<ITag> = {};
    if (searchQuery) {
      query.$or = [{ name: { $regex: new RegExp(searchQuery, "i") } }];
    }

    const aggregatePipeline: PipelineStage[] = [
      { $match: query },
      {
        $facet: {
          totalDocuments: [{ $count: "total" }],
          paginatedResults: [{ $skip: skip }, { $limit: limit }],
        },
      },
    ];

    switch (filter) {
      case "popular":
        aggregatePipeline.push(
          { $addFields: { questioncount: { $size: "$questions" } } },
          { $sort: { questioncount: -1 } }
        );
        break;

      case "recent":
        aggregatePipeline.push({
          $sort: {
            createdOn: -1,
          },
        });
        break;

      case "name":
        aggregatePipeline.push(
          {
            $addFields: { nameupper: { $toUpper: "$name" } },
          },
          { $sort: { nameupper: 1 } },
          { $project: { nameupper: 0 } }
        );
        break;

      case "old":
        aggregatePipeline.push({
          $sort: {
            createdOn: 1,
          },
        });
        break;
      default:
        break;
    }

    const allTags = await Tag.aggregate(aggregatePipeline).exec();

    const TagResults = allTags[0].paginatedResults?.map(
      (result: Partial<ITag>) => result
    );

    const totalDocuments =
      allTags[0].totalDocuments.length > 0
        ? allTags[0].totalDocuments[0].total
        : 0;

    const totalButtons = Math.ceil(totalDocuments / limit);

    return { allTags: TagResults, totalButtons };
  } catch (error) {
    console.log(error);

    throw error;
  }
};

export const GetQuestionsByTagId = async (
  params: GetQuestionsByTagIdParams
) => {
  connectToDatabase();
  try {
    const { tagId, page = 1, pageSize = 10, searchQuery } = params;

    const query: FilterQuery<IQuestion> = {};
    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, "i") } },
        { description: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    const tagQuestions = await Tag.findById(tagId).populate({
      path: "questions",
      model: Question,
      match: query,
      options: {
        sort: { createdAt: -1 },
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    });
    if (!tagQuestions) {
      throw new Error("Tags Not Found!");
    }
    return { tagTitle: tagQuestions.name, questions: tagQuestions.questions };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getPopularTags = async () => {
  try {
    await connectToDatabase();
    const Tags = await Tag.aggregate([
      {
        $addFields: {
          savedcount: { $size: "$followers" },
          questionscount: { $size: "$questions" },
        },
      },
      { $sort: { questionscount: -1 } },
      { $limit: 5 },
    ]);
    return { Tags };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
