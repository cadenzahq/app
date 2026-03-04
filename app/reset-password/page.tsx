"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {

  const supabase = createClient();

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // This extracts the access_token from URL and sets session
    supabase.auth.getSession().then(() => {
      setReady(true);
    });
  }, []);

  async function handleReset() {

    const { error } = await supabase.auth.updateUser({
      password
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Password updated successfully.");
    }
  }

  if (!ready) {
    return <div className="mt-20 text-center">Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-20">

      <h1 className="text-xl font-semibold mb-4">
        Set New Password
      </h1>

      <input
        type="password"
        placeholder="New password"
        className="border p-2 w-full mb-4"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleReset}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Update Password
      </button>

      {message && (
        <div className="mt-4 text-sm">
          {message}
        </div>
      )}

    </div>
  );
}