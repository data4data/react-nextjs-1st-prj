"use client";

import { createContext, useContext } from "react";

import { useSaveSite } from "@/components/settings/use-save-site";
import type { Site } from "@/lib/cms/types";

type SettingsSiteValue = ReturnType<typeof useSaveSite>;

const SettingsSiteContext = createContext<SettingsSiteValue | null>(null);

/**
 * One site object for the sidebar and the form. Moving a section in the nav
 * then also moves it in the preview, and Opslaan writes that same object.
 */
export function SettingsSiteProvider({
  initialSite,
  children,
}: {
  initialSite: Site;
  children: React.ReactNode;
}) {
  const value = useSaveSite(initialSite);

  return (
    <SettingsSiteContext.Provider value={value}>{children}</SettingsSiteContext.Provider>
  );
}

export function useSettingsSite(): SettingsSiteValue {
  const value = useContext(SettingsSiteContext);

  if (!value) {
    throw new Error("useSettingsSite must be used inside SettingsSiteProvider");
  }

  return value;
}
