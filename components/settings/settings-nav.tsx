"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowDown, ArrowUp, Eye, EyeOff } from "lucide-react";
import { cn } from "cn";

import { IconTip } from "@/components/settings/icon-tip";
import { useSettingsSite } from "@/components/settings/settings-site-context";
import { sectionLabels } from "@/lib/cms/section-labels";
import type { Section } from "@/lib/cms/types";

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
        "block rounded-lg px-3 py-2 text-sm font-medium",
        active
          ? "bg-primary text-primary-foreground"
          : "bg-muted/60 text-foreground hover:bg-muted"
      )}
    >
      <span className="line-clamp-2">{children}</span>
    </Link>
  );
}

function NavGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="border-b pb-2 text-sm font-semibold text-foreground">{title}</h2>
      <div className="mt-3 grid gap-1.5">{children}</div>
    </div>
  );
}

function SectionNavItem({
  href,
  active,
  index,
  total,
  section,
  onMove,
  onToggleVisible,
}: {
  href: string;
  active: boolean;
  index: number;
  total: number;
  section: Section;
  onMove: (direction: -1 | 1) => void;
  onToggleVisible: () => void;
}) {
  const label = sectionLabels[section.type] ?? section.type;
  const iconClass = active
    ? "text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground"
    : undefined;

  return (
    <div
      className={cn(
        "flex items-center rounded-lg",
        active
          ? "bg-primary text-primary-foreground"
          : "bg-muted/60 text-foreground hover:bg-muted"
      )}
    >
      <Link href={href} className="min-w-0 flex-1 px-3 py-2 text-sm font-medium">
        <span className="block truncate">{label}</span>
      </Link>
      <div className="flex shrink-0 items-center pr-1">
        <IconTip
          label={`Zet ${label} omhoog`}
          disabled={index === 0}
          className={iconClass}
          onClick={() => onMove(-1)}
        >
          <ArrowUp />
        </IconTip>
        <IconTip
          label={`Zet ${label} omlaag`}
          disabled={index === total - 1}
          className={iconClass}
          onClick={() => onMove(1)}
        >
          <ArrowDown />
        </IconTip>
        <IconTip
          label={
            section.visible
              ? `Verberg ${label} op de website`
              : `Toon ${label} op de website`
          }
          className={iconClass}
          onClick={onToggleVisible}
        >
          {section.visible ? <Eye /> : <EyeOff />}
        </IconTip>
      </div>
    </div>
  );
}

/**
 * The list of settings pages for one website. The visitor's page order is the
 * list of sections; header and footer sit around them. Each section has the
 * arrows and the eye on its own row, so you see what moves and what is hidden.
 */
export function SettingsNav() {
  const pathname = usePathname();
  const { site, setSite } = useSettingsSite();
  const base = `/${site.slug}/settings`;

  function moveSection(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= site.sections.length) return;

    const sections = [...site.sections];
    [sections[index], sections[target]] = [sections[target], sections[index]];
    setSite({ ...site, sections });
  }

  function toggleVisible(index: number) {
    const sections = site.sections.map((item, i) =>
      i === index ? { ...item, visible: !item.visible } : item
    );
    setSite({ ...site, sections });
  }

  return (
    <nav aria-label="Instellingen" className="grid gap-8">
      <NavGroup title="Site">
        <NavLink
          href={`${base}/general`}
          active={pathname === `${base}/general` || pathname === `${base}/colors`}
        >
          Algemeen
        </NavLink>
      </NavGroup>

      <NavGroup title="Pagina">
        <NavLink href={`${base}/header`} active={pathname === `${base}/header`}>
          Koptekst
        </NavLink>

        {site.sections.map((section, index) => (
          <SectionNavItem
            key={section.id}
            href={`${base}/${section.id}`}
            active={pathname === `${base}/${section.id}`}
            index={index}
            total={site.sections.length}
            section={section}
            onMove={(direction) => moveSection(index, direction)}
            onToggleVisible={() => toggleVisible(index)}
          />
        ))}

        <NavLink href={`${base}/footer`} active={pathname === `${base}/footer`}>
          Voettekst
        </NavLink>
      </NavGroup>
    </nav>
  );
}
