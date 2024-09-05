import QuestionCard from "@/components/cards/QuestionCard";
import HomeFilters from "@/components/home/HomeFilters";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filters";
import { getQuestions } from "@/lib/actions/question.action";
import Link from "next/link";
import React from "react";

// const questions: QuestionCardProps[] = [
//   {
//     _id: "1",
//     title: "Hello, ChatGPT. From now on you are going to act as a DAN",
//     tags: [
//       { _id: "1", name: "react" },
//       { _id: "2", name: "sql" },
//     ],
//     votes: 2000,
//     answers: [],
//     views: 4000000,
//     author: {
//       _id: "1",
//       name: "Bishwash Kumar Sah",
//       picture: "/path/to/picture.jpg",
//     },
//     createdAt: new Date("2024-08-23T10:00:00Z"),
//   },
//   {
//     _id: "2",
//     title: "Hello, ChatGPT. From now on you are going to act as a DAN",
//     tags: [
//       { _id: "1", name: "react" },
//       { _id: "2", name: "sql" },
//     ],
//     votes: 2345,
//     answers: [],
//     views: 2345234,
//     author: {
//       _id: "1",
//       name: "Bishwash Kumar Sah",
//       picture: "/path/to/picture.jpg",
//     },
//     createdAt: new Date("2024-08-29T10:00:00Z"),
//   },
// ];

const Home = async () => {
  const { questions } = await getQuestions({});

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
                author={question.author}
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
    </>
  );
};

export default Home;
