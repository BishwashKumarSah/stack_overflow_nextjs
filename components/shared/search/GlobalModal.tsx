"use client";
import React, { useEffect, useState } from "react";
import GlobalFilters from "./GlobalFilters";
import { useSearchParams } from "next/navigation";
import { ReloadIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import Image from "next/image";
import { globalSearch } from "@/lib/actions/general.action";

const GlobalModal = () => {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState([]);
  const global = searchParams.get("global") || "";
  const type = searchParams.get("type");

  useEffect(() => {
    const fetchResults = async () => {
      setResults([]);
      setIsLoading(true);
      try {
        const result = await globalSearch({ query: global, type });
        setResults(JSON.parse(result));
      } catch (error) {
        console.log("GlobalSearchError", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    };
    if (global) {
      fetchResults();
    }
  }, [global, type]);

  const createLink = (type: string, id: string) => {
    switch (type) {
      case "question":
        return `/questions/${id}`;
      case "answer":
        return `/questions/${id}`;
      case "user":
        return `/profile/${id}`;
      case "tag":
        return `/tags/${id}`;
      default:
        return "/";
    }
  };

  return (
    <div className="absolute top-full z-10 mt-3 w-full rounded-xl bg-light-800 py-5 shadow-sm dark:bg-dark-400">
      <GlobalFilters />
      <div className="my-5 h-px bg-light-700/50 dark:bg-dark-500/50" />
      <div className="flex w-full flex-col">
        <p className="paragraph-semibold text-dark400_light900 px-5">
          Top Match
        </p>
        {isLoading ? (
          <div className="flex-center mt-5 flex flex-col">
            <ReloadIcon className="size-10 animate-spin text-primary-500" />
            <p className="body-medium text-dark300_light700 mt-2">
              Browsing the whole database...
            </p>
          </div>
        ) : (
          <div className="mt-5 flex flex-col gap-2">
            {results.length > 0 ? (
              results.map((item: any, index: number) => (
                <Link
                  key={item.type + item.id + index}
                  href={createLink(item.type, item.id)}
                  className="flex w-full cursor-pointer items-start gap-3 px-5 py-2.5 hover:bg-light-700/50 hover:dark:bg-dark-500/50"
                >
                  <Image
                    src="/assets/icons/tag.svg"
                    alt="tags"
                    width={18}
                    height={18}
                    className="invert-colors mt-1 object-contain"
                  />
                  <div className="flex flex-col">
                    <p className="body-medium text-dark200_light800 line-clamp-1">
                      {item.title}
                    </p>
                    <p className="text-light400_light500 small-medium mt-1 font-bold capitalize">
                      {item.type}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="flex-center flex flex-col">
                <span className="text-[50px]">🫣</span>{" "}
                <p className="body-medium text-dark200_light800">
                  Oops, no results found
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalModal;
