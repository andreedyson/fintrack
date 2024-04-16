"use client";

import { signOut } from "next-auth/react";
import { HiArrowRightOnRectangle } from "react-icons/hi2";

function SignOutBtn() {
  const handleSignOut = () => {
    signOut({ redirect: true });
  };

  return (
    <div
      className="flex cursor-pointer items-center gap-2 rounded-md text-lg font-semibold text-red-500 md:mx-4 md:mb-4 md:px-2 md:py-3"
      onClick={handleSignOut}
    >
      <HiArrowRightOnRectangle size={24} /> Sign Out
    </div>
  );
}

export default SignOutBtn;
