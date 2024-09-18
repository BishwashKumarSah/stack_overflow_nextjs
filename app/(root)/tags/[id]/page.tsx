import QuestionCard from "@/components/cards/QuestionCard";
import NoResult from "@/components/shared/NoResult";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import React from "react";
import { URLProps } from "@/types";
import { GetQuestionsByTagId } from "@/lib/actions/tag.action";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tags | StackOverflow",
  description:
    "Discover and browse tags to find questions and discussions related to specific topics. Tags help you filter content by technology, language, or area of interest, making it easier to connect with relevant information and experts.",
  openGraph: {
    title: "Tags | StackOverflow",
    description:
      "Discover and browse tags to find questions and discussions related to specific topics. Tags help you filter content by technology, language, or area of interest, making it easier to connect with relevant information and experts.",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_HOST_URL}/assets/siteImages/tags.png`, // Image path in the public folder
        width: 1200,
        height: 630,
      },
    ],
    url: "https://stack-overflow-bishwashkumarsahs-projects.vercel.app",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tags | StackOverflow",
    description:
      "Discover and browse tags to find questions and discussions related to specific topics. Tags help you filter content by technology, language, or area of interest, making it easier to connect with relevant information and experts.",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_HOST_URL}/assets/siteImages/tags.png`, // Image path in the public folder
        width: 1200,
        height: 630,
      },
    ],
  },

  icons: {
    icon: "/assets/images/site-logo.svg",
  },
};

const TagsQuestions = async ({ params, searchParams }: URLProps) => {
  const searchQuery = searchParams.q;
  const { tagTitle, questions } = await GetQuestionsByTagId({
    tagId: params.id,
    searchQuery,
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

      <div className="mt-11 flex w-full flex-col gap-6">
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
