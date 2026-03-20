export interface Usuario {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  dataNascimento: string; 
  telefone: string[];
  ativo: boolean;
}

export interface UserRequest {
  nome: string;
  email: string;
  cpf: string;
  dataNascimento: string;
  telefone: string[];
}

export interface UserFormData {
  nome: string;
  email: string;
  cpf: string;
  dataNascimento: string; 
  telefone: string[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  username: string;
  email: string;
  password: string;
}

export interface RegisterFormDTO {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
}
