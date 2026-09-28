"use client";

import Image from "next/image";

import { cn } from "cn";

/**
 * The picture of one tab, or a quiet hatched square when the CMS has no
 * picture for it yet. A missing image should never leave a hole in the row.
 */
export function TabMedia({
  image,
  sizes,
  priority = false,
}: {
  image?: string;
  sizes: string;
  priority?: boolean;
}) {
  if (!image) {
    return <div className="absolute inset-0 bg-hatch" aria-hidden />;
  }

  return (
    <Image
      src={image}
      alt=""
      fill
      sizes={sizes}
      priority={priority}
      className="object-cover"
    />
  );
}

/** The dark wash that keeps white text readable on top of a photo. */
export function TabScrim({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent",
        className
      )}
    />
  );
}
