import { adminDb } from "@/app/config/firebase-admin";
import {
  DatajudCacheEntry,
  DatajudError,
  DatajudProcesso,
  DatajudSearchResponse,
  ProcessoMetadata,
} from "@/app/types/processo";

const DATAJUD_BASE_URL =
  process.env.DATAJUD_BASE_URL ?? "https://api-publica.datajud.cnj.jus.br";
const DATAJUD_API_KEY = process.env.DATAJUD_API_KEY ?? "";

const RATE_LIMIT_MAX = 120;
const RATE_LIMIT_WINDOW_MS = 60_000;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const CACHE_COLLECTION = "datajud_cache";

const PROCESS_NUMBER_REGEX = /^\d{7}-\d{2}\.\d{4}\.\d\.\d{2}\.\d{4}$/;

const requestTimestamps: number[] = [];

const TRIBUNAL_SIGLAS: Record<string, string> = {
  "1": "tjal",
  "2": "tjam",
  "3": "tjac",
  "4": "tjap",
  "5": "tjba",
  "6": "tjce",
  "7": "tjdft",
  "8": "tjes",
  "9": "tjgo",
  "10": "tjma",
  "11": "tjmt",
  "12": "tjms",
  "13": "tjmg",
  "14": "tjpa",
  "15": "tjpb",
  "16": "tjpr",
  "17": "tjpe",
  "18": "tjpi",
  "19": "tjrj",
  "20": "tjrn",
  "21": "tjrs",
  "22": "tjro",
  "23": "tjrr",
  "24": "tjsc",
  "25": "tjse",
  "26": "tjsp",
  "27": "tjto",
  "40": "trf1",
  "41": "trf2",
  "42": "trf3",
  "43": "trf4",
  "44": "trf5",
  "45": "trf6",
  "50": "tst",
  "60": "stj",
  "70": "stf",
  "80": "tse",
  "81": "tseleitoral",
  "90": "stm",
};

export function validateProcessNumber(numero: string): boolean {
  const normalized = numero.trim();
  return PROCESS_NUMBER_REGEX.test(normalized);
}

function normalizeProcessNumber(numero: string): string {
  const digits = numero.trim().replace(/\D/g, "");
  if (digits.length !== 20) return numero.trim().replace(/\s/g, "");
  return digits.replace(
    /^(\d{7})(\d{2})(\d{4})(\d{1})(\d{2})(\d{4})$/,
    "$1-$2.$3.$4.$5.$6",
  );
}

function inferTribunalFromNumber(numero: string): string | null {
  const match = numero.match(/^\d{7}-\d{2}\.\d{4}\.(\d)\.(\d{2})\.\d{4}$/);
  if (!match) return null;
  const j = parseInt(match[1], 10);
  const tt = parseInt(match[2], 10);
  const codigoTribunal = j === 4 ? String(39 + tt) : String(tt);
  return TRIBUNAL_SIGLAS[codigoTribunal] ?? null;
}

function checkRateLimit(): void {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;

  while (requestTimestamps.length > 0 && requestTimestamps[0] < windowStart) {
    requestTimestamps.shift();
  }

  if (requestTimestamps.length >= RATE_LIMIT_MAX) {
    throw new DatajudError(
      "RATE_LIMIT",
      `Rate limit atingido: máximo de ${RATE_LIMIT_MAX} requisições por minuto`,
    );
  }

  requestTimestamps.push(now);
}

async function getCachedProcesso(
  numeroNormalizado: string,
): Promise<{ processo: ProcessoMetadata; fromCache: true } | null> {
  try {
    const doc = await adminDb
      .collection(CACHE_COLLECTION)
      .doc(numeroNormalizado)
      .get();

    if (!doc.exists) return null;

    const data = doc.data() as DatajudCacheEntry;
    const age = Date.now() - data.cachedAt;

    if (age > CACHE_TTL_MS) {
      return null;
    }

    return { processo: data.processo, fromCache: true };
  } catch (err) {
    console.warn("[datajud] Erro ao ler cache Firestore:", err);
    return null;
  }
}

async function setCachedProcesso(
  numeroNormalizado: string,
  processo: ProcessoMetadata,
): Promise<void> {
  try {
    const entry: DatajudCacheEntry = {
      processo,
      cachedAt: Date.now(),
      fromCache: true,
    };
    await adminDb
      .collection(CACHE_COLLECTION)
      .doc(numeroNormalizado)
      .set(entry);
  } catch (err) {
    console.warn("[datajud] Erro ao gravar cache Firestore:", err);
  }
}

