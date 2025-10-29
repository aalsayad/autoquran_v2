"use client";

import React from "react";
import Link from "next/link";
import {
  FiChevronDown,
  FiUser,
  FiSettings,
  FiLogOut,
  FiSun,
  FiMoon,
} from "react-icons/fi";
import { useTheme } from "@/Components/ThemeProvider";
import { Button } from "@/Components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";

export function UserDropdown() {
  const { theme, toggleTheme } = useTheme();

  const nextTheme = theme === "dark" ? "light" : "dark";
  const ThemeIcon = theme === "dark" ? FiSun : FiMoon;

  return (
    <div className="hidden md:block w-full">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="group w-full justify-between gap-2 px-3 py-2 text-sm font-normal"
          >
            <span className="truncate">ahmednalsayad@gmail.com</span>
            <FiChevronDown className="h-3.5 w-3.5 opacity-50 transition-transform duration-150 group-data-[open=true]:rotate-180" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-64 bg-popover text-popover-foreground shadow-md z-1000"
        >
          <DropdownMenuLabel>Account</DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link href="/profile" className="flex items-center gap-2">
              <FiUser className="h-3.5 w-3.5" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings" className="flex items-center gap-2">
              <FiSettings className="h-3.5 w-3.5" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => toggleTheme()}
            className="flex items-center gap-2"
          >
            <ThemeIcon className="h-3.5 w-3.5" />
            <span>{nextTheme === "dark" ? "Dark Mode" : "Light Mode"}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex items-center gap-2 text-destructive focus:text-destructive">
            <FiLogOut className="h-3.5 w-3.5" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
