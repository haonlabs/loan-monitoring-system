"use client";

import * as React from "react";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";
import { DayPicker, type DayPickerProps } from "react-day-picker";
import { cn } from "@/lib/utils";

export function Calendar({ className, classNames, showOutsideDays = true, ...props }: DayPickerProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-1", className)}
      classNames={{
        months: "flex flex-col",
        month: "space-y-4",
        month_caption: "relative flex h-9 items-center justify-center",
        caption_label: "text-sm font-semibold capitalize",
        dropdowns: "flex items-center gap-2",
        dropdown_root: "relative inline-flex h-8 items-center gap-1 rounded-md border bg-background px-2 text-sm font-semibold shadow-sm transition-colors hover:bg-accent focus-within:ring-2 focus-within:ring-ring/20",
        dropdown: "absolute inset-0 z-10 cursor-pointer opacity-0",
        nav: "absolute inset-x-0 top-1 flex items-center justify-between",
        button_previous: "inline-flex h-8 w-8 items-center justify-center rounded-md border bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        button_next: "inline-flex h-8 w-8 items-center justify-center rounded-md border bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday: "w-9 rounded-md text-center text-[.72rem] font-medium text-muted-foreground",
        week: "mt-1 flex w-full",
        day: "relative h-9 w-9 p-0 text-center text-sm",
        day_button: "h-9 w-9 rounded-lg font-normal hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        selected: "rounded-lg bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
        today: "rounded-lg bg-accent font-bold text-accent-foreground",
        outside: "text-muted-foreground/40",
        disabled: "text-muted-foreground/30 opacity-50",
        hidden: "invisible",
        ...classNames
      }}
      components={{
        Chevron: ({ orientation }) => {
          if (orientation === "left") return <ChevronLeft className="h-4 w-4" />;
          if (orientation === "up") return <ChevronUp className="h-4 w-4" />;
          if (orientation === "down") return <ChevronDown className="h-4 w-4" />;
          return <ChevronRight className="h-4 w-4" />;
        }
      }}
      {...props}
    />
  );
}
