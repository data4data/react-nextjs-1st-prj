import Image from "next/image";

import { SectionShell } from "@/components/sections/section-shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "cn";
import type { TabsSectionData } from "@/lib/cms/types";

/**
 * Tabs whose direction is chosen in the CMS: side by side, or stacked in a
 * column on the left.
 *
 * This stays a server component. The tabs remember which one is open, but that
 * memory lives inside the Tabs component itself, so this file needs no state.
 */
export function TabsSection({
  section,
  index,
}: {
  section: TabsSectionData;
  index: number;
}) {
  const isVertical = section.orientation === "vertical";

  return (
    <SectionShell id={section.id} index={index}>
      <h2 className="text-3xl font-semibold text-balance sm:text-4xl">
        {section.heading}
      </h2>

      <Tabs
        defaultValue={section.items[0]?.label}
        orientation={section.orientation}
        className={cn(
          "mt-8",
          // Vertical only from md upward: on a phone there is no room for a
          // column of tabs next to the content.
          isVertical && "md:flex-row md:items-start md:gap-8"
        )}
      >
        <TabsList
          className={cn(
            "max-w-full overflow-x-auto",
            isVertical && "md:w-56 md:shrink-0 md:flex-col"
          )}
        >
          {section.items.map((item) => (
            <TabsTrigger key={item.label} value={item.label}>
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {section.items.map((item) => (
          <TabsContent key={item.label} value={item.label}>
            <div className="grid items-center gap-8 md:grid-cols-2">
              <div>
                <h3 className="text-xl font-semibold text-balance">{item.heading}</h3>
                <p className="mt-3 leading-relaxed text-pretty text-muted-foreground">
                  {item.body}
                </p>
              </div>

              {item.image ? (
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ) : null}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </SectionShell>
  );
}
