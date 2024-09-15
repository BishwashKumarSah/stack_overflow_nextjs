import { Schema, models, model, Document } from "mongoose";

export interface IUser extends Document {
  clerkId: string;
  name: string;
  username: string;
  email: string;
  password?: string;
  picture: string;
  reputation?: number;
  bio?: string;
  portfolioWebsite?: string;
  location?: string;
  saved?: Schema.Types.ObjectId[];
  joinedAt: Date;
}

const UserSchema = new Schema(
  {
    clerkId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    location: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    picture: {
      type: String,
      required: true,
    },
    password: {
      type: String,
    },
    portfolioWebsite: {
      type: String,
    },
    saved: [
      {
        type: Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
    reputation: {
      type: Number,
      default: 0,
    },
    bio: {
      type: String,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const User = models.User || model<IUser>("User", UserSchema);

export default User;
