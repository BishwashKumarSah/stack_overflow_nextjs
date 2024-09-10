import React from "react";
import Filter from "@/components/shared/Filter";
import { AnswerFilters } from "@/constants/filters";
import { getAllAnswer } from "@/lib/actions/answer.action";
import ParseHTML from "./ParseHTML";
import Link from "next/link";
import Image from "next/image";
import { getTimesAgo } from "@/lib/utils";
import Voting from "./Voting";

interface Props {
  questionId: string;
  questionCount: number;
  userId: string;
}
const AllAnswers = async (params: Props) => {
  const { questionCount, questionId, userId } = params;
  const { allAnswers } = await getAllAnswer({ questionId });
  return (
    <div className="flex flex-col">
      <div className="mt-11 flex items-center justify-between">
        <h3 className="primary-text-gradient">{questionCount} Answers</h3>
        <Filter
          filters={AnswerFilters}
          otherClasses=" w-[170px] max-md:flex "
        />
      </div>
      <div>
        {allAnswers.length > 0 &&
          allAnswers.map((answer) => (
            <article className="light-border border-b-2 py-10" key={answer._id}>
              <div className="flex items-center justify-between">
                <div>
                  <Link
                    href={`/profile/${answer.author.clerkId}`}
                    className="flex items-center gap-1"
                  >
                    <Image
                      className="rounded-full object-cover"
                      src={answer.author.picture}
                      alt="Profile"
                      width={18}
                      height={18}
                    />
                    <div className="flex  items-center gap-1">
                      <p className="body-semibold text-dark300_light700">
                        {answer.author.name}
                      </p>
                      <span className="small-regular text-light400_light500 line-clamp-1 max-sm:hidden">
                        {" • "}
                        {` Answered ${getTimesAgo(answer.createdAt)}`}
                      </span>
                    </div>
                  </Link>
                </div>
                <div>
                  <Voting
                    type="Answer"
                    itemId={JSON.stringify(answer._id)}
                    userId={userId}
                    upvotes={answer.upvotes.length}
                    hasUpvoted={answer.upvotes.includes(userId)}
                    hasDownvoted={answer.downvotes.includes(userId)}
                    downvotes={answer.downvotes.length}
                  />
                </div>
              </div>
              <ParseHTML content={answer.content} />
            </article>
          ))}
      </div>
    </div>
  );
};

export default AllAnswers;
