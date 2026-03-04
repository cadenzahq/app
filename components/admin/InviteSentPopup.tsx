"use client";

import { useEffect, useState } from "react";

export default function InviteSentPopup() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Start fade after 2.5 seconds
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 2500);

    // Remove completely after 3 seconds
    const removeTimer = setTimeout(() => {
      setVisible(false);
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        ...popupStyle,
        opacity: fadeOut ? 0 : 1,
        transform: fadeOut ? "translateY(-10px)" : "translateY(0)",
      }}
    >
      RSVP invitations sent successfully ✓
    </div>
  );
}

const popupStyle = {
  position: "fixed" as const,
  top: "20px",
  right: "20px",
  backgroundColor: "#16a34a",
  color: "white",
  padding: "12px 18px",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  zIndex: 1000,

  transition: "opacity 0.5s ease, transform 0.5s ease",
};