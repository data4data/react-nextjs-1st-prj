import { cn } from "cn";

type SectionShellProps = {
  id: string;
  /** Position in the list of sections that are actually rendered. */
  index: number;
  /** Full width, no container and no vertical padding. For the hero. */
  bleed?: boolean;
  children: React.ReactNode;
};

/**
 * The one place that owns spacing, width and background for every section.
 *
 * Sections never set these themselves. Because the striped background is
 * decided by the position in the rendered list, hiding a section in the CMS can
 * never leave two grey blocks next to each other, and removing one never leaves
 * a double gap.
 */
export function SectionShell({ id, index, bleed = false, children }: SectionShellProps) {
  const striped = index % 2 === 1;

  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-16",
        striped ? "bg-muted/40" : "bg-background",
        !bleed && "py-16 sm:py-24"
      )}
    >
      {bleed ? children : <div className="mx-auto w-full max-w-6xl px-4">{children}</div>}
    </section>
  );
}
