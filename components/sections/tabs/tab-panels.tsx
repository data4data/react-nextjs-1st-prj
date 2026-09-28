"use client";

import { useId, useRef, useState } from "react";

import { TabMedia, TabScrim } from "@/components/sections/tabs/tab-media";
import { cn } from "cn";
import type { TabsSectionData } from "@/lib/cms/types";

type Items = TabsSectionData["items"];

/**
 * Every tab is a column. The open one grows wide and shows its text; the
 * others stay narrow with the label turned a quarter turn. On a phone there is
 * no room for columns, so the same thing happens from top to bottom.
 *
 * This one needs `"use client"`: which column is open is state, and clicking
 * changes it. The shadcn Tabs component cannot be used here, because there the
 * text lives in a panel after the buttons, while this design draws the text
 * inside the open column itself.
 */
export function TabPanels({ items }: { items: Items }) {
  const [openIndex, setOpenIndex] = useState(0);
  const baseId = useId();
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);

  /**
   * Arrow keys walk through the columns, the way a set of tabs is expected to
   * behave. Both pairs of arrows work, because the columns lie side by side on
   * a wide screen and under each other on a phone.
   */
  function onKeyDown(event: React.KeyboardEvent) {
    const steps: Record<string, number> = {
      ArrowRight: 1,
      ArrowDown: 1,
      ArrowLeft: -1,
      ArrowUp: -1,
    };

    let next: number | null = null;

    if (event.key in steps) {
      next = (openIndex + steps[event.key] + items.length) % items.length;
    } else if (event.key === "Home") {
      next = 0;
    } else if (event.key === "End") {
      next = items.length - 1;
    }

    if (next === null) return;

    event.preventDefault();
    setOpenIndex(next);
    buttons.current[next]?.focus();
  }

  return (
    <div
      role="tablist"
      onKeyDown={onKeyDown}
      className="flex flex-col gap-2 sm:h-[28rem] sm:flex-row sm:gap-3 lg:h-[32rem]"
    >
      {items.map((item, index) => {
        const open = index === openIndex;
        const tabId = `${baseId}-tab-${index}`;
        const panelId = `${baseId}-panel-${index}`;

        return (
          <div
            key={item.label}
            className={cn(
              "relative overflow-hidden rounded-2xl transition-[flex-grow,height] duration-300 ease-out",
              open ? "h-96 sm:h-auto sm:grow" : "h-14 sm:h-auto sm:w-14 lg:w-16"
            )}
          >
            <TabMedia
              image={item.image}
              priority={index === 0}
              sizes={open ? "(min-width: 640px) 70vw, 100vw" : "120px"}
            />
            <TabScrim
              className={cn(!open && "bg-foreground/35 bg-none dark:bg-black/50")}
            />

            <button
              ref={(node) => {
                buttons.current[index] = node;
              }}
              type="button"
              role="tab"
              id={tabId}
              aria-selected={open}
              aria-controls={panelId}
              tabIndex={open ? 0 : -1}
              onClick={() => setOpenIndex(index)}
              className={cn(
                "absolute inset-0 flex cursor-pointer items-center justify-center p-4",
                "focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white",
                "sm:items-end",
                !open && "hover:bg-white/10"
              )}
            >
              {/* When the column is open its label is shown by the panel
                  below, so here it is only left for screen readers. */}
              <span
                className={cn(
                  "text-sm font-medium text-white",
                  open
                    ? "sr-only"
                    : "whitespace-nowrap sm:[writing-mode:vertical-rl] sm:rotate-180"
                )}
              >
                {item.label}
              </span>
            </button>

            <div
              role="tabpanel"
              id={panelId}
              aria-labelledby={tabId}
              hidden={!open}
              // Clicks fall through to the button that covers the whole column.
              className="pointer-events-none absolute inset-x-0 bottom-0 p-6 text-white sm:p-8"
            >
              <p className="text-sm text-white/70">{item.label}</p>
              <h3 className="mt-1 text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
                {item.heading}
              </h3>
              <p className="mt-3 max-w-xl leading-relaxed text-pretty text-white/90">
                {item.body}
              </p>
              {item.meta ? (
                <p className="mt-3 text-sm text-white/70">{item.meta}</p>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
