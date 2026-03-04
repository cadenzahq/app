"use client";

import { createClient } from "@/lib/supabase/client";

export default function Home() {
  
  const supabase = createClient();

  async function testAuth() {
    const result = await supabase.auth.getUser();
    console.log(result);
  }

  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "Inter, sans-serif",
      gap: "12px"
    }}>
      
      <h1 style={{
        fontSize: "48px",
        marginBottom: "16px"
      }}>
        Cadenza
      </h1>

      <p style={{
        fontSize: "18px",
        color: "#555",
        marginBottom: "24px"
      }}>
        Rehearsal and roster management for community orchestras.
      </p>

      <a
        href="/dashboard"
        style={{
          padding: "10px 20px",
          backgroundColor: "#111",
          color: "white",
          textDecoration: "none",
          borderRadius: "6px",
          marginBottom: "10px"
        }}
      >
        Open Dashboard
      </a>

      <button
        onClick={testAuth}
        style={{
          padding: "10px",
          background: "black",
          color: "white",
          marginTop: "20px",
          cursor: "pointer",
          position: "relative",
          zIndex: 10
        }}
      >
        Test Auth
      </button>

    </main>
  
  );
}