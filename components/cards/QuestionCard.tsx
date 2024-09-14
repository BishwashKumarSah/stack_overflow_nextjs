import React from "react";
import RenderTags from "../shared/RenderTags";
import Link from "next/link";
import Metric from "../shared/Metric";
import { formatNumber, getTimesAgo } from "@/lib/utils";
import { SignedIn } from "@clerk/nextjs";
import EditDeleteAction from "../shared/EditDeleteAction";

interface QuestionCardProps {
  _id: string;
  title: string;
  tags: {
    _id: string;
    name: string;
  }[];
  votes: number;
  clerkId?: string | null;
  answers: Array<object>;
  views: number;
  author: {
    _id: string;
    clerkId: string;
    name: string;
    picture: string;
  };
  createdAt: Date;
}

const QuestionCard = ({
  _id,
  title,
  clerkId,
  tags,
  votes,
  answers,
  views,
  author,
  createdAt,
}: QuestionCardProps) => {
  const parsedClerkId = clerkId ? JSON.parse(clerkId) : "";
  const showActionButtons = parsedClerkId && parsedClerkId === author.clerkId;
  return (
    <div className="card-wrapper mt-9 rounded-md px-6 py-4">
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
              <EditDeleteAction type="Question" itemId={JSON.stringify(_id)} />
            )}
          </SignedIn>
        </div>
      </div>
      <div className="flex flex-wrap gap-5">
        {tags?.length > 0 &&
          tags.map((tag) => (
            <RenderTags key={tag._id} title={tag.name} _id={tag._id} />
          ))}
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
        <div className="flex items-center gap-2">
          <Metric
            imgUrl="/assets/icons/like.svg"
            title=" Votes"
            value={formatNumber(votes)}
            alt="votes"
            otherClasses="text-dark400_light800 small-medium"
          />
          <Metric
            imgUrl="/assets/icons/message.svg"
            title=" Answers"
            value={answers.length}
            alt="message"
            otherClasses="text-dark400_light800 small-medium"
          />
          <Metric
            imgUrl="/assets/icons/eye.svg"
            title=" Views"
            value={views}
            alt="eye"
            otherClasses="text-dark400_light800 small-medium"
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
