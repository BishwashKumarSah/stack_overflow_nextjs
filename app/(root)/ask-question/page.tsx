import QuestionsForm from "@/components/forms/QuestionsForm";
import { getUserById } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";
import React from "react";

const AskQuestion = async () => {
  // !To - Do
  // const { userId } = auth();
  const userId = "clerk_123456";

  if (!userId) {
    redirect("/sign-in");
  }

  const mongoUser = await getUserById({ userId });

  return (
    <div className="w-full ">
      <h1 className="h1-bold text-dark100_light900">Ask a question</h1>
      <div>
        <QuestionsForm mongoUserId={JSON.stringify(mongoUser._id)} />
      </div>
    </div>
  );
};

export default AskQuestion;
