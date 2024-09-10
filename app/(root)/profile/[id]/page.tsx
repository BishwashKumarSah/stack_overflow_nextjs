import ProfileLink from "@/components/shared/ProfileLink";
import { Button } from "@/components/ui/button";
import { getUserDetailsById } from "@/lib/actions/user.action";
import { getYearMonth } from "@/lib/utils";
import { URLProps } from "@/types";
import { SignedIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Stats from "@/components/shared/Stats";
import QuestionTab from "@/components/shared/QuestionTab";
import AnswerTab from "@/components/shared/AnswerTab";

const ProfileDetails = async ({ params, searchParams }: URLProps) => {
  const { user, totalAnswersCount, totalQuestionsCount } =
    await getUserDetailsById({ userId: params.id });

  const { userId: clerkId } = auth();

  return (
    <>
      <div className="flex flex-col-reverse justify-between lg:flex-row">
        <div className="flex flex-col items-start gap-5 lg:flex-row">
          <Image
            src={user.picture}
            alt="Profile"
            width={128}
            height={128}
            className="rounded-full"
          />
          <div className="mt-3 flex flex-col">
            <h2 className="h2-bold text-dark100_light900">{user.name}</h2>
            <p className="paragraph-regular text-dark300_light700">{`@ ${user.username}`}</p>
            <div className="mt-3 flex flex-wrap gap-4">
              <ProfileLink
                title="Portfolio"
                href={user.portfolioWebsite}
                imgUrl="/assets/icons/link.svg"
              />
              <ProfileLink
                title={user.location}
                imgUrl="/assets/icons/location.svg"
              />
              <ProfileLink
                title={`Joined ${getYearMonth(user.joinedAt)}`}
                imgUrl="/assets/icons/calendar.svg"
              />
            </div>
            <p className="text-dark300_light700 paragraph-regular mt-3">
              {user.bio}
            </p>
          </div>
        </div>
        <div className="flex justify-end">
          <SignedIn>
            {clerkId === user.clerkId && (
              <Link href="/profile/edit">
                <Button className="paragraph-semibold text-dark300_light700 btn-secondary">
                  Edit Profile
                </Button>
              </Link>
            )}
          </SignedIn>
        </div>
      </div>
      <Stats
        totalQuestions={totalQuestionsCount}
        totalAnswers={totalAnswersCount}
      />
      <div className="mt-9">
        <Tabs defaultValue="top_posts" className="flex-1">
          <TabsList className="background-light800_dark400 min-h-[42px] p-1.5">
            <TabsTrigger
              value="top_posts"
              className="min-h-full rounded-md bg-light-800 text-light-500 data-[state=active]:bg-primary-100 data-[state=active]:text-primary-500 dark:bg-dark-400 dark:data-[state=active]:bg-dark-300 "
            >
              Top Posts
            </TabsTrigger>
            <TabsTrigger
              value="answers"
              className="min-h-full rounded-md bg-light-800 text-light-500 data-[state=active]:bg-primary-100 data-[state=active]:text-primary-500 dark:bg-dark-400 dark:data-[state=active]:bg-dark-300 "
            >
              Answers
            </TabsTrigger>
          </TabsList>
          <TabsContent value="top_posts">
            <QuestionTab
              clerkId={JSON.stringify(clerkId)}
              userId={JSON.stringify(user._id)}
              page={1}
              pageSize={10}
            />
          </TabsContent>
          <TabsContent value="answers">
            <AnswerTab
              clerkId={JSON.stringify(clerkId)}
              userId={JSON.stringify(user._id)}
              page={1}
              pageSize={10}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default ProfileDetails;
