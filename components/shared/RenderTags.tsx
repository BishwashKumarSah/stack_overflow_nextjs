import React from "react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface Props {
  title: string;
  _id: string;
  questionsCount?: number;
  showCount?: boolean;
}

const RenderTags = ({ title, _id, questionsCount, showCount }: Props) => {
  return (
    <Link href={`/tags/${_id}`} className="flex justify-between">
      <Badge className="subtle-medium uppercase background-light800_dark300 text-light400_light500 rounded-md  border-none px-4 py-2 ">
        {title}
      </Badge>
      {questionsCount && (
        <p className="small-medium text-dark400_light700">{questionsCount}</p>
      )}
    </Link>
  );
};

export default RenderTags;
