import { CondicaoItem, ItemRequest, UpdateItemRequest } from "@/lib/auctions/items";
import { VendaResponse } from "../vendas/types";
import { Usuario } from "../auth";


export enum StatusLeilao {
  ABERTO = "ABERTO",
  FINALIZADO = "FINALIZADO",
  CANCELADO = "CANCELADO",
  AGUARDANDO_PAGAMENTO = "AGUARDANDO_PAGAMENTO",
  PENDENTE = "PENDENTE",
}

export interface LeilaoRequest {
  nome: string;
  inicio: string;
  fim: string;
  prazoPagamento: string;
  lanceMinimo: number;
  descricao?: string;
  idUsuario: number;
  itens: ItemRequest[];
}


export interface UpdateLeilaoRequest {
  nome?: string;
  inicio?: string;
  fim?: string;
  prazoPagamento?: string;
  lanceMinimo?: number;
  descricao?: string;
  itens?: UpdateItemRequest[];
}

export interface UpdateLeilaoStatusRequest {
  status: StatusLeilao;
}

export interface LeilaoResponse {
  id: number;
  status: StatusLeilao;
  inicio: string;
  fim: string;
  prazoPagamento: string;
  lote: LoteResponse;
  proprietario: Usuario;
}

export interface LoteResponse {
  id: number;
  nome: string;
  descricao: string;
  lanceMinimo?: number;
  itens: ItemResponse[];
  lances?: LanceResponse[];
}

export interface LanceResponse {
  id: number;
  timestamp: string;
  valor: number;
  loteId: number;
  usuarioId: number;
  vendaId?: number;
}

export interface MeusLancesResponse{
  id: number;
  timestamp: string;
  valor: number;
  usuarioId: number;
  venda?: VendaResponse;
  leilao: LeilaoResponse;
  lote: {
    id: number;
    nome: string;
    descricao?: string;
    itens: ItemResponse[];
    status: StatusLeilao;
    fim: string;
    prazoPagamento: string;
  }
}

export interface ItemResponse {
  id: number;
  nome: string;
  descricao?: string;
  condicao?: string;
  imagens?: string[];
  categorias?: CategoriaResponse[];
}

export interface CategoriaResponse {
  id: number;
  nome: string;
  descricao?: string;
  subcategorias?: CategoriaResponse[];
}

export interface LeilaoFormData {
  nome: string;
  inicio: string;
  fim: string;
  prazoPagamento: string;
  lanceMinimo: string;
  descricao?: string;
  itens: ItemFormData[];
}

export interface ItemFormData {
  idItem?: number;
  nome: string;
  descricao?: string;
  condicao: CondicaoItem;
  imagens?: string[];
  categoriasId: number[];
}

export interface CancelarLeilaoRequest {
  userId: number;
}

export interface AvaliacaoRequest {
  id?: number;
  loteId: number;
  comentario?: string;
  stars: number;
}

export interface AvaliacaoResponse {
  id: number;
  comentario?: string;
  stars: number;
  usuario?: Usuario;
}