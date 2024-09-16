import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = async () => {
  return (
    <section>
      <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>
      <div className="mt-11 flex w-full justify-between gap-5 max-sm:flex-col sm:items-center">
        <Skeleton className="h-14 flex-1" />

        <Skeleton className="h-14 w-28" />
      </div>
      <section className="mt-12 flex flex-wrap gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val, ind) => (
          <Skeleton key={val + ind} className="h-[150px] w-full rounded-2xl " />
        ))}
      </section>
    </section>
  );
};

export default Loading;
