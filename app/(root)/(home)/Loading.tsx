import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = async () => {
  return (
    <section>
      <section className="flex justify-between">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Skeleton className="h-14 w-[190px]" />
      </section>
      <div className="mt-11 flex w-full justify-between gap-5 max-sm:flex-col sm:items-center">
        <Skeleton className="min-h-[56px] w-full flex-1" />
        <Skeleton className="hidden min-h-[56px] w-[170px] max-md:flex max-sm:w-full" />
      </div>
      <section className="mt-5 flex flex-wrap gap-4 ">
        {[1, 2, 3, 4].map((val, ind) => (
          <Skeleton
            key={val + ind}
            className="h-[50px] w-[90px] max-md:hidden"
          />
        ))}
      </section>
      <section className="mt-9 flex flex-wrap gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val, ind) => (
          <Skeleton key={val + ind} className="h-[150px] w-full rounded-2xl " />
        ))}
      </section>
    </section>
  );
};

export default Loading;
