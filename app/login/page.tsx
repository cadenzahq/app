"use client";

import { useState, useEffect } from "react";
import type { SyntheticEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    async function checkSession() {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.replace("/admin/dashboard");
      }
    }
    checkSession();
  }, [router, supabase]);

  async function handleLogin(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    // Let server resolve orchestra + role
    router.replace("/admin/dashboard");
  }

  return (
    <form
      onSubmit={handleLogin}
      className="max-w-md mx-auto mt-32 flex flex-col gap-4"
    >
      <h1 className="text-2xl font-semibold text-center">
        Login
      </h1>

      {error && (
        <div className="text-red-600 text-sm text-center">
          {error}
        </div>
      )}

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="p-3 border rounded-md"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="p-3 border rounded-md"
      />

      <button
        type="submit"
        className="p-3 bg-black text-white rounded-md hover:opacity-90"
      >
        Login
      </button>
    </form>
  );
}