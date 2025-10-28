"use client";

import React from "react";
import Link from "next/link";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

// Shared class names for consistency
const SECTION_HEADER_CLASSES =
  "text-[9px] uppercase tracking-wider text-muted-foreground/70 font-medium mb-3";
const MENU_ITEM_BASE =
  "w-full text-left text-sm py-1.5 rounded-md transition-colors flex items-center";

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  return (
    <>
      {/* Sliding Menu */}
      <div
        className={`fixed top-16 left-0 right-0 z-60 md:hidden transition-transform duration-300 ease-out ${
          isOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="bg-background border-b">
          <div className="max-w-[1150px] mx-auto px-4 py-6 space-y-10">
            {/* Links Section */}
            <div className="">
              <p className={SECTION_HEADER_CLASSES}>links</p>
              <div className="flex flex-col gap-2">
                <Link
                  href="/recitations"
                  className={MENU_ITEM_BASE}
                  onClick={onClose}
                >
                  Recitations
                </Link>
                <Link
                  href="/mushaf"
                  className={MENU_ITEM_BASE}
                  onClick={onClose}
                >
                  Mus'haf
                </Link>
              </div>
            </div>

            {/* Account Section */}
            <div className="">
              <p className={SECTION_HEADER_CLASSES}>account</p>
              <div className="flex flex-col gap-2">
                <Link
                  href="/profile"
                  className={MENU_ITEM_BASE}
                  onClick={onClose}
                >
                  Profile
                </Link>
                <Link
                  href="/settings"
                  className={MENU_ITEM_BASE}
                  onClick={onClose}
                >
                  Settings
                </Link>
                <button
                  className={`${MENU_ITEM_BASE} text-destructive`}
                  onClick={onClose}
                >
                  Log out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-55 md:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
}
