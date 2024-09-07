"use client";
import { sidebarLinks } from "@/constants";
import { SignedOut, SignInButton, SignUpButton, useAuth } from "@clerk/nextjs";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const LeftSideBar = () => {
  const auth = useAuth();
  const pathName = usePathname();

  return (
    <section className="background-light900_dark200 light-border sticky left-0  top-0 flex h-screen flex-col justify-between border-r px-6 pb-9 pt-32 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[266px]">
      <div className="flex flex-1 flex-col justify-between">
        {sidebarLinks.map((item) => {
          const isActive = pathName === item.route;
          if (!auth.userId && item.route === "/profile") {
            return;
          }
          if (item.route === "/profile") {
            if (auth.userId) {
              item.route = `/profile/${auth.userId}`;
            } else {
              return null;
            }
          }
          return (
            <Link
              key={item.route}
              href={item.route}
              className={`flex items-center gap-6 rounded-xl px-4 py-5 ${isActive ? "bg-primary-500" : ""}`}
            >
              <Image
                src={item.imgURL}
                alt={item.label}
                width={20}
                height={20}
                className="invert-colors"
              />
              <p
                className={`dark:text-light-900 ${isActive ? "base-bold" : "base-medium"} max-md:hidden`}
              >
                {item.label}
              </p>
            </Link>
          );
        })}
      </div>
      <SignedOut>
        <div className="flex flex-col gap-3">
          <SignInButton>
            <div className="btn-secondary cursor-pointer  flex-center flex min-h-[41px] w-full rounded-lg px-4 text-center text-primary-500 shadow-none">
              <Image
                src="/assets/icons/account.svg"
                alt="SignUp"
                width={20}
                height={20}
                className="invert-colors md:hidden"
              />

              <button className="max-md:hidden">Sign in</button>
            </div>
          </SignInButton>

          <SignUpButton>
            <div className=" background-light850_dark100 cursor-pointer btn-tertiary flex-center mb-8 flex min-h-[41px] w-full rounded-lg px-4 dark:text-light-900">
              <Image
                src="/assets/icons/sign-up.svg"
                alt="SignUp"
                width={20}
                height={20}
                className="invert-colors md:hidden"
              />

              <button className="max-md:hidden">Sign Up</button>
            </div>
          </SignUpButton>
        </div>
      </SignedOut>
    </section>
  );
};

export default LeftSideBar;
