"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { ModeToggle } from "../ModeToggle";
import Link from "next/link";

import UserAvatar from "../card/UserAvatar";
import SignOutBtn from "../action/SignOutBtn";

import { SidebarLinks } from "@/index";
import { HiBars3BottomLeft, HiXMark } from "react-icons/hi2";

function MobileNav() {
  const [openNav, setOpenNav] = useState(false);

  const { data: session } = useSession();
  const pathname = usePathname();

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) {
        setOpenNav(false);
      }
    }

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="sticky top-0 z-20">
      <div className="relative flex w-full items-center justify-between rounded-md border bg-background p-4 shadow-md lg:hidden">
        <div>
          <div
            onClick={() => {
              setOpenNav((prev) => !prev);
            }}
          >
            {openNav ? <HiXMark size={24} /> : <HiBars3BottomLeft size={24} />}
          </div>
          <div
            className={`absolute top-[70px] flex h-[92vh] w-full flex-col justify-between bg-background p-4 shadow-[0px_0px_10px_2px_#00000024] duration-200 dark:bg-background ${openNav ? "left-0" : "-left-[1000px]"}`}
          >
            <div className="flex flex-col gap-4">
              {SidebarLinks.map((link) => (
                <Link
                  key={link.title}
                  href={link.path}
                  className={`flex items-center gap-2 rounded-md text-xs font-semibold
                  ${pathname === link.path && "text-green-500 shadow-[0px_0px_10px_2px_#00000024] transition-all duration-300 ease-in-out"}`}
                  onClick={() => setOpenNav(false)}
                >
                  {link.icon} {link.title}
                </Link>
              ))}
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
              <UserAvatar data={session} />
              <SignOutBtn />
            </div>
          </div>
        </div>
        <Link
          href={"/"}
          className="text-center text-2xl font-bold italic text-main-cyan"
        >
          FinTrack
        </Link>
        <div>
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}

export default MobileNav;
