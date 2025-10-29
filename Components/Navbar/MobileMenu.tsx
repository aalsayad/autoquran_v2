"use client";

import React from "react";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/Components/ui/sheet";
import { Separator } from "@/Components/ui/separator";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

// Shared class names for consistency
const SECTION_HEADER_CLASSES =
  "text-[9px] uppercase tracking-wider text-muted-foreground/70 font-medium mb-3";
const MENU_ITEM_BASE =
  "w-full text-left text-sm py-1.5 rounded-md transition-colors flex items-center cursor-pointer";

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  return (
    <Sheet open={isOpen} onOpenChange={(o) => (o ? undefined : onClose())}>
      {/* We control open from parent; no trigger rendered here */}
      <SheetTrigger className="hidden" />
      <SheetContent side="top" className="p-0 md:hidden">
        <div className="border-b">
          <div className="max-w-[1150px] mx-auto px-4 py-6 space-y-10">
            {/* Links Section */}
            <div>
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

            <Separator />

            {/* Account Section */}
            <div>
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
      </SheetContent>
    </Sheet>
  );
}
