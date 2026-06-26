"use client";

import { useAuth } from "@/app/hooks/useAuth";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Login() {
  const { googleSignIn } = useAuth();
  return (
    <>
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-96 border p-4">
        <legend className="fieldset-legend">
          <Link href="/" className="absolute top-4 left-4">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          Entrar
        </legend>

        {/* Google */}
        <button
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
          Entrar com Google
        </button>
        <p className="text-center mt-4">ou</p>

        <div className="flex flex-col gap-4">
          <div>
            <label className="label block">Nome</label>
            <input type="text" className="input" placeholder="Nome" />
          </div>

          <div>
            <label className="label block">Senha</label>
            <input type="password" className="input" placeholder="Senha" />
          </div>

          <div className="flex flex-col">
            <button className="btn btn-neutral mt-4">Entrar</button>
            <button className="btn btn-ghost mt-2">Esqueci minha senha</button>
          </div>
        </div>

        <p className="text-center mt-4">
          Não tem uma conta?{" "}
          <Link href="/signup" className="link link-primary">
            Cadastre-se
          </Link>
        </p>
      </fieldset>
    </>
  );
}
