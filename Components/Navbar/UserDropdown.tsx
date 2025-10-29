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
import { ACCOUNT_LINKS } from "./links";

export function UserDropdown({ email }: { email: string }) {
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
            <span className="truncate">{email}</span>
            <FiChevronDown className="h-3.5 w-3.5 opacity-50 transition-transform duration-150 group-data-[open=true]:rotate-180" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-64"
          style={{ zIndex: 99999 }}
        >
          {ACCOUNT_LINKS.length > 0 && (
            <>
              {ACCOUNT_LINKS.map((l) => (
                <DropdownMenuItem
                  key={l.href}
                  asChild
                  className="flex items-center gap-2"
                >
                  <Link href={l.href} className="flex items-center gap-2">
                    {l.label === "Profile" ? (
                      <FiUser className="h-3.5 w-3.5" />
                    ) : (
                      <FiSettings className="h-3.5 w-3.5" />
                    )}
                    <span>{l.label}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem
            onSelect={() => toggleTheme()}
            className="flex items-center gap-2"
          >
            <ThemeIcon className="h-3.5 w-3.5" />
            <span>{nextTheme === "dark" ? "Dark Mode" : "Light Mode"}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex items-center gap-2 focus:text-destructive"
            asChild
          >
            <button
              className="flex items-center gap-2 w-full text-left"
              onClick={async () => {
                const { createClient } = await import(
                  "@/utils/supabase/client"
                );
                const supabase = createClient();
                await supabase.auth.signOut();
                window.location.replace("/login");
              }}
            >
              <FiLogOut className="h-3.5 w-3.5 focus:text-destructive" />
              <span>Log out</span>
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
