"use client";
import { HomePageFilters } from "@/constants/filters";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { formQueryUrl, removeKeysFromUrl } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

const HomeFilters = () => {
  const [active, setActive] = useState("");
  const params = useSearchParams();
  const router = useRouter();

  const handleFilterQuery = (item: string) => {
    if (active === item) {
      setActive("");
      const newUrl = removeKeysFromUrl({
        params: params.toString(),
        keys: ["filter"],
      });
      router.push(newUrl);
    } else {
      setActive(item);
      const newUrl = formQueryUrl({
        params: params.toString(),
        key: "filter",
        value: item.toLowerCase(),
      });
      router.push(newUrl);
    }
  };

  return (
    <div className="mt-5 hidden gap-2 md:flex">
      {HomePageFilters?.map((item) => {
        return (
          <Button
            key={item.value}
            onClick={() => {
              handleFilterQuery(item.value);
            }}
            className={`body-medium rounded-lg px-6 py-3 capitalize ${active === item.value ? " bg-primary-100 text-primary-500 dark:bg-dark-400" : " bg-light-800 text-light-500 dark:bg-dark-300"}`}
          >
            {item.name}
          </Button>
        );
      })}
    </div>
  );
};

export default HomeFilters;
