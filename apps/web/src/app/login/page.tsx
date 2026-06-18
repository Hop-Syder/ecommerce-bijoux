"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const result = await signIn("credentials", { email, password, redirect: false });
    setSubmitting(false);
    if (result?.error) {
      setError("Email ou mot de passe incorrect.");
      return;
    }
    router.push("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ivoire px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-5 rounded-sm border border-noir/10 bg-white p-8"
      >
        <h1 className="font-display text-2xl text-noir">SIKA BIJOUX — Administration</h1>

        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-anthracite/70">
            Email
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input mt-1"
            required
          />
        </label>

        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-anthracite/70">
            Mot de passe
          </span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input mt-1"
            required
          />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? "Connexion..." : "Se connecter"}
        </Button>
      </form>
    </div>
  );
}
