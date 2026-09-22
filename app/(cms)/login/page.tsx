import { redirect } from "next/navigation";

import { LoginForm } from "@/components/login-form";
import { getUser } from "@/lib/auth/session";

export const metadata = {
  title: "Inloggen",
};

export default async function LoginPage() {
  // Already signed in? Then skip the form.
  if (await getUser()) {
    redirect("/dashboard");
  }

  return <LoginForm />;
}
