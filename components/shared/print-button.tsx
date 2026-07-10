"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Triggers the browser print dialog (Save as PDF). Print styles in globals.css
 * strip the site chrome and render the document cleanly for printing/saving.
 */
export function PrintButton({
  label = "Download PDF",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => window.print()}
      className={className}
    >
      <Download className="h-4 w-4" /> {label}
    </Button>
  );
}
