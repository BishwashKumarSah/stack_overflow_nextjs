import AnswerForm from "@/components/forms/AnswerForm";
import Metric from "@/components/shared/Metric";
import ParseHTML from "@/components/shared/ParseHTML";
import RenderTags from "@/components/shared/RenderTags";
import { getQuestionsById } from "@/lib/actions/question.action";
import { getTimesAgo } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import { auth } from "@clerk/nextjs/server";
import { getUserById } from "@/lib/actions/user.action";
import AllAnswers from "@/components/shared/AllAnswers";
import Voting from "@/components/shared/Voting";
import { URLProps } from "@/types";

const QuestionDetails = async ({ params, searchParams }: URLProps) => {
  const QuestionDetails = await getQuestionsById({ questionId: params.id });
  if (!QuestionDetails) {
    return (
      <h1 className="h1-bold text-dark100_light900 text-center">
        No Questions Found
      </h1>
    );
  }

  const { userId: clerkId }: { userId: string | null } = auth();
  let mongoUser;
  if (clerkId) {
    const { user } = await getUserById({ userId: clerkId });
    mongoUser = user;
  }
  return (
    <div className="flex w-full flex-col ">
      <div className="flex w-full flex-col-reverse justify-between sm:flex-row">
        <div className="flex-start flex items-center gap-2 ">
          <Image
            src={QuestionDetails.author.picture}
            width={22}
            height={22}
            className="rounded-full"
            alt="Profile"
          />
          <p className="paragraph-semibold text-dark300_light700">
            {QuestionDetails.author.name}
          </p>
        </div>
        <div className="text-dark100_light900 flex justify-end ">
          <Voting
            type="Question"
            itemId={JSON.stringify(QuestionDetails._id)}
            userId={JSON.stringify(mongoUser._id)}
            upvotes={QuestionDetails.upvotes.length}
            hasUpvoted={QuestionDetails.upvotes.includes(mongoUser._id)}
            hasDownvoted={QuestionDetails.downvotes.includes(mongoUser._id)}
            downvotes={QuestionDetails.downvotes.length}
            hasSaved={mongoUser.saved.includes(QuestionDetails._id)}
          />
        </div>
      </div>
      <div className="flex flex-col">
        <h2 className="h2-bold text-dark100_light900 mt-11">
          {QuestionDetails.title}
        </h2>
        <div className="mt-3 flex items-center gap-4">
          <Metric
            imgUrl="/assets/icons/clock.svg"
            title=""
            value={` Asked ${getTimesAgo(QuestionDetails.createdAt)}`}
            alt="clock"
            otherClasses="text-dark400_light800 small-medium"
          />
          <Metric
            imgUrl="/assets/icons/message.svg"
            title=" Answers"
            value={QuestionDetails.answers.length}
            alt="message"
            otherClasses="text-dark400_light800 small-medium"
          />
          <Metric
            imgUrl="/assets/icons/eye.svg"
            title=" Views"
            value={QuestionDetails.views}
            alt="eye"
            otherClasses="text-dark400_light800 small-medium"
          />
        </div>
      </div>
      <ParseHTML content={QuestionDetails.description} />
      <div className="mt-5 flex flex-wrap gap-2">
        {QuestionDetails.tags.map((tag: any) => {
          return <RenderTags key={tag._id} title={tag.name} _id={tag._id} />;
        })}
      </div>

      <AllAnswers
        questionId={QuestionDetails._id}
        questionCount={QuestionDetails.answers.length}
        userId={JSON.stringify(mongoUser._id)}
      />
      <AnswerForm
        question={QuestionDetails.description}
        questionId={JSON.stringify(QuestionDetails._id)}
        authorId={JSON.stringify(mongoUser._id)}
      />
    </div>
  );
};

export default QuestionDetails;
