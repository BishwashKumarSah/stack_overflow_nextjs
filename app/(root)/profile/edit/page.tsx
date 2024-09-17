import React from "react";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ProfileForm from "@/components/forms/ProfileForm";

const EditProfile = async () => {
  const { userId }: { userId: string | null } = auth();
  if (userId === null) {
    redirect("/sign-in");
  }
  const { user: mongoUser } = await getUserById({ userId });
 
  return (
    <div className="w-full ">
      <h1 className="h1-bold text-dark100_light900">Edit Profile</h1>
      <ProfileForm
        clerkId={JSON.stringify(userId)}
        userDetails={JSON.stringify(mongoUser)}
      />
    </div>
  );
};

export default EditProfile;
