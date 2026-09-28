"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { saveSiteAction } from "@/app/actions/site";
import type { Site } from "@/lib/cms/types";

/**
 * One piece of site state and a save. Each settings page uses this so a change
 * is only written when Opslaan is pressed.
 */
export function useSaveSite(initialSite: Site) {
  const [site, setSite] = useState(initialSite);
  const [saved, setSaved] = useState(initialSite);
  const [isPending, startTransition] = useTransition();

  const hasChanges = JSON.stringify(site) !== JSON.stringify(saved);

  function save() {
    startTransition(async () => {
      const result = await saveSiteAction(site.slug, site);

      if (result.ok) {
        setSaved(site);
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  }

  return { site, setSite, hasChanges, isPending, save };
}
