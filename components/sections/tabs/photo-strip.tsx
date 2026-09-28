import { TabMedia, TabScrim } from "@/components/sections/tabs/tab-media";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { TabsSectionData } from "@/lib/cms/types";

type Items = TabsSectionData["items"];

/**
 * One wide picture with the text on top of it, and a row of small pictures
 * underneath to switch between them.
 *
 * This stays a server component. Which tab is open is remembered inside the
 * Tabs component, so no state is needed here.
 */
export function PhotoStrip({ items }: { items: Items }) {
  return (
    <Tabs defaultValue={items[0]?.label} className="flex-col gap-0">
      {items.map((item, index) => (
        <TabsContent key={item.label} value={item.label} className="text-base">
          <figure className="relative aspect-4/3 w-full overflow-hidden rounded-3xl sm:aspect-16/9 lg:aspect-21/9">
            <TabMedia
              image={item.image}
              priority={index === 0}
              sizes="(min-width: 1280px) 1152px, 100vw"
            />
            <TabScrim />

            <figcaption className="absolute inset-x-0 bottom-0 grid gap-4 p-6 text-white sm:grid-cols-2 sm:items-end sm:gap-10 sm:p-8 lg:p-10">
              <h3 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl lg:text-4xl">
                {item.heading}
              </h3>
              <div>
                <p className="leading-relaxed text-pretty text-white/90">{item.body}</p>
                {item.meta ? (
                  <p className="mt-3 text-sm text-white/70">{item.meta}</p>
                ) : null}
              </div>
            </figcaption>
          </figure>
        </TabsContent>
      ))}

      <TabsList className="mt-8 flex h-auto w-full items-start justify-start gap-3 overflow-x-auto rounded-none border-t border-foreground/10 bg-transparent p-0 pt-6 sm:gap-4">
        {items.map((item) => (
          <TabsTrigger
            key={item.label}
            value={item.label}
            className="group h-auto w-28 min-w-24 flex-none flex-col items-stretch gap-2 rounded-none border-0 bg-transparent p-0 text-left whitespace-normal data-active:bg-transparent data-active:shadow-none sm:w-auto sm:min-w-0 sm:flex-1"
          >
            <span className="relative block aspect-16/10 w-full overflow-hidden rounded-xl bg-foreground/5 outline-2 outline-offset-2 outline-transparent transition-[outline-color,filter] group-hover:brightness-110 group-data-active:outline-primary">
              <TabMedia image={item.image} sizes="200px" />
            </span>
            <span className="text-xs text-muted-foreground transition-colors group-hover:text-foreground group-data-active:font-semibold group-data-active:text-foreground sm:text-sm">
              {item.label}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
