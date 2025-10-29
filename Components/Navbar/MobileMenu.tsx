"use client";

import React from "react";
import Link from "next/link";
import { Separator } from "@/Components/ui/separator";
import { useTheme } from "@/Components/ThemeProvider";
import { FiMoon, FiSun, FiUser, FiSettings, FiLogOut } from "react-icons/fi";
import { NAV_LINKS, ACCOUNT_LINKS } from "./links";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

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
  const { theme, toggleTheme } = useTheme();
  const [email, setEmail] = React.useState<string | null>(null);

  React.useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });
  }, []);
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="md:hidden">
          {/* Backdrop below top navbar (64px) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="fixed top-16 left-0 right-0 bottom-0 bg-black/40 z-9998"
            onClick={onClose}
          />
          {/* Panel */}
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="fixed top-16 left-0 right-0 z-9999"
          >
            <div className="bg-background border-b shadow-sm max-h-[calc(100vh-64px)] overflow-y-auto">
              <div className="max-w-[1150px] mx-auto px-4 py-6 space-y-10">
                {/* Links Section */}
                <div>
                  <p className={SECTION_HEADER_CLASSES}>links</p>
                  <div className="flex flex-col gap-2">
                    {NAV_LINKS.map((l) => (
                      <Link
                        key={l.href}
                        href={l.href}
                        className={MENU_ITEM_BASE}
                        onClick={onClose}
                      >
                        {l.label}
                      </Link>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Account Section */}
                <div>
                  <p className={SECTION_HEADER_CLASSES}>
                    {email ?? "settings"}
                  </p>
                  <div className="flex flex-col gap-2">
                    {ACCOUNT_LINKS.map((l) => (
                      <Link
                        key={l.href}
                        href={l.href}
                        className={`${MENU_ITEM_BASE} gap-2`}
                        onClick={onClose}
                      >
                        {l.label === "Profile" ? (
                          <FiUser className="h-4 w-4" />
                        ) : (
                          <FiSettings className="h-4 w-4" />
                        )}
                        <span>{l.label}</span>
                      </Link>
                    ))}
                    <button
                      className={`${MENU_ITEM_BASE} flex items-center gap-2`}
                      onClick={() => {
                        toggleTheme();
                      }}
                    >
                      {theme === "dark" ? (
                        <>
                          <FiSun className="h-4 w-4" />
                          <span>Light mode</span>
                        </>
                      ) : (
                        <>
                          <FiMoon className="h-4 w-4" />
                          <span>Dark mode</span>
                        </>
                      )}
                    </button>
                    {email && (
                      <button
                        className={`${MENU_ITEM_BASE} gap-2 text-destructive`}
                        onClick={async () => {
                          const supabase = createClient();
                          await supabase.auth.signOut();
                          onClose();
                          window.location.replace("/login");
                        }}
                      >
                        <FiLogOut className="h-4 w-4" />
                        <span>Log out</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
