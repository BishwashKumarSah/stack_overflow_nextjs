"use client";
import Image from "next/image";
import React from "react";
import { Input } from "@/components/ui/input";

const GlobalSearch = () => {
  const handleSearchInput = () => {};
  return (
    <div className="background-light800_dark400 relative w-full max-w-[600px] rounded-xl  border-none px-3 py-2 outline-none max-lg:hidden">
      <div className="flex">
        <Image
          src="/assets/icons/search.svg"
          alt="Search"
          width={20}
          height={20}
          className="cursor-pointer"
        ></Image>
        <Input
          type="text"
          value=""
          onChange={(e) => handleSearchInput()}
          placeholder="Search anything globally..."
          className="paragraph-medium placeholder background-light800_dark400 no-focus min-h-full border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 dark:caret-white"
        />
      </div>
    </div>
  );
};

export default GlobalSearch;
