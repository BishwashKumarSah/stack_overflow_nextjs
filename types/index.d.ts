// Importing constants
import { BADGE_CRITERIA } from "@/constants";

// Interfaces
export interface SidebarLink {
  imgURL: string;
  route: string;
  label: string;
}

export interface Job {
  id?: string;
  employer_name?: string;
  employer_logo?: string | undefined;
  employer_website?: string;
  job_employment_type?: string;
  job_title?: string;
  job_description?: string;
  job_apply_link?: string;
  job_city?: string;
  job_state?: string;
  job_country?: string;
}

export interface Country {
  name: {
    common: string;
  };
}

export interface ParamsProps {
  params: {
    id: string;
  };
}

export interface SearchParamsProps {
  searchParams: {
    [key: string]: string | undefined;
  };
}

export interface URLProps {
  params: {
    id: string;
  };
  searchParams: {
    [key: string]: string | undefined;
  };
}

export interface BadgeCounts {
  GOLD: number;
  SILVER: number;
  BRONZE: number;
}

interface BadgeLevel {
  BRONZE: number;
  SILVER: number;
  GOLD: number;
}

export interface BadgeCriteria {
  QUESTION_COUNT: BadgeLevel;
  ANSWER_COUNT: BadgeLevel;
  QUESTION_UPVOTES: BadgeLevel;
  ANSWER_UPVOTES: BadgeLevel;
  TOTAL_VIEWS: BadgeLevel;
}


// interface CarInterface {
//   engine: string;
//   wheels: number;
//   color: string;
// }

// const carObject = {
//   engine: "V8",
//   wheels: 4,
//   color: "red",
// };

// type CarKeysFromInterface = keyof CarInterface; // "engine" | "wheels" | "color"
// type CarKeysFromObject = keyof typeof carObject; // "engine" | "wheels" | "color"

// if we change 
// Adding a new property to the object
// carObject["doors"] = 4; // New property added to carObject

// type CarKeysFromInterface = keyof CarInterface; // "engine" | "wheels" | "color"
// type CarKeysFromObject = keyof typeof carObject; // "engine" | "wheels" | "color" | "doors"

// keyof Interface: Use this when you want to get the keys from the blueprint (interface). This is static and won't change unless the interface changes.

// keyof typeof Object: Use this when you want to get the keys from the actual object. This will always reflect the current properties of the object, including any changes made dynamically at runtime.

export type BadgeCriteriaType = keyof typeof BADGE_CRITERIA;
