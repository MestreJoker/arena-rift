export interface CampeonatoDb {
  // Campos Identificadores e Controle
  id: string;
  created_at: string;
  
  // Campos de Conteúdo (Exibidos no Card e Detalhes)
  titulo: string;
  tipo: string;
  status: string;
  descricao: string | null;
  
  // Campos de Mídia
  imagem_capa: string | null; // URL que vem do Supabase Storage
  
  // Campos Numéricos/Dados Técnicos
  vagas_max: number | null;
  premio_total: number | null;
  data_inicio: string | null;

  // Campos calculados/formatados que o seu componente usa (Props do CampeonatoCard)
  // Adicionamos aqui para que você possa mapear os dados do banco sem erro
  jogadores?: string; 
  premio?: string;
  imagem?: string;
}

// Interface específica para o formulário de criação (Admin)
export interface CampeonatoFormData {
  titulo: string;
  tipo: string;
  status: string;
  vagas_max: number;
  premio_total: number;
  descricao: string;
  imagem_file: File | null;
}