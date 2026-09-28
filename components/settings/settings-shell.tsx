"use client";

import { SaveBar } from "@/components/settings/save-bar";
import { SettingsNav } from "@/components/settings/settings-nav";
import { SettingsSiteProvider } from "@/components/settings/settings-site-context";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { Site } from "@/lib/cms/types";

function NavBottom({ userEmail }: { userEmail?: string }) {
  if (!userEmail) return null;

  return (
    <p className="mt-auto border-t pt-4 text-xs text-muted-foreground">
      Ingelogd als
      <span className="mt-1 block truncate font-medium text-foreground">{userEmail}</span>
    </p>
  );
}

export function SettingsShell({
  site,
  userEmail,
  children,
}: {
  site: Site;
  userEmail?: string;
  children: React.ReactNode;
}) {
  return (
    <SettingsSiteProvider initialSite={site}>
      <TooltipProvider delay={400}>
        <div className="flex min-h-0 flex-1 flex-col bg-muted/40 lg:flex-row">
          <aside className="border-b bg-background lg:sticky lg:top-[4.25rem] lg:flex lg:h-[calc(100dvh-4.25rem)] lg:w-80 lg:shrink-0 lg:flex-col lg:border-r lg:border-b-0">
            <div className="flex min-h-0 flex-1 flex-col p-4 lg:overflow-y-auto">
              <SettingsNav />
              <NavBottom userEmail={userEmail} />
            </div>
          </aside>
          <div className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</div>
        </div>
        <SaveBar />
      </TooltipProvider>
    </SettingsSiteProvider>
  );
}
