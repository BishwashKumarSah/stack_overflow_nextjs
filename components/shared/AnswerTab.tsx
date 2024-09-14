import { getUserAnswers } from "@/lib/actions/answer.action";
import React from "react";
import AnswerCard from "../cards/AnswerCard";
import Pagination from "./Pagination";

interface AnswerTabProps {
  clerkId?: string | null;
  userId: string;
  page?: number;
  pageSize?: number;
}

const AnswerTab = async (props: AnswerTabProps) => {
  const { userId, page, pageSize, clerkId } = props;
  const { totalAnswers, answers, totalButtons } = await getUserAnswers({
    userId: JSON.parse(userId),
    page,
    pageSize,
  });

  return (
    <>
      {answers.length > 0 ? (
        answers.map((answer) => {
          return (
            <AnswerCard
              clerkId={clerkId}
              key={answer._id}
              answerId={answer._id}
              _id={answer.question._id}
              title={answer.question?.title}
              votes={answer.upvotes?.length}
              author={answer.author}
              createdAt={answer.createdAt}
            />
          );
        })
      ) : (
        <h3 className="h3-bold text-dark200_light800">
          The User has not posted any answers yet!
        </h3>
      )}
      {totalButtons > 1 && (
        <div className="flex-center mt-11 w-full ">
          <Pagination totalButtons={totalButtons} currentPage={page!} />
        </div>
      )}
    </>
  );
};

export default AnswerTab;
