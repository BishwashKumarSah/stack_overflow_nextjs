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
interface Props {
  type: string;
  itemId: string;
  userId: string;
  upvotes: number;
  hasUpvoted: boolean;
  hasDownvoted: boolean;
  downvotes: number;
  hasSaved?: boolean;
}

const Voting = ({
  type,
  itemId,
  userId,
  upvotes,
  hasUpvoted,
  hasDownvoted,
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
  };

  const handleVote = async (action: string) => {
    if (!userId) {
      return;
    }
    if (action === "upvote") {
      if (type === "Question") {
        await upVoteQuestion({
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasUpVoted: hasUpvoted,
          hasDownVoted: hasDownvoted,
          path: pathname,
        });
      } else if (type === "Answer") {
        await upVoteAnswer({
          answerId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasUpVoted: hasUpvoted,
          hasDownVoted: hasDownvoted,
          path: pathname,
        });
      }
    } else if (action === "downvote") {
      if (type === "Question") {
        await downVoteQuestion({
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasUpVoted: hasUpvoted,
          hasDownVoted: hasDownvoted,
          path: pathname,
        });
      } else if (type === "Answer") {
        await downVoteAnswer({
          answerId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasUpVoted: hasUpvoted,
          hasDownVoted: hasDownvoted,
          path: pathname,
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
              hasUpvoted
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
              hasDownvoted
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
  