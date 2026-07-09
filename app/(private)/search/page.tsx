"use client";

import { fetchDatajud, getCachedProcessoByNumber } from "@/actions/deadlines";
import { Loading } from "@/components/loading";
import {
  ProcessProfileContent,
  type ProcessProfileData,
} from "@/components/private/process-profile";
import { formatarProcessoCNJ } from "@/utils/formatter-process-number";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchPage() {
  const [searchProcess, setSearchProcess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<ProcessProfileData | null>(
    null,
  );
  const router = useRouter();

  const handleProcessSearch = async () => {
    try {
      setIsLoading(true);
      await fetchDatajud(searchProcess);
      const data = await getCachedProcessoByNumber(searchProcess);
      setSearchResult(data);
      router.refresh();
    } catch (err) {
      console.error(
        "[createDeadline] Falha ao iniciar consulta Datajud:",
        err as Error,
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !searchResult) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col gap-6 py-6">
      <div className="flex items-center justify-end">
        <label className="input">
          <svg
            className="h-[1em] opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
          <input
            type="search"
            className="grow"
            placeholder="Search"
            value={formatarProcessoCNJ(searchProcess)}
            onChange={(e) => setSearchProcess(e.target.value)}
          />
        </label>
        <button className="btn btn-primary" onClick={handleProcessSearch}>
          buscar
        </button>
      </div>
      {searchResult && (
        <div className="card bg-base-100 border border-base-300">
          <div className="card-body p-4 sm:p-6">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <h2 className="font-bold text-lg">Resultado da busca</h2>
                <p className="text-sm text-base-content/60">
                  {formatarProcessoCNJ(searchResult.processo.numeroProcesso)}
                </p>
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setSearchResult(null)}
                aria-label="Fechar"
              >
                ✕
              </button>
            </div>
            <ProcessProfileContent data={searchResult} />
          </div>
        </div>
      )}
    </div>
  );
}
