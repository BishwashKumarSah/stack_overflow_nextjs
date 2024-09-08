"use client";
import { deleteAnswerById } from "@/lib/actions/answer.action";
import { deleteQuestionsById } from "@/lib/actions/question.action";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React from "react";
interface EditDeleteActionProps {
  type: string;
  itemId: string;
}
const EditDeleteAction = ({ type, itemId }: EditDeleteActionProps) => {
  const path = usePathname();
  const handleDelete = () => {
    if (type === "Question") {
      deleteQuestionsById({ questionId: JSON.parse(itemId), path });
    } else if (type === "Answer") {
      deleteAnswerById({ answerId: JSON.parse(itemId), path });
    }
  };

  const handleQuestionEdit = () => {};
  return (
    <div className="flex items-center justify-end gap-3 max-sm:w-full">
      {type === "Question" && (
        <Image
          src="/assets/icons/edit.svg"
          alt="edit"
          width={16}
          height={16}
          className="cursor-pointer"
          onClick={handleQuestionEdit}
        />
      )}
      <Image
        src="/assets/icons/trash.svg"
        alt="delete"
        width={16}
        height={16}
        className="cursor-pointer"
        onClick={handleDelete}
      />
    </div>
  );
};

export default EditDeleteAction;
