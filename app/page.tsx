import { supabase } from "../lib/supabase";
import { revalidatePath } from "next/cache";

async function addOrchestra(formData: FormData) {
  "use server";

  const name = formData.get("name") as string;

  if (!name) return;

  await supabase.from("orchestras").insert({
    name: name,
    created_by: "James",
  });

  revalidatePath("/");
}

export default async function Home() {

  const { data: orchestras } = await supabase
    .from("orchestras")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main style={{
      minHeight: "100vh",
      padding: "40px",
      fontFamily: "Inter, sans-serif",
      maxWidth: "600px",
      margin: "0 auto"
    }}>
      
      <h1 style={{
        fontSize: "48px",
        marginBottom: "24px"
      }}>
        Cadenza
      </h1>

      <h2>Connected orchestras:</h2>

      <ul style={{ marginBottom: "32px" }}>
        {orchestras?.map((orch) => (
          <li key={orch.id}>{orch.name}</li>
        ))}
      </ul>

<form action={addOrchestra} style={{
  display: "flex",
  gap: "12px",
  alignItems: "center"
}}>
  
  <input
    name="name"
    placeholder="New orchestra name"
    style={{
      padding: "10px 12px",
      fontSize: "16px",
      flex: "1",
      minWidth: "250px",
      borderRadius: "6px",
      border: "1px solid #ccc"
    }}
  />

  <button
    type="submit"
    style={{
      padding: "10px 16px",
      fontSize: "16px",
      borderRadius: "6px",
      border: "none",
      backgroundColor: "#111",
      color: "white",
      cursor: "pointer"
    }}
  >
    Add Orchestra
  </button>

</form>

    </main>
  );
}