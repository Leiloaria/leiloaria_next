export interface CategoriaRequest {
  nome: string;
  userId?: number;
}

export interface CategoriaResponse {
  id: number;
  nome: string;
  subcategorias?: CategoriaResponse[]; 
}
