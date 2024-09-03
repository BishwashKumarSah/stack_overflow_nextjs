import { IUser } from "@/database/user.model";
// import { IUser as IUserFromMongodb } from "@/mongodb";
import { Schema } from "mongoose";


// Interface for creating an answer
export interface CreateAnswerParams {
  content: string;
  author: string; // User ID
  question: string; // Question ID
  path: string;
}

// Interface for fetching answers with optional pagination and sorting
export interface GetAnswersParams {
  questionId: string;
  sortBy?: string;
  page?: number;
  pageSize?: number;
}

// Interface for voting on an answer
export interface AnswerVoteParams {
  answerId: string;
  userId: string;
  hasUpVoted: boolean;
  hasDownVoted: boolean;
  path: string;
}

// Interface for deleting an answer
export interface DeleteAnswerParams {
  answerId: string;
  path: string;
}

// Interface for search parameters with optional query and type filters
export interface SearchParams {
  query?: string | null;
  type?: string | null;
}

// Interface for fetching recommended items with optional pagination and search query
export interface RecommendedParams {
  userId: string;
  page?: number;
  pageSize?: number;
  searchQuery?: string;
}

// Interface for viewing a question with an optional user ID
export interface ViewQuestionParams {
  questionId: string;
  userId?: string;
}

// Interface for job filtering parameters
export interface JobFilterParams {
  query: string;
  page: string;
}

// Interface for fetching questions with optional pagination, filtering, and search options
export interface GetQuestionsParams {
  page?: number;
  pageSize?: number;
  searchQuery?: string;
  filter?: string;
}

// Interface for creating a question
export interface CreateQuestionParams {
  title: string;
  description: string;
  tags: string[];
  author: Schema.Types.ObjectId | IUser;
  path: string;
}

// Interface for fetching a question by its ID
export interface GetQuestionByIdParams {
  questionId: string;
}

// Interface for voting on a question
export interface QuestionVoteParams {
  questionId: string;
  userId: string;
  hasUpVoted: boolean;
  hasDownVoted: boolean;
  path: string;
}

// Interface for deleting a question
export interface DeleteQuestionParams {
  questionId: string;
  path: string;
}

// Interface for editing a question
export interface EditQuestionParams {
  questionId: string;
  title: string;
  content: string;
  path: string;
}

// Interface for fetching all tags with optional pagination, filtering, and search options
export interface GetAllTagsParams {
  page?: number;
  pageSize?: number;
  filter?: string;
  searchQuery?: string;
}

// Interface for fetching questions by tag ID with optional pagination and search query
export interface GetQuestionsByTagIdParams {
  tagId: string;
  page?: number;
  pageSize?: number;
  searchQuery?: string;
}

// Interface for fetching top interacted tags with an optional limit
export interface GetTopInteractedTagsParams {
  userId: string;
  limit?: number;
}

// Interface for creating a user
export interface CreateUserParams {
  clerkId: string;
  name: string;
  username: string;
  email: string;
  picture: string;
}

// Interface for fetching a user by their ID
export interface GetUserByIdParams {
  userId: string;
}

// Interface for fetching all users with optional pagination, filtering, and search options
export interface GetAllUsersParams {
  page?: number;
  pageSize?: number;
  filter?: string;
  searchQuery?: string; // Add searchQuery parameter
}

// Interface for updating a user's data
export interface UpdateUserParams {
  clerkId: string;
  updateData: Partial<IUser>;
  path: string;
}

// Interface for toggling the save status of a question for a user
export interface ToggleSaveQuestionParams {
  userId: string;
  questionId: string;
  path: string;
}

// Interface for fetching saved questions with optional pagination, filtering, and search options
export interface GetSavedQuestionsParams {
  clerkId: string;
  page?: number;
  pageSize?: number;
  filter?: string;
  searchQuery?: string;
}

// Interface for fetching user statistics with optional pagination
export interface GetUserStatsParams {
  userId: string;
  page?: number;
  pageSize?: number;
}

// Interface for deleting a user
export interface DeleteUserParams {
  clerkId: string;
}
