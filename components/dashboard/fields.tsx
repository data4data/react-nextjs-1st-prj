"use client";

import { useId } from "react";
import { cn } from "cn";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

/**
 * Small building blocks for the CMS forms.
 *
 * Every field is "controlled": the value comes from state and every keystroke
 * sends the new value upwards with `onChange`. That way one object always holds
 * the whole site, and saving is just sending that object.
 */

export function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const id = useId();

  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

/**
 * Colors that are one click away. They are only a starting point: the swatch
 * next to them opens the colour picker of the operating system, and that dialog
 * has its own field for an exact code, so no color is out of reach.
 */
const palette = [
  "#2f6f4e",
  "#4a7a3a",
  "#1f6f8b",
  "#3c4f76",
  "#7a4b2a",
  "#b03a2e",
  "#e2714a",
  "#e8b04b",
  "#c9a227",
  "#5b5b5b",
];

/**
 * Pick a color, never type one.
 *
 * There used to be a text box for the hex code here. It let you save something
 * like `abc`, which is not a color, and the save then failed with a message
 * that did not say which field was wrong. Choosing can only produce a real
 * `#rrggbb`, so the whole problem disappears.
 */
export function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const id = useId();

  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>

      <div className="flex items-center gap-3">
        <input
          id={id}
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="size-10 cursor-pointer rounded-lg border bg-background p-1 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        />
        <div className="text-sm">
          <p>Klik op het vierkant voor alle kleuren</p>
          <p className="font-mono text-muted-foreground">{value}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 pt-1">
        {palette.map((color) => {
          const selected = color.toLowerCase() === value.toLowerCase();

          return (
            <button
              key={color}
              type="button"
              // The color is the whole button, so a screen reader needs the
              // name spelled out; it cannot read a background.
              aria-label={`Kies kleur ${color}`}
              aria-pressed={selected}
              onClick={() => onChange(color)}
              style={{ background: color }}
              className={cn(
                "size-7 rounded-md border transition-transform hover:scale-110",
                "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                selected && "ring-3 ring-foreground/40"
              )}
            />
          );
        })}
      </div>
    </div>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  const id = useId();

  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Textarea
        id={id}
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
