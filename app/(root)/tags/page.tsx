import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { TagFilters } from "@/constants/filters";
import { getAllTags } from "@/lib/actions/tag.action";
import { URLProps } from "@/types";
import Link from "next/link";
import React from "react";

const Community = async ({ params, searchParams }: URLProps) => {
  //   const { allUsers } = await getAllUsers({});
  const searchQuery = searchParams.q;
  const filter = searchParams.filter;
  const { allTags } = await getAllTags({ searchQuery, filter });
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">All Tags</h1>
      <div className="mt-11 flex w-full justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/tags"
          placeholder="Search for tags..."
          imgSrc="/assets/icons/search.svg"
          otherClasses="flex-1"
          iconPosition="left"
        />
        <Filter
          otherClasses="min-h-[56px] w-[170px] max-md:flex"
          filters={TagFilters}
        />
      </div>
      <section className="mt-9  flex-1">
        {allTags.length > 0 ? (
          <div className="flex flex-wrap justify-evenly gap-5 ">
            {allTags.map((tag) => (
              <Link href={`/tags/${tag._id}`} key={tag._id}>
                <article className="background-light900_dark200 light-border flex w-full flex-col rounded-2xl border px-8 py-10 sm:w-[260px]">
                  <div className="background-light800_dark400 w-fit rounded-sm px-5 py-1.5">
                    <p className="paragraph-semibold text-dark300_light900">
                      {tag.name.toUpperCase()}
                    </p>
                  </div>
                  <p className="small-medium text-dark400_light500 mt-3.5">
                    JavaScript, often abbreviated as JS, is a programming
                    language that is one of the core technologies of the World
                    Wide Web, alongside HTML and CSS
                  </p>
                  <p className="small-medium text-dark400_light500 mt-3.5">
                    <span className="body-semibold primary-text-gradient mr-2.5">
                      {tag.questions.length}+
                    </span>
                    Questions
                  </p>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <NoResult
            title="No Tags Found"
            description="It looks like there are no tags found"
            link="/ask-question"
            linkText="Ask a question"
          />
        )}
      </section>
    </>
  );
};

export default Community;
