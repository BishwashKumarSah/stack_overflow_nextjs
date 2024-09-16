import React from "react";

import Link from "next/link";
import Metric from "../shared/Metric";
import { formatNumber, getTimesAgo } from "@/lib/utils";
import { SignedIn } from "@clerk/nextjs";
import EditDeleteAction from "../shared/EditDeleteAction";

interface AnswerCardProps {
  _id: string;
  title: string;
  clerkId?: string | null;
  votes: number;
  author: {
    _id: string;
    clerkId: string;
    name: string;
    picture: string;
  };
  answerId: string;
  createdAt: Date;
}

const AnswerCard = ({
  _id,
  answerId,
  clerkId,
  title,
  votes,
  author,
  createdAt,
}: AnswerCardProps) => {
  const parsedClerkId = clerkId ? JSON.parse(clerkId) : "";
  const showActionButtons = parsedClerkId && parsedClerkId === author.clerkId;

  return (
    <div className="card-wrapper mt-9 rounded-md px-9 py-8">
      <div className="flex w-full flex-col items-start ">
        <div className="subtle-regular text-light400_light500 hidden max-sm:flex">
          {getTimesAgo(createdAt)}
        </div>
        <div className="flex w-full justify-between">
          <Link href={`/questions/${_id}`}>
            <h3 className="sm:h3-semibold base-semibold text-dark100_light900 my-2 line-clamp-1">
              {title}
            </h3>
          </Link>
          <SignedIn>
            {showActionButtons && (
              <EditDeleteAction
                type="Answer"
                itemId={JSON.stringify(answerId)}
              />
            )}
          </SignedIn>
        </div>
      </div>

      <div className="mt-4 flex w-full flex-wrap items-center justify-between gap-2">
        <Metric
          imgUrl={author.picture}
          title={`• ${getTimesAgo(createdAt)}`}
          value={author.name}
          alt="avatar"
          href={`/profile/${author.clerkId}`}
          isAuthor
          otherClasses="text-dark400_light800 body-medium"
        />
        <div className="w-fit">
          <Metric
            imgUrl="/assets/icons/like.svg"
            title=" Votes"
            value={formatNumber(votes)}
            alt="votes"
            otherClasses="text-dark400_light800 small-medium"
          />
        </div>
      </div>
    </div>
  );
};

export default AnswerCard;
