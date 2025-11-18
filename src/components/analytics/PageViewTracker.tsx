// src/components/analytics/PageViewTracker.tsx
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function PageViewTracker() {
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    // ページビューを記録
    const trackPageView = async () => {
      try {
        await supabase.from("page_views").insert({
          page_path: pathname,
          referrer: document.referrer || null,
          user_agent: navigator.userAgent,
        });
      } catch (error) {
        console.error("Failed to track page view:", error);
      }
    };

    trackPageView();
  }, [pathname, supabase]);

  return null; // UIを持たない
}