import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import qs from "query-string";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTimesAgo(date: Date): string {
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  const now: Date = new Date();
  const seconds: number = Math.floor(now.getTime() - date.getTime()) / 1000;

  //    Array of key-value pairs
  // const entries = [
  //   ['name', 'Alice'],
  //   ['age', 30],
  //   ['city', 'New York']
  // ];

  //  Convert to an object
  // *const obj = Object.fromEntries(entries);

  // console.log(obj);
  // * Output: { name: 'Alice', age: 30, city: 'New York' }
  // But for array output
  // !const obj = { name: 'Alice', age: 30, city: 'New York' };
  // !const entries = Object.entries(obj);
  // console.log(entries);
  // *Output: [ ['name', 'Alice'], ['age', 30], ['city', 'New York'] ]

  // ?const array = [1, 2, 3]; to get the value of array use {of} if we use {in} we get the indices like 0,1,2 not the value of the array 1,2,3
  // use of in dictionary

  // for (const value of array) {
  //   console.log(value);  // Outputs the values of the array
  // }
  for (const [unit, value] of Object.entries(intervals)) {
    const difference = Math.floor(seconds / value);
    if (difference >= 1) {
      return `${difference} ${unit}${difference > 1 ? "'s" : ""} ago`;
    }
  }
  return "just now";
}

export function formatNumber(value: number): string {
  if (value >= 1_000_000_000) {
    return (value / 1_000_000_000).toFixed(1) + "B"; // Billion
  } else if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(1) + "M"; // Million
  } else if (value >= 1_000) {
    return (value / 1_000).toFixed(1) + "K"; // Thousand
  } else {
    return value?.toString(); // Less than a thousand
  }
}

export const getYearMonth = (date: Date) => {
  // Get the month and year
  const month = date.toLocaleString("default", { month: "long" }); // "long" for full month name (e.g., "September")
  const year = date.getFullYear(); // Get the year

  return `${month} ${year}`;
};

interface formQueryUrlProps {
  params: string;
  key: string;
  value: string | null;
}

export const formQueryUrl = ({ params, key, value }: formQueryUrlProps) => {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  const newUrl = qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );

  return newUrl;
};

interface removeKeysFromUrlParams {
  params: string;
  keys: string[];
}

export const removeKeysFromUrl = ({
  params,
  keys,
}: removeKeysFromUrlParams) => {
  const currentUrl = qs.parse(params);

  keys.forEach((key) => delete currentUrl[key]);

  const newUrl = qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );

  return newUrl;
};

interface getButtonsProps {
  currentPage: number;
  totalButtons: number;
}
export const getButtons = ({ currentPage, totalButtons }: getButtonsProps) => {
  let startPage, endPage;
  const maxButtonsToShow = 4;
  // [1,2,3,4] => ie if totalButtons is less than <= maxButtonToShow. then just show [1,2,3,4] or [1...totalButtons] like if only 2 then [1,2]

  // check if the currentPage lies on first half or second half lets say totalButton is 21 then [1,2,3,4.....,18,19,20,21] here first half
  // will be 1,2,3 we donot show 4 because it lies in middle we need to show more button if we are on 4th page. like
  // for 1,2,3 it is visual that i have next pages [[1,2,3],4] ie 4 is the next page but  i am on 4th page [1,2,3,[4]...] i need to show [1,...,2]

  //   Beginning of Pages:(from chatgpt)
  //      When on the first few pages (like 1, 2, or 3), it simply displays those pages without ellipses between consecutive ones (i.e., 1 2 3 4 ... 21).
  // Middle Pages:
  //      When in the middle (e.g., 4), it displays the current page and a few pages around it, with ellipses at both the beginning and the end (e.g., 1 ... 3 4 5 6 ... 21).
  // End of Pages:
  //      Near the end (e.g., 18, 19, 20), it displays the last few pages and the first page with ellipses before them (e.g., 1 ... 18 19 20 21).

  const firstHalf = 3;
  const secondHalf = totalButtons - 3;

  // To check if totalButton <= maxButtonsToShow ie if totalButtons == 2 and maxButtonsToShow = 4 then show only 2 buttons [1,2]
  if (totalButtons <= maxButtonsToShow) {
    startPage = 1;
    endPage = totalButtons;
  } else {
    // This means that there are more buttons to show. Now i need to check if the currentPage lies on the firstHalf or secondHalf.
    // If it lies on the firstHalf ie [1,2,3] then show [1,2,3,4 ... , totalButtons] so here start will be 1 and end will be 4
    // if it lies on the secondHalf ie [18,19,20,21] show [1, ... , 18,19,20,21]
    if (currentPage <= firstHalf) {
      startPage = 1;
      endPage = maxButtonsToShow;
    } else if (currentPage > firstHalf && currentPage < secondHalf) {
      // it means we are on the between [4,5,6..,17] like in middle page so here we have to show [1,...,3,[4],5,6,...,21].
      // lets say i am on 4th page then 4 - 1 on left and 4 + 2 on right and ... on both side cuz we are in middle page.
      // so start will be currentPage - 1 and endPage will be currentPage + 2
      startPage = currentPage - 1;
      endPage = currentPage + 2;
      // so total 4 buttons.
    } else {
      // we are on the secondHalf/rightHalf
      startPage = secondHalf;
      endPage = maxButtonsToShow;
    }
  }

  const buttons = [];
  if (startPage === 1 && endPage <= maxButtonsToShow) {
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(i);
    }
  } else if (startPage === 1) {
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(i);
    }
    buttons.push("...");
    buttons.push(totalButtons);
  } else if (startPage === secondHalf) {
    // it means we are on the secondHalf ie either on [18,19,20,21] so we need [1,...,18,19,20,21]
    buttons.push(1);
    buttons.push("...");
    for (let i = startPage; i <= totalButtons; i++) {
      buttons.push(i);
    }
  } else {
    buttons.push(1);
    buttons.push("...");
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(i);
    }
    
    buttons.push("...");
    buttons.push(totalButtons);
  }
  console.log({ buttons });
  return buttons;
};
