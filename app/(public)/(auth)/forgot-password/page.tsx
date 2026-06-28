"use client";

import { useAuth } from "@/app/hooks/useAuth";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { passwordReset } = useAuth();

  const handlePasswordReset = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Digite seu email acima para receber o link de recuperação.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await passwordReset(email);
      setResetSent(true);
    } catch (err: unknown) {
      setError((err as Error).message);
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
        className="input"
        placeholder="seuemail@exemplo.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      {error && <p className="text-error text-sm mt-2">{error}</p>}
      {resetSent && (
        <p className="text-success text-sm mt-2">
          Link de recuperação enviado!
        </p>
      )}
      <button type="submit" className="btn btn-neutral mt-4" disabled={loading}>
        {loading ? "Enviando..." : "Enviar link de recuperação"}
      </button>
    </form>
  );
}
