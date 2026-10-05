"use client";

import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/**
 * One settings page: a name, a switch between the form and a live preview.
 * The form is `children`; the preview is passed in so each part can draw the
 * right slice of the website. Opslaan sits in its own bar at the bottom.
 */
export function PartEditor({
  title,
  siteHref,
  preview,
  children,
}: {
  title: string;
  siteHref: string;
  preview: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-6 pb-24">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-pretty">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Wijzigingen zijn pas zichtbaar op de website nadat u opslaat.
          </p>
        </div>

        <Link
          href={siteHref}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          Bekijk website
        </Link>
      </div>

      <Tabs defaultValue="preview" className="flex-col gap-6">
        <TabsList className="sticky top-17 z-10">
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
    </div>
  );
}
