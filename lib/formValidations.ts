"use client";

import { z } from "zod";

export const QuestionsSchema = z.object({
  title: z
    .string()
    .min(5, "Title must contain at least 5 character(s)")
    .max(150, "Title must contain at most 150 character(s)"),
  description: z.string().min(20).max(700),
  tags: z
    .array(z.string().min(2).max(20))
    .min(1, "Tags must contain at least 1 element(s)")
    .max(10, "Tags must contain at most 10 element(s)"),
});