function extractMetadata(source: DatajudProcesso): ProcessoMetadata {
  const poloAtivo: ProcessoMetadata["partes"]["poloAtivo"] = [];
  const poloPassivo: ProcessoMetadata["partes"]["poloPassivo"] = [];
  const outros: ProcessoMetadata["partes"]["outros"] = [];

  for (const parte of source.partes ?? []) {
    const entry = {
      nome: parte.nome,
      tipo: parte.tipo,
      documento: parte.documento,
    };
    const tipoParte = (parte.tipoParte ?? "").toLowerCase();
    if (
      tipoParte.includes("ativo") ||
      tipoParte.includes("autor") ||
      tipoParte.includes("requerente")
    ) {
      poloAtivo.push(entry);
    } else if (
      tipoParte.includes("passivo") ||
      tipoParte.includes("réu") ||
      tipoParte.includes("reu") ||
      tipoParte.includes("requerido")
    ) {
      poloPassivo.push(entry);
    } else {
      outros.push(entry);
    }
  }

  const movimentos = source.movimentos ?? [];
  const ultimoMovimento =
    movimentos.length > 0
      ? {
          nome: movimentos[0].nome,
          dataHora: movimentos[0].dataHora,
        }
      : undefined;

  return {
    numeroProcesso: source.numeroProcesso,
    tribunal: source.tribunal,
    dataDistribuicao: source.dataAjuizamento,
    dataUltimaAtualizacao: source.dataHoraUltimaAtualizacao,
    classeProcessual: source.classeProcessual?.nome,
    orgaoJulgador: source.orgaoJulgador?.nome,
    grau: source.grau,
    partes: { poloAtivo, poloPassivo, outros },
    assuntos: (source.assuntos ?? []).map((a) => a.nome),
    ultimoMovimento,
    valorCausa: source.valorCausa,
  };
}

export async function buscarProcesso(
  numero: string,
): Promise<{ processo: ProcessoMetadata; fromCache: boolean }> {
  const normalized = normalizeProcessNumber(numero);

  if (!validateProcessNumber(normalized)) {
    throw new DatajudError(
      "INVALID_NUMBER",
      `Número de processo inválido: "${numero}". Use o formato CNJ: NNNNNNN-DD.AAAA.J.TT.OOOO`,
    );
  }

  const cached = await getCachedProcesso(normalized);
  if (cached) {
    console.log(`[datajud] Cache HIT para ${normalized}`);
    return cached;
  }

  console.log(`[datajud] normalized="${normalized}" (input="${numero}")`);
  const tribunal = inferTribunalFromNumber(normalized);
  if (!tribunal) {
    throw new DatajudError(
      "INVALID_NUMBER",
      `Não foi possível inferir o tribunal a partir do número: "${numero}" (normalized: "${normalized}")`,
    );
  }

  checkRateLimit();

  const url = `${DATAJUD_BASE_URL}/api_publica_${tribunal}/_search`;
  const body = JSON.stringify({
    query: {
      match: {
        numeroProcesso: normalized,
      },
    },
  });

  const startedAt = Date.now();
  let status = 0;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30_000);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `APIKey ${DATAJUD_API_KEY}`,
      },
      body,
      signal: controller.signal,
    });

    status = response.status;
    const latency = Date.now() - startedAt;

    console.log(
      `[datajud] numero=${normalized} tribunal=${tribunal} status=${status} latency=${latency}ms`,
    );

    if (status === 404) {
      throw new DatajudError(
        "NOT_FOUND",
        `Processo não encontrado: ${normalized}`,
      );
    }

    if (!response.ok) {
      throw new DatajudError(
        "CONNECTION_ERROR",
        `Erro na API DATAJUD: HTTP ${status}`,
      );
    }

    const data: DatajudSearchResponse = await response.json();

    if (!data.hits?.hits?.length) {
      throw new DatajudError(
        "NOT_FOUND",
        `Processo não encontrado: ${normalized}`,
      );
    }

    const source = data.hits.hits[0]._source;
    const processo = extractMetadata(source);

    await setCachedProcesso(normalized, processo);

    return { processo, fromCache: false };
  } catch (err) {
    if (err instanceof DatajudError) throw err;

    const latency = Date.now() - startedAt;
    const isTimeout = (err as Error).name === "AbortError";

    console.error(
      `[datajud] ${isTimeout ? "Timeout" : "Erro de conexão"} numero=${normalized} tribunal=${tribunal} latency=${latency}ms`,
      err,
    );

    throw new DatajudError(
      "CONNECTION_ERROR",
      isTimeout
        ? `Timeout: a API DATAJUD não respondeu em 30s`
        : `Erro de conexão com a API DATAJUD: ${(err as Error).message}`,
    );
  } finally {
    clearTimeout(timeoutId);
  }
}
