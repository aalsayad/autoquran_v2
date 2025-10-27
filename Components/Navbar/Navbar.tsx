import React from "react";
import { FiChevronDown, FiSearch } from "react-icons/fi";
import Link from "next/link";

const Navbar = ({ bottomNavbar }: { bottomNavbar?: React.ReactNode }) => {
  return (
    <div className="bg-background/90 backdrop-blur-sm text-foreground h-17 border-b border-foreground/15 sticky top-0 z-50">
      <div className=" w-full h-full max-w-[1150px] mx-auto flex items-center justify-between">
        {/* Left side - Logo + Navlinks */}
        <div className="flex items-center gap-12">
          <span className="text-lg font-semibold">AutoQuran</span>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/recitations">Recitations</Link>
            <Link href="/mushaf">Mus'haf</Link>
          </div>
        </div>
        {/* Right side of Navbar - User */}
        <div className="text-sm p-2 pl-4 rounded-lg border border-foreground/15 flex items-center gap-1 hover:bg-foreground/5 cursor-pointer">
          ahmednalsayad@gmail.com
          <FiChevronDown className="size-3.5 opacity-50" />
        </div>
      </div>
      {bottomNavbar}
    </div>
  );
};

export default Navbar;
