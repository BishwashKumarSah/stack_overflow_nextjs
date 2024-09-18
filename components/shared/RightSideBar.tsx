import Image from "next/image";
import Link from "next/link";
import React from "react";
import RenderTags from "./RenderTags";
import { getTopQuestions } from "@/lib/actions/question.action";
import { getPopularTags } from "@/lib/actions/tag.action";

const RightSideBar = async () => {
  const { TopQuestions } = await getTopQuestions();
  const { Tags } = await getPopularTags();
  return (
    <section className="background-light900_dark200 light-border sticky right-0 top-0 flex h-screen w-[350px] flex-col overflow-y-auto border-l px-6 pt-32 shadow-light-300 dark:shadow-none max-xl:hidden">
      <div>
        <h3 className="h3-bold text-dark200_light800 ">Tops Questions</h3>
        <div className="mt-5 flex w-full flex-col gap-[16px]">
          {TopQuestions &&
            TopQuestions.map((question) => {
              return (
                <Link
                  className="flex items-center justify-between"
                  key={question._id}
                  href={`/questions/${question._id}`}
                >
                  <p className="body-medium text-dark200_light800">
                    {question.title}
                  </p>
                  <Image
                    src="/assets/icons/chevron-right.svg"
                    alt="Chevron"
                    width={20}
                    height={20}
                    className="invert-colors"
                  />
                </Link>
              );
            })}
        </div>
      </div>
      <div className="mt-10">
        <h3 className="h3-bold text-dark200_light800 ">Popular Tags</h3>
        <div className="mt-5 flex w-full flex-col gap-4">
          {Tags &&
            Tags.map((tag) => {
              return (
                <RenderTags
                  key={tag._id}
                  title={tag.name}
                  _id={tag._id}
                  questionsCount={tag.questionscount}
                  showCount
                />
              );
            })}
        </div>
      </div>
    </section>
  );
};

export default RightSideBar;
