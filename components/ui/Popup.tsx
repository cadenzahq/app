"use client";

import { useEffect, useState } from "react";

type PopupType = "success" | "error" | "info" | "warning";

export default function Popup({
  message,
  type = "info",
  duration = 3000,
}: {
  message: string;
  type?: PopupType;
  duration?: number;
}) {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, duration - 500);

    const removeTimer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [duration]);

  if (!visible) return null;

  const style = popupStyles[type];

  return (
    <div
      style={{
        ...baseStyle,
        ...style,
        opacity: fadeOut ? 0 : 1,
        transform: fadeOut ? "translateY(-10px)" : "translateY(0)",
      }}
    >
      {style.icon} {message}
    </div>
  );
}

const baseStyle = {
  position: "fixed" as const,
  top: "20px",
  right: "20px",
  padding: "12px 18px",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  zIndex: 1000,
  color: "white",
  fontWeight: "500",
  transition: "opacity 0.5s ease, transform 0.5s ease",
};

const popupStyles = {
  success: {
    backgroundColor: "#16a34a",
    icon: "✓",
  },
  error: {
    backgroundColor: "#dc2626",
    icon: "✕",
  },
  info: {
    backgroundColor: "#2563eb",
    icon: "ℹ",
  },
  warning: {
    backgroundColor: "#ca8a04",
    icon: "⚠",
  },
};