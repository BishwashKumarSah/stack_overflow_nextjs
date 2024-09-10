import QuestionsForm from "@/components/forms/QuestionsForm";
import { getQuestionsById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";
import { URLProps } from "@/types";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const AskQuestion = async ({ params }: URLProps) => {
  const { userId }: { userId: string | null } = auth();
  if (userId === null) {
    redirect("/sign-in");
  }

  const { user: mongoUser } = await getUserById({ userId });
  const question = await getQuestionsById({ questionId: params.id });

  return (
    <div className="w-full ">
      <h1 className="h1-bold text-dark100_light900">Edit question</h1>
      <div>
        <QuestionsForm
          type="Edit"
          mongoUserId={JSON.stringify(mongoUser._id)}
          questionDetails={JSON.stringify(question)}
        />
      </div>
    </div>
  );
};

export default AskQuestion;
