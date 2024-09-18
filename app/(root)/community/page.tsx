import UserCard from "@/components/cards/UserCard";
import Filter from "@/components/shared/Filter";
import Pagination from "@/components/shared/Pagination";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { Button } from "@/components/ui/button";
import { UserFilters } from "@/constants/filters";
import { getAllUsers } from "@/lib/actions/user.action";
import { URLProps } from "@/types";
import Link from "next/link";
import React, { Suspense } from "react";
import Loading from "./loading";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community | StackOverflow",
  description:
    "Join our vibrant community of developers and tech enthusiasts. Engage in discussions, share your knowledge, and connect with others who are passionate about coding and technology. Get involved in conversations, ask questions, and contribute to a supportive network of peers.",
  openGraph: {
    title: "Community | StackOverflow",
    description:
      "Join our vibrant community of developers and tech enthusiasts. Engage in discussions, share your knowledge, and connect with others who are passionate about coding and technology. Get involved in conversations, ask questions, and contribute to a supportive network of peers.",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_HOST_URL}/assets/siteImages/community.png`, // Image path in the public folder
        width: 1200,
        height: 630,
      },
    ],
    url: "https://stack-overflow-bishwashkumarsahs-projects.vercel.app",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Community | StackOverflow",
    description:
      "Join our vibrant community of developers and tech enthusiasts. Engage in discussions, share your knowledge, and connect with others who are passionate about coding and technology. Get involved in conversations, ask questions, and contribute to a supportive network of peers.",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_HOST_URL}/assets/siteImages/community.png`, // Image path in the public folder
        width: 1200,
        height: 630,
      },
    ],
  },

  icons: {
    icon: "/assets/images/site-logo.svg",
  },
};

const Community = async ({ params, searchParams }: URLProps) => {
  const searchQuery = searchParams.q;
  const filter = searchParams.filter;
  const page = searchParams?.page ? +searchParams.page : 1;
  const pageSize = 20;
  const { allUsers, totalButtons } = await getAllUsers({
    searchQuery,
    filter,
    page,
    pageSize,
  });

  return (
    <Suspense fallback={<Loading />}>
      <h1 className="h1-bold text-dark100_light900">All Users</h1>
      <div className="mt-11 flex w-full justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/community"
          placeholder="Search for great minds..."
          imgSrc="/assets/icons/search.svg"
          otherClasses="flex-1"
          iconPosition="left"
        />
        <Filter
          otherClasses="min-h-[56px] w-[170px] max-md:flex"
          filters={UserFilters}
        />
      </div>
      <section className="mt-9  flex-1">
        {allUsers.length > 0 ? (
          <div className="flex flex-wrap justify-evenly gap-5 ">
            {allUsers.map((user) => (
              <UserCard key={user._id} user={user} />
            ))}
          </div>
        ) : (
          <div className=" flex-center mt-9 flex size-full h-full flex-1 flex-col ">
            <h3 className="h3-bold text-dark100_light900 ">No Users Yet</h3>
            <Link href="/sign-up" className="mt-2 ">
              <Button className="primary-gradient mt-2 min-h-[46px] rounded-md px-4 py-3 !text-light-900">
                Join to be the first !
              </Button>
            </Link>
          </div>
        )}
      </section>
      {totalButtons > 1 && (
        <div className="flex-center mt-11 w-full ">
          <Pagination
            totalButtons={totalButtons}
            currentPage={searchParams?.page ? +searchParams.page : 1}
          />
        </div>
      )}
    </Suspense>
  );
};

export default Community;
