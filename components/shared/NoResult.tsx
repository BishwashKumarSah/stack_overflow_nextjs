import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";

interface NoResultProps {
  title: string;
  description: string;
  link: string;
  linkText: string;
}

const NoResult = ({ title, description, link, linkText }: NoResultProps) => {
  return (
    <div className="flex-center mt-10 flex w-full flex-col">
      <Image
        src="/assets/images/light-illustration.png"
        alt="No Result Illustration"
        width={270}
        height={200}
        className="block object-contain dark:hidden"
      />
      <Image
        src="/assets/images/dark-illustration.png"
        alt="No Result Illustration"
        width={270}
        height={200}
        className="hidden object-contain dark:flex"
      />
      <h2 className="h2-bold my-2 text-dark-100 dark:text-light-900">
        {title}
      </h2>
      <p className="body-medium my-2 max-w-md text-balance text-center text-dark-300 dark:text-light-700">
        {description} 💡
      </p>
      <Link href={link}>
        <Button className="paragraph-medium my-2 min-h-[46px] bg-primary-500 px-4 py-6 capitalize !text-light-900">
          {linkText}
        </Button>
      </Link>
    </div>
  );
};

export default NoResult;
