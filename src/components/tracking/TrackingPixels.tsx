"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { settingService } from "@/lib/api/settingService";
import { initTracking, trackPageView } from "@/lib/tracking";

/** Loads the Meta Pixel configured in the dashboard and reports page views. */
export function TrackingPixels() {
  const { data: settings, isFetched } = useQuery({
    queryKey: ["settings"],
    queryFn: settingService.getSettings,
  });

  useEffect(() => {
    // Initialise even when the request failed, so queued events don't wait forever
    if (!isFetched) return;
    initTracking({ facebookPixelId: settings?.facebook_pixel_id });
  }, [isFetched, settings?.facebook_pixel_id]);

  return (
    <Suspense fallback={null}>
      <PageViewTracker />
    </Suspense>
  );
}

function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();

  useEffect(() => {
    trackPageView();
  }, [pathname, query]);

  return null;
}
