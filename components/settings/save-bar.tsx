"use client";

import { useSettingsSite } from "@/components/settings/settings-site-context";
import { Button } from "@/components/ui/button";

export function SaveBar() {
  const { hasChanges, isPending, save } = useSettingsSite();

  return (
    <div className="fixed inset-x-0 bottom-0 z-20 flex h-[4.25rem] items-center justify-between gap-4 border-t bg-background/95 px-4 backdrop-blur sm:px-6 lg:left-80 lg:px-8">
      <p className="text-sm text-muted-foreground">
        {hasChanges ? "Niet-opgeslagen wijzigingen" : "Alles is opgeslagen"}
      </p>
      <Button onClick={save} disabled={isPending || !hasChanges} size="lg">
        {isPending ? "Bezig met opslaan..." : "Opslaan"}
      </Button>
    </div>
  );
}
