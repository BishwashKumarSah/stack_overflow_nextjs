import { formatNumber } from "@/lib/utils";
import Image from "next/image";
import React from "react";

interface BadgeProps {
  imgUrl: string;
  title: string;
  value: number;
}

const BadgeCard = ({ imgUrl, title, value }: BadgeProps) => {
  return (
    <div className="flex flex-wrap flex-col max-md:flex-row gap-5 background-light900_dark300 shadow-light-300 dark:shadow-dark-300 border p-6">
      <Image src={imgUrl} alt="Badge" width={30} height={30} />
      <div className="flex flex-col gap-1">
        <p className="paragraph-semibold text-dark200_light900">{value}</p>
        <p className="body-medium text-dark200_light900">{title}</p>
      </div>
    </div>
  );
};

interface StatsProps {
  totalQuestions: number;
  totalAnswers: number;
}
const Stats = ({ totalQuestions, totalAnswers }: StatsProps) => {
  return (
    <>
      <h4 className="h3-semibold text-dark300_light700 mt-11">Stats</h4>
      <div className="grid mt-5 grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="flex flex-wrap gap-5 justify-evenly background-light900_dark300 shadow-light-300 items-center dark:shadow-dark-300 border p-6">
          <div className="flex flex-col flex-wrap items-center gap-1">
            <p className="paragraph-semibold text-dark200_light900">
              {formatNumber(totalQuestions)}
            </p>
            <p className="body-medium text-dark200_light900">Questions</p>
          </div>
          <div className="flex flex-col flex-wrap items-center gap-1">
            <p className="paragraph-semibold text-dark200_light900">
              {formatNumber(totalAnswers)}
            </p>
            <p className="body-medium text-dark200_light900">Answers</p>
          </div>
        </div>
        <BadgeCard
          imgUrl="/assets/icons/gold-medal.svg"
          title="Gold Badges"
          value={0}
        />
        <BadgeCard
          imgUrl="/assets/icons/silver-medal.svg"
          title="Silver Badges"
          value={0}
        />
        <BadgeCard
          imgUrl="/assets/icons/bronze-medal.svg"
          title="Bronze Badges"
          value={0}
        />
      </div>
    </>
  );
};

export default Stats;
