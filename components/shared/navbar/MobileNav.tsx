"use client";
import React from "react";
import { SignInButton, SignUpButton, SignedOut } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import Link from "next/link";
import { sidebarLinks } from "@/constants";

export const NavContent = () => {
  const pathName = usePathname();

  return (
    <section className="mt-5 flex flex-1 flex-col gap-3">
      {sidebarLinks.map((item) => {
        const isActive =         
          pathName === item.route;
        return (
          <SheetClose asChild key={item.label}>
            <Link
              href={item.route}
              className={`flex items-center gap-6 rounded-xl px-3 py-5 ${isActive ? "bg-primary-500" : ""}`}
            >
              <Image
                src={item.imgURL}
                alt={item.label}
                width={20}
                height={20}
                className="invert-colors"
              />
              <p
                className={`dark:text-light-900 ${isActive ? "base-bold" : "base-medium"}`}
              >
                {item.label}
              </p>
            </Link>
          </SheetClose>
        );
      })}
    </section>
  );
};

const MobileNav = () => {
  return (
    <Sheet>
      <SheetTrigger>
        <Image
          src="/assets/icons/hamburger.svg"
          alt="Menu"
          height={34}
          width={34}
          className="invert-colors sm:hidden"
        />
      </SheetTrigger>
      <SheetContent
        side={"left"}
        className="background-light900_dark200 flex flex-col border-none overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle>
            <Link href="/" className="flex items-center gap-1">
              <Image
                src="/assets/images/site-logo.svg"
                alt="StackOverflow"
                height={23}
                width={23}
              />
              <p className="h2-bold font-spaceGrotesk text-dark-100 dark:text-light-900">
                Stack <span className="text-primary-500">Overflow</span>
              </p>
            </Link>
          </SheetTitle>
        </SheetHeader>
        <SheetClose asChild>
          <NavContent />
        </SheetClose>
        <SheetFooter>
          <SignedOut>
            <div className="flex flex-col gap-3">
              <SheetClose asChild>
                <div className="btn-secondary  min-h-[41px] w-full rounded-lg px-4 text-center flex flex-center text-primary-500 shadow-none">
                  <SignInButton>
                    <button>Sign in </button>
                  </SignInButton>
                </div>
              </SheetClose>
              <SheetClose asChild>
                <div className=" background-light850_dark100 min-h-[41px] mb-2 btn-tertiary flex flex-center w-full rounded-lg px-4 text-center dark:text-light-900">
                  <SignUpButton>
                    <button>Sign up </button>
                  </SignUpButton>
                </div>
              </SheetClose>
            </div>
          </SignedOut>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
