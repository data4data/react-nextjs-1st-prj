"use client";

import { useActionState } from "react";

import { login } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { emptyActionState } from "@/lib/cms/action-state";

export function LoginForm({ next }: { next: string }) {
  const [state, formAction, isPending] = useActionState(login, emptyActionState);

  return (
    <div className="mx-auto w-full max-w-sm py-10">
      <Card>
        <CardHeader>
          <CardTitle>Inloggen</CardTitle>
          <CardDescription>Beheer de inhoud van de website.</CardDescription>
        </CardHeader>

        <CardContent>
          <form action={formAction} className="grid gap-4">
            {/* Where to go after logging in, put here by proxy.ts. */}
            <input type="hidden" name="next" value={next} />

            <div className="grid gap-2">
              <Label htmlFor="email">E-mailadres</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                required
                aria-invalid={Boolean(state.errors?.email)}
              />
              {state.errors?.email ? (
                <p className="text-sm text-destructive">{state.errors.email[0]}</p>
              ) : null}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Wachtwoord</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                aria-invalid={Boolean(state.errors?.password)}
              />
              {state.errors?.password ? (
                <p className="text-sm text-destructive">{state.errors.password[0]}</p>
              ) : null}
            </div>

            {/* Shown when the combination is simply wrong. */}
            {!state.ok && state.message && !state.errors ? (
              <p className="text-sm text-destructive">{state.message}</p>
            ) : null}

            <Button type="submit" disabled={isPending} className="mt-2">
              {isPending ? "Bezig met inloggen..." : "Inloggen"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
