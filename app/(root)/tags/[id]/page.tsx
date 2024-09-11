import QuestionCard from "@/components/cards/QuestionCard";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { QuestionFilters } from "@/constants/filters";
import { getSavedQuestions } from "@/lib/actions/user.action";
import React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { URLProps } from "@/types";
import { GetQuestionsByTagId } from "@/lib/actions/tag.action";

const TagsQuestions = async ({ params, searchParams }: URLProps) => {
  const searchQuery = searchParams.q
  const { tagTitle, questions } = await GetQuestionsByTagId({
    tagId: params.id,
    searchQuery
  });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900 capitalize">{tagTitle}</h1>

      <div className="mt-11 w-full ">
        <LocalSearchbar
          route={`/tags/${params.id}`}
          placeholder="Search for tags..."
          imgSrc="/assets/icons/search.svg"
          otherClasses="flex-1"
          iconPosition="left"
        />
      </div>

      <div className="flex w-full flex-col gap-6">
        {questions.length > 0 ? (
          questions.map((question: any) => {
            return (
              <QuestionCard
                key={question._id}
                _id={question._id}
                title={question.title}
                tags={question.tags}
                votes={question.upvotes.length}
                answers={question.answers}
                views={question.views}
                author={question.author}
                createdAt={question.createdAt}
              />
            );
          })
        ) : (
          <NoResult
            title="No Tags To Show"
            description="It looks like there is no saved questions in your collections currently. Start exploring and saving the questions that suits your interest."
            link="/"
            linkText="Explore Question"
          />
        )}
      </div>
    </>
  );
};

export default TagsQuestions;
