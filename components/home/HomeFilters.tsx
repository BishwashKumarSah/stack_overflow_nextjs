"use client";
import { HomePageFilters } from "@/constants/filters";
import React from "react";
import { Button } from "../ui/button";

const HomeFilters = () => {
  const active = "newest";
  return (
    <div className="mt-5 hidden gap-2 md:flex">
      {HomePageFilters?.map((item) => {
        return (
          <Button
            key={item.value}
            onClick={() => {}}
            className={`px-6 py-3 body-medium capitalize rounded-lg ${active === item.value ? "text-primary-500 bg-primary-100 dark:text-dark-800 dark:bg-dark-400" : "text-light-500 bg-light-800 dark:text-dark-800 dark:bg-dark-300"}`}
          >
            {item.name}
          </Button>
        );
      })}
    </div>
  );
};

export default HomeFilters;
