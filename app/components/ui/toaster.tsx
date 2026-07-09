"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      richColors
      closeButton
      duration={4000}
      toastOptions={{
        classNames: {
          toast:
            "group bg-base-100 text-base-content border border-base-300 shadow-lg",
          description: "group-[.toast]:text-base-content/70",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-content",
          cancelButton:
            "group-[.toast]:bg-base-200 group-[.toast]:text-base-content",
          error: "group-[.toast]:text-error",
          success: "group-[.toast]:text-success",
          warning: "group-[.toast]:text-warning",
          info: "group-[.toast]:text-info",
        },
      }}
    />
  );
}
