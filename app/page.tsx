import { supabase } from "../lib/supabase";

export default async function Home() {

  const { data: orchestras, error } = await supabase
    .from("orchestras")
    .select("*");

  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Inter, sans-serif"
    }}>
      
      <h1 style={{ fontSize: "48px", marginBottom: "24px" }}>
        Cadenza
      </h1>

      <p>Connected orchestras:</p>

      <ul>
        {orchestras?.map((orch) => (
          <li key={orch.id}>{orch.name}</li>
        ))}
      </ul>

    </main>
  );
}