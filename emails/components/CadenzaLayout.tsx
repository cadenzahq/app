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
            <Text style={logo}>CADENZA</Text>
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

const body = {
  backgroundColor: "#f4f4f7",
  fontFamily: "Helvetica, Arial, sans-serif",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "0",
  maxWidth: "600px",
  borderRadius: "8px",
  overflow: "hidden",
};

const header = {
  backgroundColor: "#111827",
  padding: "20px",
  textAlign: "center" as const,
};

const logo = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "bold",
  letterSpacing: "3px",
};

const tagline = {
  color: "#9ca3af",
  fontSize: "12px",
};

const content = {
  padding: "30px",
};

const footer = {
  backgroundColor: "#f9fafb",
  padding: "15px",
  textAlign: "center" as const,
};

const footerText = {
  fontSize: "12px",
  color: "#6b7280",
};