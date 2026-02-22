import Image from "next/image";

export default function Home() {
  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#fafafa",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      padding: "24px"
    }}>
      
      {/* Logo / Wordmark */}
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{
          fontSize: "48px",
          fontWeight: "600",
          letterSpacing: "-0.02em",
          color: "#111",
          margin: "0"
        }}>
          Cadenza
        </h1>
      </div>

      {/* Tagline */}
      <p style={{
        fontSize: "20px",
        color: "#444",
        textAlign: "center",
        maxWidth: "600px",
        marginBottom: "16px",
        lineHeight: "1.5"
      }}>
        Simple rehearsal and roster management for community orchestras.
      </p>

      {/* Description */}
      <p style={{
        fontSize: "16px",
        color: "#666",
        textAlign: "center",
        maxWidth: "500px",
        lineHeight: "1.6",
        marginBottom: "32px"
      }}>
        Coordinate musicians, track attendance, and manage rehearsals — without spreadsheets, scattered emails, or complicated software.
      </p>

      {/* Status badge */}
      <div style={{
        fontSize: "14px",
        color: "#555",
        backgroundColor: "#eee",
        padding: "8px 16px",
        borderRadius: "999px"
      }}>
        Currently in pilot testing
      </div>

    </main>
  );
}