"use client";
import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HomePageFilterProps {
  filters: {
    name: string;
    value: string;
  }[];
  otherClasses?: string;
}

const Filter = ({ filters, otherClasses }: HomePageFilterProps) => {
  return (
    <Select>
      <SelectTrigger
        className={`${otherClasses} background-light800_dark300 text-dark500_light700`}
      >
        <div className="line-clamp-1 flex-1 text-left">
          <SelectValue placeholder="Select a Filter" />
        </div>
      </SelectTrigger>
      <SelectContent className="background-light900_dark200 w-full ring-offset-0">
        <SelectGroup>
          {filters &&
            filters.map((item) => {
              return (
                <SelectItem
                  key={item.value}
                  value={item.value}
                  className="text-dark300_light700 items-start hover:bg-light-700 dark:hover:bg-dark-400"
                >
                  {item.name}
                </SelectItem>
              );
            })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default Filter;
