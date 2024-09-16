import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const ProfileDetailsLoading = () => {
  return (
    <section className="p-6">
      <div className="flex flex-col-reverse gap-6  lg:flex-row">
        <div className="flex flex-col items-start gap-5 lg:flex-row">
          <Skeleton className="size-32 rounded-full" />
          <div className="flex flex-col gap-4">
            <Skeleton className="h-8 w-48 rounded" />
            <Skeleton className="h-6 w-36 rounded" />
            <div className="mt-2 flex gap-4">
              <Skeleton className="h-6 w-32 rounded" />
              <Skeleton className="h-6 w-32 rounded" />
              <Skeleton className="h-6 w-32 rounded" />
            </div>
            <Skeleton className="h-24 w-full rounded" />
          </div>
        </div>
        <div className="flex lg:ml-auto">
          <Skeleton className="h-10 w-40 rounded" />
        </div>
      </div>
      <div className="mt-6">
        <Skeleton className="h-10 w-40 rounded" />
        <section className="mt-10 flex justify-between gap-4">
          {[1, 2, 3, 4].map((val, ind) => (
            <Skeleton
              key={val + ind}
              className="h-[150px] w-[190px] rounded-2xl"
            />
          ))}
        </section>
      </div>
      <Skeleton className="mt-11 min-h-10 w-full rounded" />
      <div className="flex justify-between gap-5">
        <div className="mt-2 flex-1">
          <section className="mt-10 flex-1 flex flex-col gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val, ind) => (
              <Skeleton
                key={val + ind}
                className="h-[150px] w-full border-2 rounded-2xl"
              />
            ))}
          </section>
        </div>

        <div className="mt-6">
          {/* {[1, 2, 3].map((val, ind) => (
            <div
              className="flex justify-between items-center mb-2"
              key={val + ind}
            >
              <Skeleton className="h-6 w-32 rounded" />
              <Skeleton className="h-6 w-12 rounded" />
            </div>
          ))} */}
          <section className="mt-6 flex-1 flex flex-col gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val, ind) => (
              <div
                className="flex justify-between items-center gap-5 mb-2 "
                key={val + ind}
              >
                <Skeleton key={val + ind} className="h-9 w-40 rounded" />
              </div>
            ))}
          </section>
        </div>
      </div>
    </section>
  );
};

export default ProfileDetailsLoading;
