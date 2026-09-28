"use client";

import { Button } from "@/components/ui/button";

export function SaveBar({
  hasChanges,
  isPending,
  onSave,
}: {
  hasChanges: boolean;
  isPending: boolean;
  onSave: () => void;
}) {
  return (
    <div className="sticky bottom-0 z-20 -mx-4 border-t bg-background/95 px-4 py-3 backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {hasChanges ? "Niet-opgeslagen wijzigingen" : "Alles is opgeslagen"}
        </p>
        <Button onClick={onSave} disabled={isPending || !hasChanges} size="lg">
          {isPending ? "Bezig met opslaan..." : "Opslaan"}
        </Button>
      </div>
    </div>
  );
}
