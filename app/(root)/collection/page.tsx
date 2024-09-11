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

const Collection = async ({ params, searchParams }: URLProps) => {
  const { userId }: { userId: string | null } = auth();

  if (userId === null) {
    redirect("/sign-in");
  }

  const searchQuery = searchParams.q;
  const { questions } = await getSavedQuestions({
    clerkId: userId,
    searchQuery,
  });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>
      <div className="mt-11 flex w-full justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/collection"
          placeholder="Search saved questions..."
          imgSrc="/assets/icons/search.svg"
          otherClasses="flex-1"
          iconPosition="left"
        />
        <Filter
          otherClasses="min-h-[56px] w-[170px] max-md:flex "
          filters={QuestionFilters}
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
            title="No Saved Questions To Show"
            description="It looks like there is no saved questions in your collections currently. Start exploring and saving the questions that suits your interest."
            link="/"
            linkText="Explore Question"
          />
        )}
      </div>
    </>
  );
};

export default Collection;
