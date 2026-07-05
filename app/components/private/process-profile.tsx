"use client";

import { getCachedProcessoByNumber } from "@/app/actions/deadlines";
import type { DatajudProcesso, ProcessoMetadata } from "@/app/types/processo";
import { formatarProcessoCNJ } from "@/app/utils/formatter-process-number";
import { X } from "lucide-react";
import { useEffect, useState, useTransition } from "react";

interface ProcessProfileProps {
  processNumber: string;
  onClose: () => void;
}

interface ProcessProfileData {
  processo: ProcessoMetadata;
  rawData: DatajudProcesso;
}

function formatDate(date?: string): string {
  if (!date) return "Não informado";
  return new Date(date).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function formatCurrency(value?: number): string {
  if (value === undefined || value === null) return "Não informado";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function ProcessProfile({
  processNumber,
  onClose,
}: ProcessProfileProps) {
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState<ProcessProfileData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    startTransition(async () => {
      const result = await getCachedProcessoByNumber(processNumber);
      if (!result) {
        setError("Processo não encontrado no cache.");
        return;
      }
      setData(result);
    });
  }, [processNumber]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <dialog open className="modal modal-open" onClick={handleBackdropClick}>
      <div className="modal-box max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg">Perfil do processo</h3>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={onClose}
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-2 text-sm text-base-content/70">
          {formatarProcessoCNJ(processNumber)}
        </div>

        <div className="flex-1 overflow-y-auto mt-4 -mx-6 px-6">
          {isPending && (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-md" />
            </div>
          )}

          {!isPending && error && (
            <div className="alert alert-error alert-soft text-sm">{error}</div>
          )}

          {!isPending && data && <ProcessProfileContent data={data} />}
        </div>

        <div className="modal-action mt-4">
          <button type="button" className="btn" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </dialog>
  );
}

function ProcessProfileContent({ data }: { data: ProcessProfileData }) {
  const { processo, rawData } = data;
  const movimentos = rawData.movimentos ?? [];

  return (
    <div className="flex flex-col gap-6">
      <section className="card bg-base-200 border-base-300 border">
        <div className="card-body p-4">
          <h4 className="card-title text-base">Dados gerais</h4>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mt-2">
            <div>
              <dt className="text-base-content/60">Tribunal</dt>
              <dd className="font-medium">
                {processo.tribunal ?? "Não informado"}
              </dd>
            </div>
            <div>
              <dt className="text-base-content/60">Classe processual</dt>
              <dd className="font-medium">
                {processo.classeProcessual ?? "Não informado"}
              </dd>
            </div>
            <div>
              <dt className="text-base-content/60">Órgão julgador</dt>
              <dd className="font-medium">
                {processo.orgaoJulgador ?? "Não informado"}
              </dd>
            </div>
            <div>
              <dt className="text-base-content/60">Grau</dt>
              <dd className="font-medium">
                {processo.grau ?? "Não informado"}
              </dd>
            </div>
            <div>
              <dt className="text-base-content/60">Distribuição</dt>
              <dd className="font-medium">
                {formatDate(processo.dataDistribuicao)}
              </dd>
            </div>
            <div>
              <dt className="text-base-content/60">Última atualização</dt>
              <dd className="font-medium">
                {formatDate(processo.dataUltimaAtualizacao)}
              </dd>
            </div>
            <div>
              <dt className="text-base-content/60">Valor da causa</dt>
              <dd className="font-medium">
                {formatCurrency(processo.valorCausa)}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="card bg-base-200 border-base-300 border">
        <div className="card-body p-4">
          <h4 className="card-title text-base">Assuntos</h4>
          {processo.assuntos.length > 0 ? (
            <div className="flex flex-wrap gap-2 mt-2">
              {processo.assuntos.map((assunto, index) => (
                <span key={index} className="badge badge-outline badge-sm">
                  {assunto}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-base-content/60 mt-2">
              Nenhum assunto informado.
            </p>
          )}
        </div>
      </section>

      <section className="card bg-base-200 border-base-300 border">
        <div className="card-body p-4">
          <h4 className="card-title text-base">Partes</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <PartesGroup
              title="Polo ativo"
              partes={processo.partes.poloAtivo}
            />
            <PartesGroup
              title="Polo passivo"
              partes={processo.partes.poloPassivo}
            />
            <PartesGroup title="Outros" partes={processo.partes.outros} />
          </div>
        </div>
      </section>

      <section className="card bg-base-200 border-base-300 border">
        <div className="card-body p-4">
          <h4 className="card-title text-base">
            Movimentações
            {movimentos.length > 0 && (
              <span className="badge badge-sm badge-ghost ml-2">
                {movimentos.length}
              </span>
            )}
          </h4>
          {movimentos.length > 0 ? (
            <ul className="flex flex-col gap-3 mt-2">
              {movimentos.map((movimento, index) => (
                <li
                  key={index}
                  className="bg-base-100 border border-base-300 rounded-lg p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-sm font-medium">{movimento.nome}</div>
                    {index === 0 && (
                      <span className="badge badge-primary badge-sm shrink-0">
                        Último
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-base-content/60 mt-1">
                    {formatDate(movimento.dataHora)}
                  </div>
                  {movimento.complementosTabelados &&
                    movimento.complementosTabelados.length > 0 && (
                      <div className="mt-2 flex flex-col gap-1">
                        {movimento.complementosTabelados.map(
                          (complemento, cIndex) => (
                            <div
                              key={cIndex}
                              className="text-xs text-base-content/70"
                            >
                              <span className="font-medium">
                                {complemento.nome}:
                              </span>{" "}
                              {complemento.valor}
                            </div>
                          ),
                        )}
                      </div>
                    )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-base-content/60 mt-2">
              Nenhuma movimentação disponível.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

function PartesGroup({
  title,
  partes,
}: {
  title: string;
  partes: Array<{ nome: string; tipo: string; documento?: string }>;
}) {
  if (partes.length === 0) return null;

  return (
    <div>
      <h5 className="text-sm font-medium text-base-content/80 mb-1">{title}</h5>
      <ul className="space-y-1">
        {partes.map((parte, index) => (
          <li key={index} className="text-sm">
            <div className="font-medium">{parte.nome}</div>
            <div className="text-xs text-base-content/60">
              {parte.tipo}
              {parte.documento && ` • ${parte.documento}`}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
