import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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
    return value.toString(); // Less than a thousand
  }
}
