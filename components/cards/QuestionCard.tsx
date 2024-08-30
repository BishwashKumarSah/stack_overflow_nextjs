import React from "react";
import RenderTags from "../shared/RenderTags";
import Link from "next/link";
import Metric from "../shared/Metric";
import { getTimesAgo } from "@/lib/utils";

interface QuestionCardProps {
  _id: string;
  title: string;
  tags: {
    _id: string;
    name: string;
  }[];
  votes: number;
  answers: Array<object>;
  views: number;
  author: {
    _id: string;
    name: string;
    picture: string;
  };
  createdAt: Date;
}

const QuestionCard = ({
  _id,
  title,
  tags,
  votes,
  answers,
  views,
  author,
  createdAt,
}: QuestionCardProps) => {
  return (
    <div className="card-wrapper mt-9 rounded-md px-6 py-4">
      <div className="flex w-full flex-col items-start ">
        <div className="subtle-regular text-light400_light500 hidden max-sm:flex">
          {getTimesAgo(createdAt)}
        </div>
        <Link href={`/questions/${_id}`}>
          <h3 className="sm:h3-semibold base-semibold text-dark100_light900 my-2 line-clamp-1">
            {title}
          </h3>
        </Link>
      </div>
      <div className="flex flex-wrap gap-5">
        {tags.length > 0 &&
          tags.map((tag) => {
            return <RenderTags title={tag.name} _id={tag._id} key={tag._id} />;
          })}
      </div>
      {/* <div className="mt-3  flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 ">
          <Image
            src={`/assets/images/bishwash.jpg`}
            alt={`${author.name}`}
            width={20}
            height={10}
            className="rounded-full "
          />
          <p className="paragraph-semibold text-dark500_light700">
            {author.name}
          </p>
          <div className="subtle-regular text-light400_light500 line-clamp-1 max-sm:hidden">
            &#x25cf; {String(createdAt)}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Image
              src={`/assets/icons/like.svg`}
              alt="Like"
              width={18}
              height={18}
              className="invert-colors"
            />
            <p className="small-regular text-dark500_light700">{`${votes} Votes`}</p>
          </div>
          <div className="flex items-center gap-1">
            <Image
              src={`/assets/icons/like.svg`}
              alt="Like"
              width={18}
              height={18}
              className="invert-colors"
            />
            <p className="small-regular text-dark500_light700">{`${votes} Votes`}</p>
          </div>
          <div className="flex items-center gap-1">
            <Image
              src={`/assets/icons/like.svg`}
              alt="Like"
              width={18}
              height={18}
              className="invert-colors"
            />
            <p className="small-regular text-dark500_light700">{`${votes} Votes`}</p>
          </div>
        </div>
      </div> */}
      <div className="mt-4 flex w-full flex-wrap items-center justify-between gap-2">
        <Metric
          imgUrl="/assets/icons/avatar.svg"
          title={`• ${getTimesAgo(createdAt)}`}
          value={author.name}
          alt="avatar"
          href={`/profile/${author._id}`}
          isAuthor
          otherClasses="text-dark400_light800 body-medium"
        />
        <div className="flex items-center gap-2">
          <Metric
            imgUrl="/assets/icons/like.svg"
            title=" Votes"
            value={votes}
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
