"use client";

import Link from "next/link";

import { SaveBar } from "@/components/settings/save-bar";
import { buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/**
 * One settings page: a name, a switch between the form and a live preview, and
 * the save bar. The form is `children`; the preview is passed in so each part
 * can draw the right slice of the website.
 */
export function PartEditor({
  title,
  siteHref,
  extras,
  hasChanges,
  isPending,
  onSave,
  preview,
  children,
}: {
  title: string;
  siteHref: string;
  extras?: React.ReactNode;
  hasChanges: boolean;
  isPending: boolean;
  onSave: () => void;
  preview: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-6 pb-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-pretty">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Wijzigingen zijn pas zichtbaar op de website nadat u opslaat.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {extras}
          <Link href={siteHref} className={buttonVariants({ variant: "outline", size: "sm" })}>
            Bekijk website
          </Link>
        </div>
      </div>

      <Tabs defaultValue="edit" className="flex-col gap-6">
        <TabsList className="sticky top-16 z-10">
          <TabsTrigger value="edit">Bewerken</TabsTrigger>
          <TabsTrigger value="preview">Voorbeeld</TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="text-base">
          {children}
        </TabsContent>
        <TabsContent value="preview" className="text-base">
          {preview}
        </TabsContent>
      </Tabs>

      <SaveBar hasChanges={hasChanges} isPending={isPending} onSave={onSave} />
    </div>
  );
}
