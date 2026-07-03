export type DatajudErrorType =
  | "NOT_FOUND"
  | "CONNECTION_ERROR"
  | "RATE_LIMIT"
  | "INVALID_NUMBER";

export class DatajudError extends Error {
  constructor(
    public readonly type: DatajudErrorType,
    message: string,
  ) {
    super(message);
    this.name = "DatajudError";
  }
}

export interface DatajudParte {
  nome: string;
  tipo: string;
  tipoParte: string;
  documento?: string;
  advogados?: DatajudAdvogado[];
}

export interface DatajudAdvogado {
  nome: string;
  numeroOAB?: string;
  tipoRepresentante?: string;
}

export interface DatajudMovimento {
  codigo: number;
  nome: string;
  dataHora: string;
  complementosTabelados?: Array<{
    codigo: number;
    nome: string;
    valor: string;
  }>;
}

export interface DatajudAssunto {
  codigo: number;
  nome: string;
  principal?: boolean;
}

export interface DatajudProcesso {
  numeroProcesso: string;
  tribunal: string;
  dataAjuizamento?: string;
  dataHoraUltimaAtualizacao?: string;
  classeProcessual?: {
    codigo: number;
    nome: string;
  };
  orgaoJulgador?: {
    codigo?: number;
    nome: string;
    codigoMunicipioIBGE?: number;
  };
  grau?: string;
  formato?: {
    codigo: number;
    nome: string;
  };
  assuntos?: DatajudAssunto[];
  partes?: DatajudParte[];
  movimentos?: DatajudMovimento[];
  nivelSigilo?: number;
  prioridade?: string;
  valorCausa?: number;
}

export interface DatajudHit {
  _index: string;
  _id: string;
  _score: number | null;
  _source: DatajudProcesso;
}

export interface DatajudSearchResponse {
  hits: {
    total: {
      value: number;
      relation: string;
    };
    hits: DatajudHit[];
  };
}

export interface ProcessoMetadata {
  numeroProcesso: string;
  tribunal: string;
  dataDistribuicao?: string;
  dataUltimaAtualizacao?: string;
  classeProcessual?: string;
  orgaoJulgador?: string;
  grau?: string;
  partes: {
    poloAtivo: Array<{ nome: string; tipo: string; documento?: string }>;
    poloPassivo: Array<{ nome: string; tipo: string; documento?: string }>;
    outros: Array<{ nome: string; tipo: string; documento?: string }>;
  };
  assuntos: string[];
  ultimoMovimento?: {
    nome: string;
    dataHora: string;
  };
  valorCausa?: number;
}

export interface DatajudCacheEntry {
  processo: ProcessoMetadata;
  cachedAt: number;
  fromCache: true;
}
