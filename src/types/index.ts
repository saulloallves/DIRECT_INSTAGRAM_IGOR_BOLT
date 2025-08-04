// Types for UNIDADES and DIRECT_INSTAGRAM only

export interface Unit {
  id: string;
  nome: string;
  codigo: string;
  localizacao: string;
  fase_atual_id: string;
  status: 'ativa' | 'inativa' | 'planejamento' | 'implementacao' | 'transicao' | 'erro';
  created_at: string;
  updated_at: string;
}

export interface DirectInstagram {
  id: string;
  unidade_id: string;
  id_ig_usuario: string;
  id_conta_instagram_unidade: string;
  bearer_token: string | null;
  mensagens: any;
  id_recipient: string | null;
  nome: string | null;
  whatsapp: string | null;
  pic: string | null;
  mensagens_nao_lidas: number;
  total_mensagens: number;
  status: 'ativa' | 'arquivada' | 'bloqueada';
  metadados: any;
  created_at: string;
  updated_at: string;
}
