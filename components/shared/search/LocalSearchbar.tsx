"use client";
import { Input } from "@/components/ui/input";
import { formQueryUrl, removeKeysFromUrl } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const query = searchParams.get("q");
  const [search, setSearch] = useState(query || "");

  useEffect(() => {
    const delayDebouncedFn = setTimeout(() => {
      if (search) {
        const formUrl = formQueryUrl({
          params: searchParams.toString(),
          key: "q",
          value: search,
        });
        router.push(formUrl, { scroll: false });
      } else {
        if (pathname === route) {
          const formUrl = removeKeysFromUrl({
            params: searchParams.toString(),
            keys: ["q"],
          });
          router.push(formUrl, { scroll: false });
        }
      }
    }, 300);
    return () => {
      clearTimeout(delayDebouncedFn);
    };
  }, [search, searchParams, router, pathname, route]);

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
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={placeholder}
        className="paragraph-medium placeholder background-light800_dark400 text-dark400_light800 no-focus min-h-full border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 dark:caret-white"
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
