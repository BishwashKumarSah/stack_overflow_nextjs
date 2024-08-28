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

export type BadgeCriteriaType = keyof typeof BADGE_CRITERIA;
