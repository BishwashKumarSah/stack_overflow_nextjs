/* eslint-disable camelcase */
"use client";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

interface JobLocationProps {
  location: string[];
}

const JobLocation = ({ location }: JobLocationProps) => {
  const searchParams = useSearchParams();
  const countryCode = searchParams.get("filter");
  let code;
  if (countryCode === null) {
    code = 'IN';
  } else {
    code = countryCode;
  }

  const reversedLocationString = location.reverse().join(", ");
  return (
    <div className="background-light800_dark400 flex items-center justify-end gap-2 rounded-2xl px-3 py-1.5">
      <Image
        src={`https://flagsapi.com/${code}/flat/64.png`}
        alt="country symbol"
        width={16}
        height={16}
        className="rounded-full"
      />
      <p className="body-medium text-dark400_light700">
        {reversedLocationString}
      </p>
    </div>
  );
};

interface JobDetailsProps {
  _id: string;
  companyName: string;
  title: string;
  type: string;
  description: string;
  location: string[];
  salary: string;
  createdAt: string;
  url: string;
}
const JobDetailsCard = ({
  companyName,
  url,
  title,
  type,
  description,
  location,
  salary,
}: JobDetailsProps) => {
  return (
    <section className="background-light900_dark200 light-border shadow-light100_darknone  flex flex-col items-start gap-6 rounded-lg border p-6 sm:flex-row sm:p-8">
      <div className="flex w-full justify-end sm:hidden">
        <JobLocation location={location} />
      </div>

      <div className="flex items-center gap-6">
        <Image
          src="/assets/images/site-logo.svg"
          alt="default site logo"
          width={64}
          height={64}
          className="rounded-[10px]"
        />
      </div>

      <div className="w-full">
        <div className="flex-between flex-wrap gap-2">
          <p className="base-semibold text-dark200_light900">{title}</p>
          <div className="hidden sm:flex">
            <JobLocation location={location} />
          </div>
        </div>

        <p className="body-regular text-dark500_light700 mt-2 line-clamp-2">
          {description}
        </p>

        <div className="flex-between mt-8 flex-wrap gap-6">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <Image
                src="/assets/icons/clock-2.svg"
                alt="clock"
                width={20}
                height={20}
              />
              <p className="body-medium text-light-500">{type}</p>
            </div>

            <div className="flex items-center gap-2">
              <Image
                src="/assets/icons/currency-dollar-circle.svg"
                alt="dollar symbol"
                width={20}
                height={20}
              />

              <p className="body-medium text-light-500">{salary}</p>
            </div>
            <div className="flex items-center gap-2">
              <Image
                src="/assets/icons/company.svg"
                alt="company symbol"
                width={20}
                height={20}
              />

              <p className="body-medium text-light-500">{companyName}</p>
            </div>
          </div>
          <Link
            href={url ?? "/jobs"}
            target="_blank"
            className="flex items-center gap-2"
          >
            <p className="body-semibold primary-text-gradient">View job</p>

            <Image
              src="/assets/icons/arrow-up-right.svg"
              alt="arrow up right"
              width={20}
              height={20}
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default JobDetailsCard;
