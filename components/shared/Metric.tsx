
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface MetricProps {
  imgUrl: string;
  alt: string;
  title: string;
  value: string | number;
  otherClasses?: string;
  isAuthor?: boolean;
  href?: string;
}

const Metric = ({
  imgUrl,
  href,
  title,
  value,
  otherClasses,
  isAuthor,
  alt,
}: MetricProps) => {
  const MetricContent = () => {
    const displayValue = value;
 
    return (
      <>
        <Image
          src={imgUrl}
          width={16}
          height={16}
          alt={alt}
          className={`${href ? "block rounded-full object-contain" : "invert-colors "}`}
        />
        <p className={`${otherClasses} flex items-center gap-1`}>
          {isAuthor ? value : displayValue}
          <span
            className={`small-regular line-clamp-1 ${isAuthor ? "max-sm:hidden" : ""} `}
          >
            {title}
          </span>
        </p>
      </>
    );
  };
  if (href) {
    return (
      <Link href={href} className="flex-center gap-2">
        <MetricContent />
      </Link>
    );
  }

  return (
    <div className="flex-center gap-1.5">
      <MetricContent />
    </div>
  );
};

export default Metric;
