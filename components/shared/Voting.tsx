"use client";
import { downVoteAnswer, upVoteAnswer } from "@/lib/actions/answer.action";
import { countViews } from "@/lib/actions/interaction.action";
import {
  downVoteQuestion,
  upVoteQuestion,
} from "@/lib/actions/question.action";
import { saveQuestion } from "@/lib/actions/user.action";
import { formatNumber } from "@/lib/utils";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "@/components/hooks/use-toast";

interface Props {
  type: string;
  itemId: string;
  userId: string;
  upvotes: number;
  hasUpVoted: boolean;
  hasDownVoted: boolean;
  downvotes: number;
  hasSaved?: boolean;
}

const Voting = ({
  type,
  itemId,
  userId,
  upvotes,
  hasUpVoted,
  hasDownVoted,
  downvotes,
  hasSaved,
}: Props) => {
  const pathname = usePathname();

  const handleSave = async () => {
    await saveQuestion({
      userId: JSON.parse(userId),
      questionId: JSON.parse(itemId),
      path: pathname,
    });
    return toast({
      title: `${!hasSaved ? "Saved in your collections" : "Removed from your collections"}`,
      variant: `${!hasSaved ? "default" : "destructive"}`,
    });
  };

  const handleVote = async (action: string) => {
    if (!userId) {
      return toast({
        title: "Please login to upVote",
        description: "You must be logged in to perform this action",
      });
    }
    if (action === "upvote") {
      if (type === "Question") {
        await upVoteQuestion({
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasUpVoted,
          hasDownVoted,
          path: pathname,
        });
        return toast({
          title: `${!hasUpVoted ? "Upvote successful" : "Removed Upvote"}`,
          variant: `${!hasUpVoted ? "default" : "destructive"}`,
        });
      } else if (type === "Answer") {
        await upVoteAnswer({
          answerId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasUpVoted,
          hasDownVoted,
          path: pathname,
        });
        return toast({
          title: `${!hasUpVoted ? "Upvote successful" : "Removed Upvote"}`,
          variant: `${!hasUpVoted ? "default" : "destructive"}`,
        });
      }
    } else {
      if (type === "Question") {
        await downVoteQuestion({
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasUpVoted,
          hasDownVoted,
          path: pathname,
        });
        return toast({
          title: `${!hasDownVoted ? "Downvote successful" : "Removed Downvote"}`,
          variant: `${!hasDownVoted ? "default" : "destructive"}`,
        });
      } else if (type === "Answer") {
        await downVoteAnswer({
          answerId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasUpVoted,
          hasDownVoted,
          path: pathname,
        });
        return toast({
          title: `${!hasDownVoted ? "Downvote successful" : "Removed Downvote"}`,
          variant: `${!hasDownVoted ? "default" : "destructive"}`,
        });
      }
    }
  };

  useEffect(() => {
    // Prevent calling countViews if no itemId or userId is present
    if (!itemId) return;

    const updateViews = async () => {
      await countViews({
        questionId: JSON.parse(itemId),
        userId: userId ? JSON.parse(userId) : undefined,
        path: pathname,
      });
    };

    updateViews();
  }, [itemId, userId, pathname]);

  return (
    <div className="flex items-center gap-5">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5">
          <Image
            onClick={() => handleVote("upvote")}
            src={
              hasUpVoted
                ? "/assets/icons/upvoted.svg"
                : "/assets/icons/upvote.svg"
            }
            alt="upvote"
            width={20}
            height={20}
            className="cursor-pointer"
          />
          <div className="flex-center background-light700_dark300 min-w-[20px] rounded-sm p-1">
            <p className=" text-dark300_light700 subtle-medium ">
              {formatNumber(upvotes)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Image
            onClick={() => handleVote("downvote")}
            src={
              hasDownVoted
                ? "/assets/icons/downvoted.svg"
                : "/assets/icons/downvote.svg"
            }
            alt="downvote"
            width={20}
            height={20}
            className="cursor-pointer"
          />
          <div className="flex-center background-light700_dark300 min-w-[20px] rounded-sm p-1">
            <p className=" text-dark300_light700 subtle-medium ">
              {formatNumber(downvotes)}
            </p>
          </div>
        </div>
      </div>
      {type === "Question" && (
        <div className="flex items-center">
          <Image
            onClick={handleSave}
            className="cursor-pointer"
            src={
              hasSaved
                ? "/assets/icons/star-filled.svg"
                : "/assets/icons/star-red.svg"
            }
            alt="save"
            width={20}
            height={20}
          />
        </div>
      )}
    </div>
  );
};

export default Voting;
