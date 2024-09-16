"use client";
import { GlobalSearchFilters } from "@/constants/filters";
import { formQueryUrl, removeKeysFromUrl } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

const GlobalFilters = () => {
  const router = useRouter();
  const searchQuery = useSearchParams();

  const typeParams = searchQuery.get("type") || "";

  const [active, setActive] = useState(typeParams);

  const handleTypeClick = (item: string) => {
    if (active === item) {
      setActive("");
      const newUrl = removeKeysFromUrl({
        params: searchQuery.toString(),
        keys: ["type"],
      });
      router.push(newUrl, { scroll: false });
    } else {
      setActive(item);
      const newUrl = formQueryUrl({
        params: searchQuery.toString(),
        key: "type",
        value: item.toLowerCase(),
      });

      router.push(newUrl, { scroll: false });
    }
  };

  return (
    <div className="flex items-center gap-5 px-5">
      <p className="body-medium text-dark400_light900">Type:</p>
      <div className="flex gap-2">
        {GlobalSearchFilters.map((item) => (
          <button
            type="button"
            key={item.value}
            onClick={() => handleTypeClick(item.value)}
            className={`light-border-2 small-medium rounded-2xl px-5 py-2 capitalize dark:text-light-800  hover:text-primary-500 dark:bg-dark-500 hover:dark:text-primary-500 ${active === item.value ? "bg-primary-500 dark:bg-primary-500 text-light-900 hover:!text-light-900 hover:dark:!text-light-900" : "bg-light-700 text-dark-400"}`}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GlobalFilters;
