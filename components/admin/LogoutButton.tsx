"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {

  const supabase = createClient();
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  return (
    <button
      onClick={handleLogout}
      style={{
        padding: "8px 12px",
        backgroundColor: "#111",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer"
      }}
    >
      Logout
    </button>
  );
}