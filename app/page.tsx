export default function Home() {
  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "Inter, sans-serif"
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
          borderRadius: "6px"
        }}
      >
        Open Dashboard
      </a>

    </main>
  );
}