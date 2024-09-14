import QuestionCard from "@/components/cards/QuestionCard";
import HomeFilters from "@/components/home/HomeFilters";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filters";
import { getQuestions } from "@/lib/actions/question.action";
import { URLProps } from "@/types";
import Link from "next/link";
import React from "react";

const Home = async ({ params, searchParams }: URLProps) => {
  const searchQuery = searchParams.q;
  const filter = searchParams.filter;
  const page = searchParams?.page ? +searchParams.page : 1;
  const pageSize = 20;

  const { questions, totalButtons } = await getQuestions({
    searchQuery,
    filter,
    page,
    pageSize,
  });

  return (
    <>
      <div className="flex w-full justify-between max-sm:flex-col-reverse sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Link href={`/ask-question`} className="flex justify-end ">
          <Button className="primary-gradient min-h-[46px] rounded-md px-4 py-3 !text-light-900">
            Ask a Question
          </Button>
        </Link>
      </div>
      <div className="mt-11 flex w-full justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/"
          placeholder="Search questions..."
          imgSrc="/assets/icons/search.svg"
          otherClasses="flex-1"
          iconPosition="left"
        />
        <Filter
          otherClasses="min-h-[56px] w-[170px] max-md:flex max-sm:w-full hidden"
          filters={HomePageFilters}
        />
      </div>
      <HomeFilters />
      <div className="flex w-full flex-col gap-6">
        {questions.length > 0 ? (
          questions.map((question) => {
            return (
              <QuestionCard
                key={question._id}
                _id={question._id}
                title={question.title}
                tags={question.tags}
                votes={question.upvotes.length}
                answers={question.answers}
                views={question.views}
                author={question.author[0]}
                createdAt={question.createdAt}
              />
            );
          })
        ) : (
          <NoResult
            title="There is no questions to show"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the
        discussion. our query could be the next big thing others learn from. Get
        involved!"
            link="/ask-question"
            linkText="Ask a Question"
          />
        )}
      </div>
      {totalButtons > 1 && (
        <div className="flex-center mt-11 w-full ">
          <Pagination
            totalButtons={totalButtons}
            currentPage={searchParams?.page ? +searchParams.page : 1}
          />
        </div>
      )}
    </>
  );
};

export default Home;
