"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "cn";

import { sectionLabels } from "@/lib/cms/section-labels";
import type { Section, Site } from "@/lib/cms/types";

function sectionTitle(section: Section): string {
  const type = sectionLabels[section.type] ?? section.type;

  if (section.type === "carousel") {
    return `${type} · ${section.slides[0]?.title ?? type}`;
  }

  if ("heading" in section) {
    return `${type} · ${section.heading}`;
  }

  return type;
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "block truncate rounded-md px-3 py-2 text-sm",
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      {children}
    </Link>
  );
}

/**
 * The list of settings pages for one website. The visitor's page order is the
 * list of sections; header and footer sit around them.
 */
export function SettingsNav({ site }: { site: Site }) {
  const pathname = usePathname();
  const base = `/${site.slug}/settings`;

  return (
    <nav aria-label="Instellingen" className="grid gap-6">
      <div>
        <p className="px-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Site
        </p>
        <div className="mt-2 grid gap-0.5">
          <NavLink href={`${base}/general`} active={pathname === `${base}/general`}>
            Algemeen
          </NavLink>
          <NavLink href={`${base}/colors`} active={pathname === `${base}/colors`}>
            Kleuren
          </NavLink>
        </div>
      </div>

      <div>
        <p className="px-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Pagina
        </p>
        <div className="mt-2 grid gap-0.5">
          <NavLink href={`${base}/header`} active={pathname === `${base}/header`}>
            Koptekst
          </NavLink>

          {site.sections.map((section) => (
            <NavLink
              key={section.id}
              href={`${base}/${section.id}`}
              active={pathname === `${base}/${section.id}`}
            >
              {sectionTitle(section)}
              {!section.visible ? " (verborgen)" : ""}
            </NavLink>
          ))}

          <NavLink href={`${base}/footer`} active={pathname === `${base}/footer`}>
            Voettekst
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
