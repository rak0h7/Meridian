"use client";

import { cn } from "@/lib/utils";

export function TabNav({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("tab-nav-scroll -mx-1 overflow-x-auto px-1 pb-1", className)}>
      <div className="flex w-max min-w-full justify-start sm:mx-auto sm:w-auto sm:justify-center">
        {children}
      </div>
    </div>
  );
}