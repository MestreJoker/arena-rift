-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.campeonatos (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  titulo text NOT NULL,
  tipo USER-DEFINED NOT NULL,
  status USER-DEFINED DEFAULT 'Aberto'::status_torneio,
  premio_total numeric DEFAULT 0,
  valor_inscricao numeric DEFAULT 0,
  vagas_max integer DEFAULT 16,
  descricao text,
  imagem_capa text,
  data_inicio timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT campeonatos_pkey PRIMARY KEY (id)
);
CREATE TABLE public.inscricoes (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  id_usuario text,
  id_campeonato uuid,
  id_time uuid,
  status USER-DEFINED DEFAULT 'Pendente'::status_inscricao,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT inscricoes_pkey PRIMARY KEY (id),
  CONSTRAINT inscricoes_id_campeonato_fkey FOREIGN KEY (id_campeonato) REFERENCES public.campeonatos(id),
  CONSTRAINT inscricoes_id_time_fkey FOREIGN KEY (id_time) REFERENCES public.teams(id),
  CONSTRAINT inscricoes_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.profiles(id)
);
CREATE TABLE public.partidas (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  id_campeonato uuid,
  competidor_a_profile_id text,
  competidor_a_team_id uuid,
  competidor_b_profile_id text,
  competidor_b_team_id uuid,
  vencedor_profile_id text,
  vencedor_team_id uuid,
  screenshot_url text,
  round_number integer NOT NULL,
  status_partida text DEFAULT 'Agendada'::text,
  CONSTRAINT partidas_pkey PRIMARY KEY (id),
  CONSTRAINT partidas_id_campeonato_fkey FOREIGN KEY (id_campeonato) REFERENCES public.campeonatos(id),
  CONSTRAINT partidas_competidor_a_team_id_fkey FOREIGN KEY (competidor_a_team_id) REFERENCES public.teams(id),
  CONSTRAINT partidas_competidor_b_team_id_fkey FOREIGN KEY (competidor_b_team_id) REFERENCES public.teams(id),
  CONSTRAINT partidas_vencedor_team_id_fkey FOREIGN KEY (vencedor_team_id) REFERENCES public.teams(id)
);
CREATE TABLE public.profiles (
  id text NOT NULL,
  username_discord text NOT NULL UNIQUE,
  nickname_wildrift text NOT NULL UNIQUE,
  avatar_url text,
  created_at timestamp with time zone DEFAULT now(),
  email text UNIQUE,
  CONSTRAINT profiles_pkey PRIMARY KEY (id)
);
CREATE TABLE public.teams (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL UNIQUE,
  captain_id text,
  logo_url text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT teams_pkey PRIMARY KEY (id),
  CONSTRAINT teams_captain_id_fkey FOREIGN KEY (captain_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.transacoes (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  id_usuario text,
  id_inscricao uuid,
  external_payment_id text UNIQUE,
  valor numeric NOT NULL,
  status USER-DEFINED DEFAULT 'pendente'::status_pagamento,
  metodo_pagamento text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT transacoes_pkey PRIMARY KEY (id),
  CONSTRAINT transacoes_id_inscricao_fkey FOREIGN KEY (id_inscricao) REFERENCES public.inscricoes(id),
  CONSTRAINT transacoes_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.profiles(id)
);