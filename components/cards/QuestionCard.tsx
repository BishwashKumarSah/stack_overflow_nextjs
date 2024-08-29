import React from "react";
import RenderTags from "../shared/RenderTags";
import Link from "next/link";
import Image from "next/image";

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
    <div className="card-wrapper mt-9 px-6 py-4 rounded-md">
      <div className="flex flex-col items-start w-full ">
        <div className="subtle-regular hidden max-sm:flex text-light400_light500">
          {String(createdAt)}
        </div>
        <Link href={`/questions/${_id}`}>
          <h3 className="sm:h3-semibold line-clamp-1 base-semibold my-2 text-dark100_light900">
            {title}
          </h3>
        </Link>
      </div>
      <div className="flex gap-5 flex-wrap">
        {tags.length > 0 &&
          tags.map((tag) => {
            return <RenderTags title={tag.name} _id={tag._id} key={tag._id} />;
          })}
      </div>
      <div className="flex  flex-wrap justify-between mt-3 items-center gap-2">
        <div className="flex gap-2 items-center ">
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
          <div className="subtle-regular max-sm:hidden text-light400_light500 line-clamp-1">
            &#x25cf; {String(createdAt)}
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <div className="flex gap-1 items-center">
            <Image
              src={`/assets/icons/like.svg`}
              alt="Like"
              width={18}
              height={18}
              className="invert-colors"
            />
            <p className="small-regular text-dark500_light700">{`${votes} Votes`}</p>
          </div>
          <div className="flex gap-1 items-center">
            <Image
              src={`/assets/icons/like.svg`}
              alt="Like"
              width={18}
              height={18}
              className="invert-colors"
            />
            <p className="small-regular text-dark500_light700">{`${votes} Votes`}</p>
          </div>
          <div className="flex gap-1 items-center">
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
      </div>
    </div>
  );
};

export default QuestionCard;
