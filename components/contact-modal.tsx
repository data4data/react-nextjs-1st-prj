"use client";

import { useActionState, useId, useRef, useState } from "react";
import { toast } from "sonner";

import { submitContact } from "@/app/actions/contact";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { emptyActionState } from "@/lib/cms/action-state";
import type { ActionResult } from "@/lib/cms/types";

type ContactModalProps = {
  triggerLabel: string;
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "lg";
};

/**
 * The contact form in a dialog.
 *
 * This is a client component because it has to react to clicks and remember
 * whether it is open. The saving itself happens in a server action, so no
 * `fetch` and no API route are needed.
 *
 * Two kinds of feedback on purpose: errors per field stay next to the field,
 * while the overall result is a toast.
 */
export function ContactModal({
  triggerLabel,
  variant = "default",
  size = "default",
}: ContactModalProps) {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const fieldId = useId();

  /**
   * The toast and the closing happen here, right where the server answered,
   * instead of in a `useEffect` that watches the result. An effect would run
   * after an extra render and would fire again on every unrelated re-render.
   */
  const [state, formAction, isPending] = useActionState(
    async (previous: ActionResult, formData: FormData) => {
      const result = await submitContact(previous, formData);

      if (result.ok) {
        toast.success(result.message);
        formRef.current?.reset();
        setOpen(false);
      } else {
        toast.error(result.message);
      }

      return result;
    },
    emptyActionState
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant={variant} size={size} />}>
        {triggerLabel}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Neem contact op</DialogTitle>
          <DialogDescription>
            Laat uw gegevens achter, dan reageren we binnen een werkdag.
          </DialogDescription>
        </DialogHeader>

        <form ref={formRef} action={formAction} className="grid gap-4">
          <Field
            id={`${fieldId}-name`}
            name="name"
            label="Naam"
            errors={state.errors?.name}
          />

          <Field
            id={`${fieldId}-email`}
            name="email"
            type="email"
            label="E-mailadres"
            errors={state.errors?.email}
          />

          <div className="grid gap-2">
            <Label htmlFor={`${fieldId}-message`}>Bericht</Label>
            <Textarea
              id={`${fieldId}-message`}
              name="message"
              rows={5}
              required
              aria-invalid={Boolean(state.errors?.message)}
              aria-describedby={
                state.errors?.message ? `${fieldId}-message-error` : undefined
              }
            />
            <FieldError id={`${fieldId}-message-error`} errors={state.errors?.message} />
          </div>

          <Button type="submit" disabled={isPending} className="mt-2">
            {isPending ? "Bezig met versturen..." : "Verstuur bericht"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  id,
  name,
  label,
  type = "text",
  errors,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  errors?: string[];
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={name}
        type={type}
        required
        aria-invalid={Boolean(errors)}
        aria-describedby={errors ? `${id}-error` : undefined}
      />
      <FieldError id={`${id}-error`} errors={errors} />
    </div>
  );
}

function FieldError({ id, errors }: { id: string; errors?: string[] }) {
  if (!errors?.length) return null;

  return (
    <p id={id} className="text-sm text-destructive">
      {errors[0]}
    </p>
  );
}
