export interface LanceResponse {
  id: number;
  timestamp: string; 
  valor: number; 
  lote?: {
    id: number;
    nome: string;
  };
  usuario?: {
    id: number;
    email: string;
    nome?: string;
  };
}

export interface LanceRequest {
  valor: number; 
  loteId: number; 
  usuarioId: number;
  id?: number; 
}

export interface LanceFormData {
  valor: number;
  loteId: string;
}
