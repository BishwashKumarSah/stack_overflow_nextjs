"use client";

import React, { useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Editor } from "@tinymce/tinymce-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { QuestionsSchema } from "@/lib/formValidations";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { createQuestion } from "@/lib/actions/question.action";
import useCustomTheme from "@/context/ThemeProvider";

interface Props {
  mongoUserId: string;
}

const QuestionsForm = ({ mongoUserId }: Props) => {
  const editorRef = useRef(null);

  const type: any = "Create";
  const { mode } = useCustomTheme();

  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
 

  const handleRemoveBadge = (tag: string, field: any) => {
    // const badgeValue = e.currentTarget.getAttribute("data-tag");
    // e.preventDefault();

    // !Dont mutate the state directly
    /*    
    form.setValue(
      "tags",
      field.value.filter((t: string) => t !== tag)
    ); 
    */

    const newTags = field.value.filter((t: string) => t !== tag);
    form.setValue("tags", newTags);
  };

  const handleEnterKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: any
  ) => {
    if (e.key === "Enter" && field.name === "tags") {
      e.preventDefault();
      // const tagInput = e.target as HTMLInputElement;
      // const tagValue = tagInput.value
      const tagValue = e.currentTarget.value.trim();

      if (tagValue !== "") {
        if (field.value.length > 5) {
          return form.setError("tags", {
            type: "required",
            message: "You cannot add more than 6 tags",
          });
        }
        if (tagValue.length > 15 || tagValue.length < 2) {
          return form.setError("tags", {
            type: "required",
            message:
              "Tag must be greater than 3 character and less than 15 characters",
          });
        }
        if (!field.value.includes(tagValue as never)) {
          form.setValue("tags", [...field.value, tagValue]);
          e.currentTarget.value = "";
          form.clearErrors("tags");
        } else {
          return form.setError("tags", {
            type: "required",
            message: "Tag already present",
          });
        }
      } else {
        form.trigger();
      }
    }
  };

  // 1. Define your form.
  const form = useForm<z.infer<typeof QuestionsSchema>>({
    resolver: zodResolver(QuestionsSchema),
    defaultValues: {
      title: "",
      description: "",
      tags: [],
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof QuestionsSchema>) {
    setSubmitting(true);
    try {
      // Make api call
      await createQuestion({
        title: values.title,
        description: values.description,
        tags: values.tags,
        author: JSON.parse(mongoUserId),
        path: pathname,
      });

      router.push("/");
    } catch (error) {
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="my-4">
              <FormLabel className="paragraph-semibold text-dark100_light900 ">
                Question Title <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Title"
                  className="paragraph-medium placeholder background-light800_dark400 text-dark100_light900 no-focus min-h-[56px] border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 dark:caret-white"
                  {...field}
                />
              </FormControl>
              <FormDescription className="body-regular pt-2 text-light-500">
                Be Specific and imaging you&apos;re asking a question to another
                person.
              </FormDescription>
              <FormMessage className="body-regular text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="my-4">
              <FormLabel className="paragraph-semibold text-dark100_light900 background-light800_dark400">
                Detailed explanation of your problem?
                <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Editor
                  key={mode}
                  apiKey={process.env.NEXT_PUBLIC_TINY_API_KEY}
                  // @ts-ignore
                  onInit={(_evt, editor) => (editorRef.current = editor)}
                  initialValue=""
                  onBlur={() => {
                    field.onBlur(); // Trigger react-hook-form's onBlur
                    form.trigger("description"); // Manually trigger validation
                  }}
                  onEditorChange={(content) => field.onChange(content)}
                  init={{
                    height: 300,
                    menubar: false,
                    plugins: [
                      "advlist",
                      "autolink",
                      "lists",
                      "link",
                      "image",
                      "charmap",
                      "preview",
                      "importcss",
                      "anchor",
                      "searchreplace",
                      "visualblocks",
                      "fullscreen",
                      "insertdatetime",
                      "media",
                      "table",
                      "codesample",
                    ],
                    toolbar:
                      "undo redo | blocks | " +
                      "codesample bold italic forecolor | alignleft aligncenter " +
                      "alignright alignjustify | bullist numlist outdent indent | ",
                    content_style: `
                      body { 
                        font-family:Inter,Arial,sans-serif; 
                        font-size:18px;                        
                        color: black;
                      }                      
                    `,
                    skin:
                      mode === "dark" || mode === "system"
                        ? "oxide-dark"
                        : "oxide",
                    content_css:
                      mode === "dark" || mode === "system" ? "dark" : "light",
                  }}
                />
              </FormControl>
              <FormDescription className="body-regular pt-2 text-light-500">
                Provide a detailed explanation to your problem. Minimum 20
                characters.
              </FormDescription>
              <FormMessage className="body-regular text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="my-4">
              <FormLabel className="paragraph-semibold text-dark100_light900 ">
                Tags <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <>
                  <Input
                    placeholder="Add tags..."
                    className="paragraph-medium placeholder background-light800_dark400 text-dark100_light900 no-focus min-h-[56px] border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 dark:caret-white"
                    onKeyDown={(e) => handleEnterKeyDown(e, field)}
                  />
                  {field.value.length > 0 && (
                    <div className="mb-9 flex  flex-wrap items-center gap-2">
                      {field.value.map((value) => (
                        <Badge
                          key={value}
                          title={value}
                          className="background-light800_dark300 subtle-medium text-light400_light500 mt-1.5 select-none gap-2 rounded-lg px-4 py-2 capitalize"
                        >
                          {value}
                          <Image
                            src="/assets/icons/close.svg"
                            alt="close"
                            width={12}
                            height={12}
                            data-tag={value}
                            className="invert-colors cursor-pointer"
                            onClick={(e) => handleRemoveBadge(value, field)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </>
              </FormControl>
              <FormDescription className="body-regular pt-2 text-light-500">
                Add tags related to your problem. You need to press Enter to add
                a tag.
              </FormDescription>
              <FormMessage className="body-regular mb-5 text-red-500" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="primary-gradient w-fit !text-light-900"
        >
          {submitting ? (
            <>{type === "Create" ? "Posting..." : "Editing..."}</>
          ) : (
            <>{type === "Create" ? "Ask a Question" : "Edit Question"}</>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default QuestionsForm;
