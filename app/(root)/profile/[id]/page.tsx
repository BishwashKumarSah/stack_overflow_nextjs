import ProfileLink from "@/components/shared/ProfileLink";
import { Button } from "@/components/ui/button";
import { getUserDetailsById } from "@/lib/actions/user.action";
import { getYearMonth } from "@/lib/utils";
import { URLProps } from "@/types";
import { SignedIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import React, { Suspense } from "react";
import Stats from "@/components/shared/Stats";
import QuestionTab from "@/components/shared/QuestionTab";
import AnswerTab from "@/components/shared/AnswerTab";
import ProfileDetailsLoading from "./Loading";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile | StackOverflow",
  description:
    "View and manage your personal profile. Check out your activity, including your questions, answers, and saved content. Customize your settings, track your contributions, and stay updated with your interactions within the community.",
  openGraph: {
    title: "Profile | StackOverflow",
    description:
      "View and manage your personal profile. Check out your activity, including your questions, answers, and saved content. Customize your settings, track your contributions, and stay updated with your interactions within the community.",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_HOST_URL}/assets/siteImages/profile.png`, // Image path in the public folder
        width: 1200,
        height: 630,
      },
    ],
    url: "https://stack-overflow-bishwashkumarsahs-projects.vercel.app",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Profile | StackOverflow",
    description:
      "View and manage your personal profile. Check out your activity, including your questions, answers, and saved content. Customize your settings, track your contributions, and stay updated with your interactions within the community.",
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_HOST_URL}/assets/siteImages/profile.png`, // Image path in the public folder
          width: 1200,
          height: 630,
        },
      ],
  },

  icons: {
    icon: "/assets/images/site-logo.svg",
  },
};

const ProfileDetails = async ({ params, searchParams }: URLProps) => {
  const {
    user,
    totalAnswersCount,
    totalQuestionsCount,
    badgesObj,
    reputation,
    topTags,
  } = await getUserDetailsById({ userId: params.id });

  const page = searchParams?.page ? +searchParams.page : 1;
  const pageSize = 10;
  const { userId: clerkId } = auth();

  return (
    <Suspense fallback={<ProfileDetailsLoading />}>
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
        badgeCounts={badgesObj}
        reputation={reputation}
      />
      <div className="mt-9 flex justify-between gap-5">
        <div>
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
                page={page}
                pageSize={pageSize}
              />
            </TabsContent>
            <TabsContent value="answers">
              <AnswerTab
                clerkId={JSON.stringify(clerkId)}
                userId={JSON.stringify(user._id)}
                page={page}
                pageSize={pageSize}
              />
            </TabsContent>
          </Tabs>
        </div>
        {topTags.length > 0 && (
          <div className="w-full max-w-[250px]">
            <h4 className="h3-semibold text-dark300_light700 text-center">
              Top Tags
            </h4>
            <div className="mt-12 flex flex-col gap-5">
              {topTags.length > 0 &&
                topTags.map((tag, ind) => (
                  <Link
                    href={`/tags/${tag._id}`}
                    className="flex justify-between"
                    key={tag + ind}
                  >
                    <Badge className="subtle-medium background-light800_dark300 text-light400_light500 rounded-md border-none  px-4 py-2 uppercase ">
                      {tag.name}
                    </Badge>
                    <p>{tag.count}</p>
                  </Link>
                ))}
            </div>
          </div>
        )}
      </div>
    </Suspense>
  );
};

export default ProfileDetails;
