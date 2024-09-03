"use client";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import React from "react";

interface CustomSearchProps {
  route: string;
  placeholder: string;
  imgSrc: string;
  otherClasses?: string;
  iconPosition: string;
}

const LocalSearchbar = ({
  route,
  placeholder,
  imgSrc,
  otherClasses,
  iconPosition,
}: CustomSearchProps) => {
  return (
    <div
      className={`background-light800_dark400 flex min-h-[56px] grow items-center  rounded-[10px] border-none px-5 py-2 outline-none ${otherClasses}`}
    >
      {iconPosition === "left" && (
        <Image
          src={imgSrc}
          alt="Search"
          width={20}
          height={20}
          className="cursor-pointer"
        ></Image>
      )}
      <Input
        type="text"
        value=""
        onChange={() => {}}
        placeholder={placeholder}
        className="paragraph-medium placeholder background-light800_dark400 no-focus min-h-full border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 dark:caret-white"
      ></Input>
      {iconPosition === "right" && (
        <Image
          src={imgSrc}
          alt="Search"
          width={20}
          height={20}
          className="cursor-pointer"
        ></Image>
      )}
    </div>
  );
};

export default LocalSearchbar;
