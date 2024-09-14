import { model, models, Document, Schema } from "mongoose";
import Question from "./question.model";
import Interaction from "./interaction.model";

export interface IAnswer extends Document {
  author: Schema.Types.ObjectId;
  question: Schema.Types.ObjectId;
  content: string;
  upvotes: Schema.Types.ObjectId[];
  downvotes: Schema.Types.ObjectId[];
  createdAt: Date;
}

const AnswerSchema = new Schema<IAnswer>({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  question: {
    type: Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  upvotes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  downvotes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

AnswerSchema.post("findOneAndDelete", async function (doc) {
  console.log("inside");
  if (doc) {
    console.log("inside answer model", doc);
    await Question.updateMany(
      { _id: doc.question },
      { $pull: { answers: doc._id } }
    );
    await Interaction.deleteMany({ answer: doc._id });
  }
});

const Answer = models.Answer || model<IAnswer>("Answer", AnswerSchema);
export default Answer;
