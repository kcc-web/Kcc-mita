import * as React from "react";
import { cn } from "@/lib/utils";

// モバイル2列、mdから3列
export function KccGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6", className)}>
      {children}
    </div>
  );
}


