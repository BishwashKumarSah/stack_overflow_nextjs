import { Schema, models, model, Document } from "mongoose";
import Answer from "./answer.model";
import Interaction from "./interaction.model";
import Tag from "./tag.model";

export interface IQuestion extends Document {
  title: string;
  description: string;
  upvotes: Schema.Types.ObjectId[];
  downvotes: Schema.Types.ObjectId[];
  views: number;
  answers: Schema.Types.ObjectId[];
  author: Schema.Types.ObjectId;
  tags: Schema.Types.ObjectId[];
  createdAt: Date;
}

const QuestionSchema = new Schema<IQuestion>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
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
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    answers: [
      {
        type: Schema.Types.ObjectId,
        ref: "Answer",
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

QuestionSchema.post("findOneAndDelete", async function (doc) {
  
  if (doc) {
  
    await Answer.deleteMany({ _id: { $in: doc.answers } });
    
    await Interaction.deleteMany({ question: doc._id });
 
    await Tag.updateMany(
      { _id: { $in: doc.tags } },
      { $pull: { questions: doc._id } }
    );
    const tagsWithNoQuestions = await Tag.find({ questions: { $size: 0 } });
    const tagsToDelete = tagsWithNoQuestions.map((tag) => tag._id);
    
    await Tag.deleteMany({ _id: { $in: tagsToDelete } });
  }
});

const Question =
  models.Question || model<IQuestion>("Question", QuestionSchema);

export default Question;
