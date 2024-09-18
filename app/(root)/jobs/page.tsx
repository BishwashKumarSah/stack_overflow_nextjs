import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { CountryFilters } from "@/constants/filters";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { URLProps } from "@/types";
import Pagination from "@/components/shared/Pagination";
import Loading from "./Loading";
import { Suspense } from "react";
import { getJobDetails } from "@/lib/actions/job.action";
import JobDetailsCard from "@/components/cards/JobDetailsCard";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jobs | StackOverflow",
  description:
    "Explore job opportunities tailored for developers. Find openings, apply for roles, and advance your career with listings from top tech companies and startups.",
  openGraph: {
    title: "Jobs | StackOverflow",
    description:
      "Explore job opportunities tailored for developers. Find openings, apply for roles, and advance your career with listings from top tech companies and startups.",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_HOST_URL}/assets/siteImages/jobs.png`, // Image path in the public folder
        width: 1200,
        height: 630,
      },
    ],
    url: "https://stack-overflow-bishwashkumarsahs-projects.vercel.app",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jobs | StackOverflow",
    description:
      "Explore job opportunities tailored for developers. Find openings, apply for roles, and advance your career with listings from top tech companies and startups.",
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_HOST_URL}/assets/siteImages/jobs.png`, // Image path in the public folder
          width: 1200,
          height: 630,
        },
      ],
  },

  icons: {
    icon: "/assets/images/site-logo.svg",
  },
};

const Jobs = async ({ params, searchParams }: URLProps) => {
  const { userId }: { userId: string | null } = auth();

  if (userId === null) {
    redirect("/sign-in");
  }

  const searchQuery = searchParams.q;
  const filter = searchParams.filter;
  const page = searchParams?.page ? +searchParams.page : 1;
  const pageSize = 20;

  const { jobDetails, totalButtons } = await getJobDetails({
    searchQuery,
    filter: filter?.toLocaleLowerCase(),
    page,
    pageSize,
  });

  return (
    <Suspense fallback={<Loading />}>
      <h1 className="h1-bold text-dark100_light900">Jobs</h1>
      <div className="mt-11 flex w-full justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/collection"
          placeholder="Job Title, Company, or Keywords"
          imgSrc="/assets/icons/search.svg"
          otherClasses="flex-1"
          iconPosition="left"
        />
        <Filter
          otherClasses="min-h-[56px] w-[230px] max-md:flex "
          filters={CountryFilters}
          type={true}
        />
      </div>

      <div className="mt-9 flex w-full flex-col gap-5">
        {jobDetails.length > 0 ? (
          jobDetails.map((jobDetail: any) => {
            return (
              <JobDetailsCard
                key={jobDetail._id}
                _id={jobDetail._id}
                url={jobDetail.url}
                companyName={jobDetail.companyName}
                title={jobDetail.title}
                type={jobDetail.type}
                description={jobDetail.description}
                location={jobDetail.location}
                salary={jobDetail.salary}
                createdAt={jobDetail.createdAt}
              />
            );
          })
        ) : (
          <NoResult
            title="No Saved Questions To Show"
            description="It looks like there is no saved questions in your collections currently. Start exploring and saving the questions that suits your interest."
            link="/"
            linkText="Explore Question"
          />
        )}
      </div>
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

export default Jobs;
