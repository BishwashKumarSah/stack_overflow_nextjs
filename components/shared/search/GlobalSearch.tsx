"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formQueryUrl, removeKeysFromUrl } from "@/lib/utils";
import GlobalModal from "./GlobalModal";

const GlobalSearch = () => {
  const router = useRouter();
  const pathname = usePathname()
  const searchQuery = useSearchParams();
  const modelRef = useRef(null);

  const query = searchQuery.get("q") || "";
  const globalQuery = searchQuery.get("global") || "";

  const [search, setSearch] = useState(query);
  const [globalSearch, setGlobalSearch] = useState(globalQuery);

  const [isModelOpen, setIsModelOpen] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (event: any) => {
      // @ts-ignore
      if (modelRef.current && !modelRef.current.contains(event.target)) {
        setIsModelOpen(false);
        setGlobalSearch("");
      }
    };
    setIsModelOpen(false)
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [pathname]);

  useEffect(() => {
    const DebouncedSearchFn = setTimeout(() => {
      if (globalSearch) {
        const newUrl = formQueryUrl({
          params: searchQuery.toString(),
          key: "global",
          value: globalSearch,
        });
        router.push(newUrl, { scroll: false });
      } else {
        if (query || globalSearch === "") {
          const newUrl = removeKeysFromUrl({
            params: searchQuery.toString(),
            keys: ["global", "type"],
          });
          router.push(newUrl, { scroll: false });
        }
      }
    }, 300);

    return () => {
      clearTimeout(DebouncedSearchFn);
    };
  }, [router, search, searchQuery, globalSearch, query]);

  return (
    <>
      <div
        className=" relative w-full max-w-[600px]  max-lg:hidden"
        ref={modelRef}
      >
        <div className="background-light800_dark400 text-dark300_light700 flex rounded-xl border-none px-3 py-2 outline-none">
          <Image
            src="/assets/icons/search.svg"
            alt="Search"
            width={20}
            height={20}
            className="cursor-pointer"
          ></Image>
          <Input
            type="text"
            value={globalSearch}
            onChange={(e) => {
              setGlobalSearch(e.target.value);
              if (!isModelOpen) {
                setIsModelOpen(true);
              }
              if (e.target.value === "" && isModelOpen) {
                setIsModelOpen(false);
              }
            }}
            placeholder="Search anything globally..."
            className="paragraph-medium placeholder background-light800_dark400 no-focus text-dark100_light900 min-h-full border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 dark:caret-white"
          />
        </div>
        {isModelOpen && <GlobalModal />}
      </div>
    </>
  );
};

export default GlobalSearch;
