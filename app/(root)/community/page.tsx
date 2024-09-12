import UserCard from "@/components/cards/UserCard";
import Filter from "@/components/shared/Filter";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { Button } from "@/components/ui/button";
import { UserFilters } from "@/constants/filters";
import { getAllUsers } from "@/lib/actions/user.action";
import { URLProps } from "@/types";
import Link from "next/link";
import React from "react";

const Community = async ({ params, searchParams }: URLProps) => {
  const searchQuery = searchParams.q;
  const filter = searchParams.filter;
  const { allUsers } = await getAllUsers({ searchQuery, filter });
  return (
    <>
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
    </>
  );
};

export default Community;
