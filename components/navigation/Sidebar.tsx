"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { SidebarLinks } from "../..";

import SignOutBtn from "../action/SignOutBtn";

function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="fixed hidden min-h-screen w-[200px] flex-col justify-between border bg-background shadow-md dark:bg-accent/60 lg:flex xl:w-[250px]">
      <div className="mx-4 flex flex-col gap-4">
        <Link
          href={"/"}
          className="p-4 text-center text-2xl font-bold italic text-main-cyan"
        >
          FinTrack
        </Link>
        <div className="space-y-2">
          <h5 className="text-xs font-semibold uppercase text-slate-500">
            Navigation
          </h5>
          <div className="flex flex-col gap-2">
            {SidebarLinks.map((link) => (
              <Link
                key={link.title}
                href={link.path}
                className={`flex items-center gap-2 rounded-md p-2 pl-4 text-sm font-semibold
                ${pathname === link.path && "text-green-500 shadow-[0px_0px_10px_2px_#00000024] transition-all duration-300 ease-in-out"}`}
              >
                {link.icon} {link.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <SignOutBtn />
    </nav>
  );
}

export default Sidebar;
