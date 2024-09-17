"use client";
import { deleteAnswerById } from "@/lib/actions/answer.action";
import { deleteQuestionsById } from "@/lib/actions/question.action";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { toast } from "../hooks/use-toast";
interface EditDeleteActionProps {
  type: string;
  itemId: string;
}
const EditDeleteAction = ({ type, itemId }: EditDeleteActionProps) => {
  const router = useRouter();
  const path = usePathname();
  const handleDelete = async () => {
    if (type === "Question") {
      await deleteQuestionsById({ questionId: JSON.parse(itemId), path }).then(
        (_) =>
          toast({
            title: "Question Deleted Successfully",
            variant: "destructive",
          })
      );
    } else if (type === "Answer") {
      await deleteAnswerById({ answerId: JSON.parse(itemId), path }).then(
        (_) =>
          toast({
            title: "Answer Deleted Successfully",
            variant: "destructive",
          })
      );
    }
  };

  const handleQuestionEdit = () => {
    router.push(`/questions/edit/${JSON.parse(itemId)}`);
  };
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
