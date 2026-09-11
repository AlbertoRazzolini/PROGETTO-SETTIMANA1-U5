export interface PoiResp {
  id: string;
  latitudine: number;
  longitudine: number;
  indirizzo: string | null;
}

export interface FotoResp {
  id: string;
  contenuto: string;
  grandezza: number;
  createdAt: string;
  postId: string;
}

export interface PostResp {
  id: string;
  titolo: string;
  descrizione: string;
  createdAt: string;
  poi: PoiResp | null;
  foto: FotoResp[];
}

export interface DocumentoResp {
  id: string;
  titolo: string;
  contenuto: string;
  testo: string | null;
  immagineBase64: string | null;
  grandezza: number;
  createdAt: string;
}

export interface NewFotoInPost {
  contenuto: string;
  grandezza: number;
}

export interface NewPostBody {
  titolo: string;
  descrizione: string;
  poiId?: string | null;
  foto?: NewFotoInPost[];
}

export interface UpdatePostBody {
  titolo?: string;
  descrizione?: string;
  poiId?: string;
}

export interface NewFotoBody {
  contenuto: string;
  grandezza: number;
  postId: string;
}

export interface UpdateFotoBody {
  contenuto?: string;
  grandezza?: number;
}

export interface NewPoiBody {
  latitudine: number;
  longitudine: number;
  indirizzo?: string | null;
}

export interface UpdateDocumentoBody {
  titolo?: string;
  testo?: string;
}
