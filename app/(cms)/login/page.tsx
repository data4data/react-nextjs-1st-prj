import { redirect } from "next/navigation";

import { LoginForm } from "@/components/login-form";
import { getUser } from "@/lib/auth/session";

export const metadata = {
  title: "Inloggen",
};

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { next } = await searchParams;

  // proxy.ts puts the page you were heading for in ?next=. Anything odd falls
  // back to the list of websites.
  const target = typeof next === "string" && next.startsWith("/") ? next : "/";

  // Already signed in? Then skip the form.
  if (await getUser()) {
    redirect(target);
  }

  return <LoginForm next={target} />;
}
