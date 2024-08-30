import QuestionsForm from "@/components/forms/QuestionsForm";
import React from "react";

const AskQuestion = () => {
  return (
    <div className="w-full ">
      <h1 className="h1-bold text-dark100_light900">Ask a question</h1>
      <div>
        <QuestionsForm />
      </div>
    </div>
  );
};

export default AskQuestion;
