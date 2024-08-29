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
    <div className="mt-10 w-full flex flex-col flex-center">
      <Image
        src="/assets/images/light-illustration.png"
        alt="No Result Illustration"
        width={270}
        height={200}
        className="dark:hidden block object-contain"
      />
      <Image
        src="/assets/images/dark-illustration.png"
        alt="No Result Illustration"
        width={270}
        height={200}
        className="hidden dark:flex object-contain"
      />
      <h2 className="my-2 h2-bold text-dark-100 dark:text-light-900">
        {title}
      </h2>
      <p className="body-medium my-2 max-w-md text-balance text-center text-dark-300 dark:text-light-700">
        {description} 💡
      </p>
      <Link href={link}>
        <Button className="paragraph-medium my-2 capitalize min-h-[46px] bg-primary-500 !text-light-900 py-6 px-4">
          {linkText}
        </Button>
      </Link>
    </div>
  );
};

export default NoResult;
