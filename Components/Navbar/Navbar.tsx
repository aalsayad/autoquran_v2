"use client";

import React, { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import Link from "next/link";
import { AuthMenu } from "./AuthMenu";
import { MobileMenu } from "./MobileMenu";
import { NAV_LINKS } from "./links";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="sticky top-0 w-full text-foreground bg-background border-b z-10000">
      {/* Main Navbar Top */}
      <div className="bg-background w-full h-16 mx-auto flex items-center justify-between max-w-[1150px] px-4 relative z-10000">
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
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Auth: shows Sign in when no user; dropdown when signed in */}
          <AuthMenu />
          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-accent transition-colors cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <FiX className="h-5 w-5" />
            ) : (
              <FiMenu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
      {/* Mobile Menu Sliding Menu */}
      <div className="relative z-9999">
        <MobileMenu
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />
      </div>
    </div>
  );
};

export default Navbar;
