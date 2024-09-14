import { getTopInteractedTags } from "@/lib/actions/tag.action";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Badge } from "../ui/badge";
import RenderTags from "../shared/RenderTags";

interface AllUserProps {
  user: {
    _id: string;
    clerkId: string;
    name: string;
    username: string;
    picture: string;
  };
}

const UserCard = async ({ user }: AllUserProps) => {
  const userTopInteractedCard = await getTopInteractedTags({
    userId: user._id,
  });

  return (
    <div className="shadow-light100_darknone background-light900_dark200 light-border flex-center light-border flex w-full flex-col rounded-xl border p-8 max-sm:min-w-full sm:w-[260px]">
      <Link href={`/profile/${user.clerkId}`}>
        <article className="flex-center flex flex-col">
          <Image
            src={user.picture}
            width={120}
            height={120}
            className="block rounded-full object-contain"
            alt="User"
          />
          <div className="mt-5 text-center">
            <h3 className="h3-bold text-dark100_light900 mt-2 line-clamp-1">
              {user.name}
            </h3>
            <p className="body-regular text-dark500_light500 mt-2">
              @{user.username}
            </p>
          </div>
        </article>
      </Link>
      <div className="mt-5">
        {userTopInteractedCard.length > 0 ? (
          <div className="flex items-center gap-2">
            {userTopInteractedCard.map((tag) => (
              <RenderTags key={tag._id} title={tag.name} _id={tag._id} />
            ))}
          </div>
        ) : (
          <Badge className="background-light800_dark300 subtle-medium text-light400_light500 mt-2 select-none gap-2 rounded-lg px-4 py-2 capitalize">
            No Tags Yet!
          </Badge>
        )}
      </div>
    </div>
  );
};

export default UserCard;
