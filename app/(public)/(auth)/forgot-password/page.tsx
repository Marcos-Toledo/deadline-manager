"use client";

import { useActionFeedback } from "@/hooks/use-action-feedback";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { passwordReset } = useAuth();
  const { showSuccess, showError } = useActionFeedback();

  const handlePasswordReset = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!email) {
      showError("Digite seu email acima para receber o link de recuperação.");
      return;
    }
    setLoading(true);
    try {
      await passwordReset(email);
      showSuccess("Link de recuperação enviado!");
    } catch (err: unknown) {
      showError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="fieldset bg-base-200 border-base-300 rounded-box w-96 border p-4"
      onSubmit={handlePasswordReset}
    >
      <legend className="fieldset-legend">
        <Link href="/login" className="absolute top-4 left-4">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        Recuperar senha
      </legend>

      <label className="label block">Email</label>
      <input
        type="email"
        className="input w-full"
        placeholder="seuemail@exemplo.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit" className="btn btn-primary mt-4" disabled={loading}>
        {loading ? "Enviando..." : "Enviar link de recuperação"}
      </button>
    </form>
  );
}
