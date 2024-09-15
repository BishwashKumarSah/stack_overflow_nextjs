import { formatNumber } from "@/lib/utils";
import { BadgeCounts } from "@/types";
import Image from "next/image";
import React from "react";

interface BadgeProps {
  imgUrl: string;
  title: string;
  value: number;
}

const BadgeCard = ({ imgUrl, title, value }: BadgeProps) => {
  return (
    <div className="background-light900_dark300 flex flex-col flex-wrap gap-5 border p-6 shadow-light-300 dark:shadow-dark-300 max-md:flex-row">
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
  badgeCounts: BadgeCounts;
  reputation: number;
}
const Stats = ({
  totalQuestions,
  totalAnswers,
  badgeCounts,
  reputation,
}: StatsProps) => {
  return (
    <>
      <h4 className="h3-semibold text-dark300_light700 mt-11">
        Stats - {reputation}
      </h4>
      <div className="mt-5 grid grid-cols-2 gap-5 md:grid-cols-2 lg:grid-cols-4">
        <div className="background-light900_dark300 flex flex-wrap items-center justify-evenly gap-5 border p-6 shadow-light-300 dark:shadow-dark-300">
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
          value={badgeCounts.GOLD}
        />
        <BadgeCard
          imgUrl="/assets/icons/silver-medal.svg"
          title="Silver Badges"
          value={badgeCounts.SILVER}
        />
        <BadgeCard
          imgUrl="/assets/icons/bronze-medal.svg"
          title="Bronze Badges"
          value={badgeCounts.BRONZE}
        />
      </div>
    </>
  );
};

export default Stats;
