import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
  Img,
} from "@react-email/components";

export default function CadenzaLayout({
  preview,
  children,
}: {
  preview: string;
  children: React.ReactNode;
}) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>

      <Body style={body}>
        <Container style={container}>

          {/* Header */}
          <Section style={header}>
            <Img
              src="https://cadenzahq.com/branding/Cadenza-logo-email.png"
              width="120"
              alt="Cadenza"
              style={{ margin: "0 auto" }}
            />
            <Text style={tagline}>
              Orchestra Management System
            </Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            {children}
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Sent via Cadenza Orchestra Management
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
}

//
// 🎨 Styles (Cadenza-aligned, email-safe)
//

const body = {
  backgroundColor: "#f3f4f6", // softer gray (better than ivory)
  fontFamily: "Helvetica, Arial, sans-serif",
  padding: "20px 0",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  maxWidth: "600px",
  borderRadius: "10px",
  overflow: "hidden",
  border: "1px solid #e5e7eb",
};

const header = {
  backgroundColor: "#0F172A", // midnight
  padding: "24px",
  textAlign: "center" as const,
};

const tagline = {
  color: "#cbd5f5", // softened gold substitute (email-safe)
  fontSize: "12px",
  marginTop: "6px",
};

const content = {
  padding: "28px",
};

const footer = {
  backgroundColor: "#f9fafb",
  padding: "16px",
  textAlign: "center" as const,
};

const footerText = {
  fontSize: "12px",
  color: "#6b7280",
};