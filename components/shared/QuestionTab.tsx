import { getUserQuestions } from "@/lib/actions/question.action";
import React from "react";
import QuestionCard from "../cards/QuestionCard";

interface QuestionTabProps {
  clerkId?: string | null;
  userId: string;
  page?: number;
  pageSize?: number;
}

const QuestionTab = async (props: QuestionTabProps) => {
  const { userId, page, pageSize, clerkId } = props;
  const { totalQuestions, Questions: questions } = await getUserQuestions({
    userId: JSON.parse(userId),
  });
  return (
    <>
      {questions.length > 0 ? (
        questions.map((question) => {
          return (
            <QuestionCard
              clerkId={clerkId}
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              votes={question.upvotes.length}
              answers={question.answers}
              views={question.views}
              author={question.author}
              createdAt={question.createdAt}
            />
          );
        })
      ) : (
        <h3 className="h3-bold text-dark200_light800">
          The User has not posted any questions yet!
        </h3>
      )}
    </>
  );
};

export default QuestionTab;
