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
import React, { Suspense } from "react";
import Loading from "./Loading";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home | StackOverflow",
  description:
    "Welcome to Stack Overflow – the premier destination for developers to ask questions, share knowledge, and find solutions. Join a global community where experts and enthusiasts collaborate to solve coding challenges and advance their skills. Whether you’re troubleshooting a bug or seeking advice on best practices, Stack Overflow connects you with the answers you need.",
  openGraph: {
    title: "Home | StackOverflow",
    description:
      "Welcome to Stack Overflow – the premier destination for developers to ask questions, share knowledge, and find solutions. Join a global community where experts and enthusiasts collaborate to solve coding challenges and advance their skills. Whether you’re troubleshooting a bug or seeking advice on best practices, Stack Overflow connects you with the answers you need.",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_HOST_URL}/assets/siteImages/home.png`, // Image path in the public folder
        width: 1200,
        height: 630,
      },
    ],
    url: "https://stack-overflow-bishwashkumarsahs-projects.vercel.app",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Home | StackOverflow",
    description:
      "Welcome to Stack Overflow – the premier destination for developers to ask questions, share knowledge, and find solutions. Join a global community where experts and enthusiasts collaborate to solve coding challenges and advance their skills. Whether you’re troubleshooting a bug or seeking advice on best practices, Stack Overflow connects you with the answers you need.",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_HOST_URL}/assets/siteImages/home.png`, // Image path in the public folder
        width: 1200,
        height: 630,
      },
    ],
  },

  icons: {
    icon: "/assets/images/site-logo.svg", // Path to the favicon or site logo
  },
};

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
    <Suspense fallback={<Loading />}>
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
      <div className="mt-9 flex w-full flex-col gap-5">
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
    </Suspense>
  );
};

export default Home;
