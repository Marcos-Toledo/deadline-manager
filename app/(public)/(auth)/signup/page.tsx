import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function Signup() {
  return (
    <>
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-96 border p-4">
        <legend className="fieldset-legend">
          <Link href="/login" className="absolute top-4 left-4">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          Signup
        </legend>

        <div className="flex flex-col gap-4">
          <div>
            <label className="label block">Nome</label>
            <input type="text" className="input" placeholder="Nome" />
          </div>

          <div>
            <label className="label block">Email</label>
            <input type="email" className="input" placeholder="Email" />
          </div>

          <div>
            <label className="label block">Senha</label>
            <input type="password" className="input" placeholder="Senha" />
          </div>

          <div>
            <label className="label block">Confirmar Senha</label>
            <input
              type="password"
              className="input"
              placeholder="Confirmar Senha"
            />
          </div>

          <button className="btn btn-neutral mt-4">Cadastrar</button>
        </div>
      </fieldset>
    </>
  );
}
