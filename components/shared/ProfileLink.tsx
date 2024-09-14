import Image from "next/image";
import Link from "next/link";
import React from "react";

interface ProfileProps {
  title: string;
  href?: string;
  imgUrl: string;
}

const ProfileLink = (Props: ProfileProps) => {
  const { title, href, imgUrl } = Props;
  return (
    <div className="flex gap-1.5">
      <Image src={imgUrl} alt="Link" width={20} height={20} />
      {href ? (
        <Link
          href={href}
          target="_blank"
          className=" cursor-pointer text-blue-500"
        >
          {title}
        </Link>
      ) : (
        <p className="text-dark200_light800">{title}</p>
      )}
    </div>
  );
};

export default ProfileLink;
