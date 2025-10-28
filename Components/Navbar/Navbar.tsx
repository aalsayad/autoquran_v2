"use client";

import React, { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import Link from "next/link";
import { UserDropdown } from "./UserDropdown";
import { MobileMenu } from "./MobileMenu";

const Navbar = ({ bottomNavbar }: { bottomNavbar?: React.ReactNode }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <div className="bg-background text-foreground border-b sticky top-0 z-50">
        <div className="w-full h-16 max-w-[1150px] mx-auto flex items-center justify-between px-4">
          {/* Left side - Logo + Navlinks */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="text-lg font-semibold hover:opacity-80 transition-opacity"
            >
              AutoQuran
            </Link>

            {/* Desktop Navigation - Hidden on mobile */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/recitations"
                className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Recitations
              </Link>
              <Link
                href="/mushaf"
                className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Mus'haf
              </Link>
            </nav>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 rounded-md hover:bg-accent transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <FiX className="h-5 w-5" />
              ) : (
                <FiMenu className="h-5 w-5" />
              )}
            </button>

            {/* Desktop User Dropdown */}
            <UserDropdown />
          </div>
        </div>

        {bottomNavbar}
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
};

export default Navbar;
