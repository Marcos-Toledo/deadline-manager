"use client";

import { registerUser } from "@/app/actions/auth";
import { useAuth } from "@/app/hooks/useAuth";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Signup() {
  const router = useRouter();
  const { googleSignIn } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    const result = await registerUser({ name, email, password });

    if (!result?.success) {
      setError(result?.error || "Erro ao cadastrar usuário");
      setLoading(false);
    } else {
      router.push("/login?registered=true");
    }
  };

  return (
    <form
      className="fieldset bg-base-200 border-base-300 rounded-box w-96 border p-4"
      onSubmit={handleSubmit}
    >
      <legend className="fieldset-legend">
        <Link href="/login" className="absolute top-4 left-4">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        Cadastrar
      </legend>

      {/* Google */}
      <button
        type="button"
        className="btn bg-white text-black border-[#e5e5e5]"
        onClick={googleSignIn}
      >
        <svg
          aria-label="Google logo"
          width="16"
          height="16"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <g>
            <path d="m0 0H512V512H0" fill="#fff"></path>
            <path
              fill="#34a853"
              d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
            ></path>
            <path
              fill="#4285f4"
              d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
            ></path>
            <path
              fill="#fbbc02"
              d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
            ></path>
            <path
              fill="#ea4335"
              d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
            ></path>
          </g>
        </svg>
        Cadastrar com Google
      </button>
      <p className="text-center mt-4">ou</p>

      <div className="flex flex-col gap-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div>
          <label className="label block">Nome</label>
          <input
            type="text"
            className="input"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="label block">Email</label>
          <input
            type="email"
            className="input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="label block">Senha</label>
          <input
            type="password"
            className="input"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="label block">Confirmar Senha</label>
          <input
            type="password"
            className="input"
            placeholder="Confirmar Senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-neutral mt-4"
          disabled={loading}
        >
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>
      </div>
    </form>
  );
}
