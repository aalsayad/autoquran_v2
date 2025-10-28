"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FiChevronDown } from "react-icons/fi";

// Shared class names for consistency
const DROPDOWN_ITEM_BASE =
  "flex items-center px-3 py-2 text-sm rounded-sm transition-colors";
const DIVIDER_CLASSES = "h-px bg-border";

export function UserDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative hidden md:block">
      <button
        className="flex items-center gap-2 px-3 py-2 text-sm border border-border rounded-md transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span>ahmednalsayad@gmail.com</span>
        <FiChevronDown className="h-3.5 w-3.5 opacity-50" />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-56 bg-popover text-popover-foreground rounded-md border shadow-md z-40">
            <div className="px-3 py-2 text-sm font-semibold">My Account</div>
            <div className={DIVIDER_CLASSES} />
            <Link
              href="/profile"
              className={DROPDOWN_ITEM_BASE}
              onClick={() => setOpen(false)}
            >
              Profile
            </Link>
            <Link
              href="/settings"
              className={DROPDOWN_ITEM_BASE}
              onClick={() => setOpen(false)}
            >
              Settings
            </Link>
            <div className={DIVIDER_CLASSES} />
            <button
              className={`${DROPDOWN_ITEM_BASE} w-full text-destructive`}
              onClick={() => setOpen(false)}
            >
              Log out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
