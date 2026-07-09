"use client";

import { toast } from "sonner";

export function useActionFeedback() {
  function showSuccess(message: string) {
    toast.success(message);
  }

  function showError(message: string) {
    toast.error(message);
  }

  return { showSuccess, showError };
}
