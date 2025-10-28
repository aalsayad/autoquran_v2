"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FiChevronDown, FiUser, FiSettings, FiLogOut } from "react-icons/fi";

// Shared class names for consistency
const DROPDOWN_ITEM_BASE =
  "w-full flex items-center gap-2 px-3 py-1.5 text-sm rounded-[4px] cursor-pointer";

export function UserDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative hidden md:block w-full">
      <button
        className="w-full flex items-center justify-between gap-2 px-3 py-2 text-sm border border-border rounded-md transition-colors hover:bg-accent cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <span>ahmednalsayad@gmail.com</span>
        <FiChevronDown className="h-3.5 w-3.5 opacity-50" />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <>
          <div className="fixed inset-0 " onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-full bg-popover text-popover-foreground rounded-md border shadow-md">
            <div className="p-2">
              <Link
                href="/profile"
                className={`${DROPDOWN_ITEM_BASE} hover:bg-accent transition-colors text-left`}
                onClick={() => setOpen(false)}
              >
                <FiUser className="h-3.5 w-3.5" />
                <span>Profile</span>
              </Link>
              <Link
                href="/settings"
                className={`${DROPDOWN_ITEM_BASE} mt-1 hover:bg-accent transition-colors text-left`}
                onClick={() => setOpen(false)}
              >
                <FiSettings className="h-3.5 w-3.5" />
                <span>Settings</span>
              </Link>

              {/* Separator */}
              <div className="h-px bg-border my-2" />

              <button
                className={`${DROPDOWN_ITEM_BASE} hover:bg-accent transition-colors text-left text-destructive`}
                onClick={() => setOpen(false)}
              >
                <FiLogOut className="h-3.5 w-3.5" />
                <span>Log out</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
