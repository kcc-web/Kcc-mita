import * as React from "react";
import { Badge } from "@/components/ui/badge";

export function KccTag({ children }: { children: React.ReactNode }) {
  return (
    <Badge className="px-2.5 py-0.5 text-xs rounded-full bg-secondary text-secondary-foreground">
      {children}
    </Badge>
  );
}

