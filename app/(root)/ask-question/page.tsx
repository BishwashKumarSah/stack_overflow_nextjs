import QuestionsForm from "@/components/forms/QuestionsForm";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import React from "react";

export const metadata: Metadata = {
  title: "Ask a Question | StackOverflow",
  description:
    "Ask a Question. Have a coding challenge or a technical query? Post your question here and get help from our vibrant community of developers. Whether it's a bug, best practice, or a complex issue, share your problem and receive expert advice, solutions, and insights from experienced professionals and enthusiasts. Join the conversation and find the answers you need to move forward.",
  openGraph: {
    title: "Ask a Question | StackOverflow",
    description:
      "Ask a Question. Have a coding challenge or a technical query? Post your question here and get help from our vibrant community of developers. Whether it's a bug, best practice, or a complex issue, share your problem and receive expert advice, solutions, and insights from experienced professionals and enthusiasts. Join the conversation and find the answers you need to move forward.",
    images: [
      {
        url: "/assets/siteImages/askquestions.png", // Image path in the public folder
        width: 1200,
        height: 630,
      },
    ],
    url: "https://stack-overflow-bishwashkumarsahs-projects.vercel.app",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ask a Question | StackOverflow",
    description:
      "Ask a Question. Have a coding challenge or a technical query? Post your question here and get help from our vibrant community of developers. Whether it's a bug, best practice, or a complex issue, share your problem and receive expert advice, solutions, and insights from experienced professionals and enthusiasts. Join the conversation and find the answers you need to move forward.",
    images: ["/assets/siteImages/askquestions.png"],
  },

  icons: {
    icon: "/assets/images/site-logo.svg",
  },
};

const AskQuestion = async () => {
  const { userId }: { userId: string | null } = auth();
  if (userId === null) {
    redirect("/sign-in");
  }

  const { user: mongoUser } = await getUserById({ userId });

  return (
    <div className="w-full ">
      <h1 className="h1-bold text-dark100_light900">Ask a question</h1>
      <div>
        <QuestionsForm
          mongoUserId={JSON.stringify(mongoUser._id)}
          type="Create"
        />
      </div>
    </div>
  );
};

export default AskQuestion;
