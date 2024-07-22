"use client";

import { usePathname } from "next/navigation";
import { ModeToggle } from "../ModeToggle";
import UserAvatar from "../card/UserAvatar";

interface Props {
  data: {
    name: string;
    email: string;
    image?: string;
    id: string;
  };
}

function Header({ data }: Props) {
  const pathname = usePathname();
  const pageName = pathname.split("/").join(" ");

  return (
    <div className="sticky top-6 z-50 hidden w-full items-center justify-between rounded-md border-2 bg-background p-4 shadow-md dark:bg-accent lg:flex">
      <h3 className="text-2xl font-bold capitalize">{pageName}</h3>
      <div className="flex items-center gap-2">
        <ModeToggle />
        <div>
          <UserAvatar data={data} />
        </div>
      </div>
    </div>
  );
}

export default Header;
