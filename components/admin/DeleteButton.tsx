"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/Button";

export function DeleteSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="destructive"
      disabled={pending}
    >
      {pending ? "Deleting..." : "Delete Event"}
    </Button>
  );
}