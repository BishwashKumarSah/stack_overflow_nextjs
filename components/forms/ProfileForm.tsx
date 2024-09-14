"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { updateUser } from "@/lib/actions/user.action";
import { usePathname, useRouter } from "next/navigation";
import { ProfileSchema } from "@/lib/formValidations";

interface Props {
  clerkId: string;
  userDetails: string;
}

const ProfileForm = ({ clerkId, userDetails }: Props) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pathname = usePathname();

  const parsedUserDetails = JSON.parse(userDetails);
  const parsedClerkId = JSON.parse(clerkId);

  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: parsedUserDetails.name || "",
      username: parsedUserDetails.username || "",
      portfolioWebsite: parsedUserDetails.portfolioWebsite || "",
      location: parsedUserDetails.location || "",
      bio: parsedUserDetails.bio || "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof ProfileSchema>) {
    setIsSubmitting(true);
    try {
      console.log({
        name: values.name,
        username: values.username,
        portfolioWebsite: values.portfolioWebsite,
        location: values.location,
        bio: values.bio,
      });
      await updateUser({
        clerkId: parsedClerkId,
        updateData: {
          name: values.name,
          username: values.username,
          portfolioWebsite: values.portfolioWebsite,
          location: values.location,
          bio: values.bio,
        },
        path: pathname,
      });
      router.back();
    } catch (error) {
      console.log("Profile Form Error", error);
      throw new Error("Something Went Wrong!!!");
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-9 flex w-full flex-col space-y-8"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel className="paragraph-semibold text-dark100_light900">
                Name <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Your Name"
                  {...field}
                  required
                  className="no-focus light-border-2 paragraph-regular background-light700_dark300 text-dark300_light700 min-h-[56px] border focus-visible:ring-0 focus-visible:ring-offset-0 dark:caret-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel className="paragraph-semibold text-dark100_light900 ">
                Username <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Your username"
                  {...field}
                  required
                  className="no-focus light-border-2 paragraph-regular background-light700_dark300 text-dark300_light700 min-h-[56px] border focus-visible:ring-0 focus-visible:ring-offset-0 dark:caret-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="portfolioWebsite"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel className="paragraph-semibold text-dark100_light900 ">
                Portfolio Link
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Your portfolio URL"
                  {...field}
                  className="no-focus light-border-2 paragraph-regular background-light700_dark300 text-dark300_light700 min-h-[56px] border focus-visible:ring-0 focus-visible:ring-offset-0 dark:caret-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel className="paragraph-semibold text-dark100_light900 ">
                Location
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Where do you live?"
                  {...field}
                  className="no-focus light-border-2 paragraph-regular background-light700_dark300 text-dark300_light700 min-h-[56px] border focus-visible:ring-0 focus-visible:ring-offset-0 dark:caret-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel className="paragraph-semibold text-dark100_light900 ">
                Bio <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="What's special about you?"
                  {...field}
                  required
                  className="no-focus light-border-2 paragraph-regular background-light700_dark300 text-dark300_light700 min-h-[56px] border focus-visible:ring-0 focus-visible:ring-offset-0 dark:caret-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end ">
          <Button
            type="submit"
            className="primary-gradient w-fit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProfileForm;
