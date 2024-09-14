"use client";
import { formQueryUrl, getButtons } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";

interface PaginationProps {
  totalButtons: number;
  currentPage: number;
}

const Pagination = ({ totalButtons, currentPage }: PaginationProps) => {
  const buttons = getButtons({ currentPage, totalButtons });
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleNavigation = (direction: string) => {
    let newPage: number;
    if (direction === "prev") {
      newPage = Math.max(currentPage - 1, 1); // Ensure page is not less than 1
    } else if (direction === "next") {
      newPage = Math.min(currentPage + 1, totalButtons); // Ensure page is not greater than totalButtons
    } else {
      return; // Invalid direction
    }
    const newUrl = formQueryUrl({
      params: searchParams.toString(),
      key: "page",
      value: newPage.toString(),
    });
    router.push(newUrl);
  };

  const handleButtonNavigation = (button: string | number) => {
    const pageNumber = typeof button === "string" ? parseInt(button, 10) : button;
    if (!isNaN(pageNumber)) {
      const newUrl = formQueryUrl({
        params: searchParams.toString(),
        key: "page",
        value: pageNumber.toString(),
      });
      router.push(newUrl);
    }
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        type="button"
        className={`flex items-center justify-center rounded-md border px-4 py-2 transition-colors duration-200 ${currentPage === 1 ? "border-gray-300 bg-gray-200 text-gray-400" : "border-orange-500 bg-white text-orange-600 hover:bg-orange-100"}`}
        disabled={currentPage === 1}
        onClick={() => handleNavigation("prev")}
      >
        <p className="text-sm font-medium">Prev</p>
      </Button>

      <div className="flex gap-2">
        {buttons.length > 0 &&
          buttons.map((button, index) => (
            <Button
              key={index}
              type="button"
              className={`flex items-center justify-center rounded-md border px-3 py-1 text-sm font-medium ${button === currentPage ? "border-orange-500 bg-orange-500 text-white" : "border-gray-300 bg-white text-orange-600 hover:bg-orange-100"}`}
              onClick={() => handleButtonNavigation(button)}
            >
              {button}
            </Button>
          ))}
      </div>

      <Button
        type="button"
        className={`flex items-center justify-center rounded-md border px-4 py-2 transition-colors duration-200 ${currentPage === totalButtons ? "border-gray-300 bg-gray-200 text-gray-400" : "border-orange-500 bg-white text-orange-600 hover:bg-orange-100"}`}
        disabled={currentPage === totalButtons}
        onClick={() => handleNavigation("next")}
      >
        <p className="text-sm font-medium">Next</p>
      </Button>
    </div>
  );
};

export default Pagination;
