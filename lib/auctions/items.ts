export enum CondicaoItem {
  NOVO = "NOVO",
  SEMI_NOVO = "SEMI_NOVO",
  USADO = "USADO",
  AVARIADO = "AVARIADO",
}

export interface ItemRequest {
  nome: string; 
  descricao?: string; 
  condicao: CondicaoItem;
  imagens?: string[];
  categoriasId: number[]; 
}

export interface UpdateItemRequest {
  idItem: number;
  nome?: string;
  descricao?: string; 
  condicao?: CondicaoItem;
  imagens?: string[];
  categoriasId?: number[];
}

export interface ItemResponse {
  id: number;
  nome: string;
  descricao?: string;
  condicao: CondicaoItem;
  imagens?: string[];
  categorias?: Array<{
    id: number;
    nome: string;
  }>;
}
