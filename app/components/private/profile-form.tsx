"use client";

import { updateUserProfile } from "@/app/actions/profile";
import type { User } from "@/app/types";
import { Loader2, Save, UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

interface ProfileFormProps {
  initialProfile: User | null;
}

export function ProfileForm({ initialProfile }: ProfileFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialProfile?.name ?? "");
  const [email, setEmail] = useState(initialProfile?.email ?? "");
  const [phoneNumber, setPhoneNumber] = useState(
    initialProfile?.phoneNumber ?? "",
  );
  const [oab, setOab] = useState(initialProfile?.oab ?? "");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [saving, startSaving] = useTransition();

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    startSaving(async () => {
      const result = await updateUserProfile({
        name,
        phoneNumber,
        oab,
        email,
      });

      if (!result.success) {
        setError(result.error || "Erro ao atualizar perfil");
        return;
      }

      setSuccess(true);
      router.refresh();
    });
  };

  return (
    <div className="card bg-base-200 border-base-300 border">
      <div className="card-body">
        <div className="flex items-center gap-2 mb-4">
          <UserCircle className="w-5 h-5 text-primary" />
          <h2 className="card-title">Meu perfil</h2>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && (
            <p className="text-green-600 text-sm">Perfil atualizado.</p>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <label className="label block">Nome</label>
            <input
              type="text"
              className="input w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!!initialProfile?.name}
              required
            />
            {initialProfile?.name && (
              <p className="text-xs text-base-content/50 mt-1">
                O nome não pode ser alterado.
              </p>
            )}
          </div>

          <div>
            <label className="label block">E-mail</label>
            <input
              type="email"
              className="input w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!!initialProfile?.email}
            />
            {initialProfile?.email && (
              <p className="text-xs text-base-content/50 mt-1">
                O e-mail não pode ser alterado.
              </p>
            )}
          </div>

          <div>
            <label className="label block">Telefone</label>
            <input
              type="tel"
              className="input w-full"
              placeholder="+55 11 99999-9999"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <p className="text-xs text-base-content/50 mt-1">
              Necessário para ativar alertas por SMS e WhatsApp.
            </p>
          </div>

          <div>
            <label className="label block">OAB</label>
            <input
              type="text"
              className="input w-full"
              placeholder="OAB/SP 123.456"
              value={oab}
              onChange={(e) => setOab(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 mt-2">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
