"use client";
import React, { useRef, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AnswerSchema } from "@/lib/formValidations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Editor } from "@tinymce/tinymce-react";
import useCustomTheme from "@/context/ThemeProvider";
import { Button } from "../ui/button";
import Image from "next/image";
import { createAnswer } from "@/lib/actions/answer.action";
import { usePathname } from "next/navigation";

interface Props {
  question: string;
  questionId: string;
  authorId: string;
}

const AnswerForm = (params: Props) => {
  const pathname = usePathname();
  const editorRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAiSubmitting, setIsAiSubmitting] = useState(false);
  const { mode } = useCustomTheme();

  const { questionId, authorId, question } = params;

  const form = useForm<z.infer<typeof AnswerSchema>>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      answer: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof AnswerSchema>) => {
    setIsSubmitting(true);
    try {
      await createAnswer({
        question: JSON.parse(questionId),
        path: pathname,
        author: JSON.parse(authorId),
        content: values.answer,
      });

      form.reset();

      if (editorRef.current) {
        const editor = editorRef.current as any;

        editor.setContent("");
      }
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateAiAnswer = async () => {
    if (!authorId) return;
    setIsAiSubmitting(true);
    try {
      const URL = `${process.env.NEXT_PUBLIC_HOST_URL}/api/chatgpt`;

      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }), // Ensure 'question' is an object with the correct structure
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const { answer } = await response.json();
      // const formattedAnswer = answer.replace(/\n/g, "<br/>");

      if (editorRef.current) {
        const editor = editorRef.current as any;

        editor.setContent(answer);
      }
    } catch (error) {
      console.error("AI Answer Generation Error", error);
    } finally {
      setIsAiSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mt-9 flex justify-between">
        <h4 className="paragraph-semibold text-dark400_light800">
          Write Your Answer here!
        </h4>
        <Button
          className="light-border-2 btn flex gap-2 px-4 py-2.5"
          onClick={handleCreateAiAnswer}
        >
          {isAiSubmitting ? (
            <>
              <p className="text-primary-500">Generating...</p>
            </>
          ) : (
            <>
              <Image
                src="/assets/icons/stars.svg"
                alt="Stars"
                width={15}
                height={15}
              />
              <p className="text-primary-500">Generate Ai Answer</p>
            </>
          )}
        </Button>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <FormItem className="my-4">
                <FormControl>
                  <Editor
                    key={mode}
                    apiKey={process.env.NEXT_PUBLIC_TINY_API_KEY}
                    // @ts-ignore
                    onInit={(_evt, editor) => (editorRef.current = editor)}
                    onBlur={() => {
                      field.onBlur(); // Trigger react-hook-form's onBlur
                      form.trigger("answer"); // Manually trigger validation
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
                        font-size:16px;                        
                        color: ${mode === "dark" || mode === "system" ? "white" : "black"};
                        caret-color: ${mode === "dark" || mode === "system" ? "white" : "black"};
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
                <FormMessage className="body-regular text-red-500" />
              </FormItem>
            )}
          />
          <div className=" flex cursor-pointer justify-end">
            <Button
              className="primary-gradient w-fit text-white"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Submitting..." : "Submit Answer"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AnswerForm;
