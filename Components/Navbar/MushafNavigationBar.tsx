"use client";

import React from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiMoreVertical,
  FiBook,
  FiList,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { Button } from "@/Components/ui/button";
import { Separator } from "@/Components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/Components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { NavigateDialog } from "@/Components/Quran/NavigateDialog";

export type ViewMode = "page" | "list";

interface MushafNavigationBarProps {
  currentChapter: number;
  currentPage?: number;
  chapterNameArabic?: string;
  chapterNameEnglish?: string;
  viewMode?: ViewMode;
  showTranslation?: boolean;
  onNext?: () => void;
  onPrevious?: () => void;
  onViewChange?: (mode: ViewMode) => void;
  onToggleTranslation?: () => void;
}

// Shared class names for consistency
const CHAPTER_INFO = `flex items-center gap-1 text-sm font-medium px-3 py-1 border border-border rounded-sm transition-colors hover:bg-accent whitespace-nowrap cursor-pointer`;
const MUTED_TEXT = "text-muted-foreground";
const DROPDOWN_ITEM_BASE =
  "w-full flex items-center gap-2 px-3 py-1.5 text-sm rounded-[4px] cursor-pointer";

export function MushafNavigationBar({
  currentChapter,
  currentPage,
  chapterNameArabic,
  chapterNameEnglish,
  viewMode = "page",
  showTranslation = false,
  onNext,
  onPrevious,
  onViewChange,
  onToggleTranslation,
}: MushafNavigationBarProps) {
  return (
    <div className="border-t bg-background relative z-1">
      <div className="max-w-[1150px] mx-auto px-4 py-2.5 flex items-center justify-center relative">
        {/* Navigation buttons centered together */}
        <TooltipProvider>
          <div className="flex items-center gap-2">
            {/* Next Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onNext}
                  disabled={currentChapter >= 114}
                  className="px-2 py-1 self-stretch aspect-square"
                  aria-label="Next chapter"
                >
                  <FiChevronLeft className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-foreground text-background border-foreground/20">
                Next chapter
              </TooltipContent>
            </Tooltip>

            {/* Center - Chapter Info doubles as Navigate dialog trigger */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <NavigateDialog
                    trigger={
                      <button type="button" className={CHAPTER_INFO}>
                        <span>
                          {chapterNameArabic || `Chapter ${currentChapter}`}
                        </span>
                        <span className={MUTED_TEXT}>•</span>
                        <span className={MUTED_TEXT}>{chapterNameEnglish}</span>
                      </button>
                    }
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-foreground text-background border-foreground/20">
                Navigate Quran
              </TooltipContent>
            </Tooltip>

            {/* Previous Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onPrevious}
                  disabled={currentChapter <= 1}
                  className="px-2 py-1 self-stretch aspect-square"
                  aria-label="Previous chapter"
                >
                  <FiChevronRight className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-foreground text-background border-foreground/20">
                Previous chapter
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>

        {/* Menu Icon - Right aligned with email dropdown above */}
        <div className="absolute right-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="px-1.5 py-1 self-stretch aspect-square"
                aria-label="More options"
              >
                <FiMoreVertical className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 p-2 z-1000">
              <DropdownMenuItem
                className={`${DROPDOWN_ITEM_BASE} ${
                  viewMode === "page" ? "bg-accent" : ""
                }`}
                onClick={() => onViewChange?.("page")}
              >
                <FiBook className="h-3.5 w-3.5" />
                <span>Page View</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className={`${DROPDOWN_ITEM_BASE} mt-1 ${
                  viewMode === "list" ? "bg-accent" : ""
                }`}
                onClick={() => onViewChange?.("list")}
              >
                <FiList className="h-3.5 w-3.5" />
                <span>List View</span>
              </DropdownMenuItem>

              {viewMode === "list" && (
                <>
                  <Separator className="my-2" />
                  <DropdownMenuItem
                    className={`${DROPDOWN_ITEM_BASE}`}
                    onClick={() => onToggleTranslation?.()}
                  >
                    {showTranslation ? (
                      <>
                        <FiEyeOff className="h-3.5 w-3.5" />
                        <span>Hide Translation</span>
                      </>
                    ) : (
                      <>
                        <FiEye className="h-3.5 w-3.5" />
                        <span>Show Translation</span>
                      </>
                    )}
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
