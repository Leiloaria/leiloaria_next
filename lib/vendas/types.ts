export enum FormaPagamento {
  CARTAO = "CREDITO",
  PIX = "PIX",
}

export enum StatusPagamento {
  PENDENTE = "PENDING",
  APROVADO = "PAID",
  RECUSADO = "FAILED",
}

export enum BandeiraCartao {
  VISA = "VISA",
  MASTERCARD = "MASTER_CARD",
}

export interface VendaResponse {
  id: number;
  valor: number; 
  metodoPagamento?: {
    id: number;
    status: StatusPagamento;
  };
  lanceId: number;
  createdAt: string; 
  updatedAt: string;
}

export interface VendaRequest {
  formaPagamento: FormaPagamento;
  numeroCartao?: string;
  nomeTitular?: string;
  bandeira?: BandeiraCartao;
  diaVencimento?: number;
  anoVencimento?: number;
}

export interface UpdateVendaRequest {
  statusPagamento: StatusPagamento;
}