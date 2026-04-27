import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabase } from "@/app/lib/supabase";

const isCancelledStatus = (status: unknown) =>
  typeof status === "string" &&
  ["cancelada", "cancelado"].includes(status.toLowerCase());

// GET: Listar inscrições do usuário
export async function GET(request: NextRequest) {
  try {
    console.log('GET /api/inscricoes - Headers:', Object.fromEntries(request.headers.entries()));
    
    const session = await getServerSession(authOptions);
    console.log('GET - Sessão obtida:', session ? 'Sim' : 'Não');
    console.log('GET - Dados da sessão:', session);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from("inscricoes")
      .select(`
        id,
        id_campeonato,
        status,
        created_at,
        campeonatos (
          id,
          titulo,
          status,
          data_inicio
        )
      `)
      .eq("id_usuario", session.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar inscrições:", error);
      return NextResponse.json(
        { error: "Erro ao buscar inscrições" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Erro na rota GET /inscricoes:", err);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// POST: Criar inscrição
export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/inscricoes - Iniciando...');
    console.log('Headers recebidos:', Object.fromEntries(request.headers.entries()));
    
    const session = await getServerSession(authOptions);
    console.log('Sessão obtida:', session ? 'Sim' : 'Não');
    console.log('Dados da sessão:', session);
    
    if (!session?.user?.id) {
      console.log('Usuário não autenticado');
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    console.log('Usuário autenticado:', session.user.id);

    const { id_campeonato } = await request.json();
    console.log('ID do campeonato:', id_campeonato);

    if (!id_campeonato) {
      return NextResponse.json(
        { error: "id_campeonato é obrigatório" },
        { status: 400 }
      );
    }

    // 1. Verificar se a inscrição já existe
    console.log('Verificando inscrição existente...');
    const { data: inscricaoExistente, error: erroExistente } = await supabase
      .from("inscricoes")
      .select("id")
      .eq("id_usuario", session.user.id)
      .eq("id_campeonato", id_campeonato)
      .maybeSingle();

    if (erroExistente) {
      console.error("Erro ao verificar inscrição existente:", erroExistente);
      return NextResponse.json(
        { error: "Erro ao verificar inscrição" },
        { status: 500 }
      );
    }

    if (inscricaoExistente) {
      console.log('Usuário já inscrito neste campeonato');
      return NextResponse.json(
        { error: "Você já está inscrito neste campeonato" },
        { status: 409 }
      );
    }

    console.log('Inscrição não existe, prosseguindo...');

    // 2. Buscar informações do campeonato
    console.log('Buscando informações do campeonato...');
    const { data: campeonato, error: erroCampeonato } = await supabase
      .from("campeonatos")
      .select("id, vagas_max, status")
      .eq("id", id_campeonato)
      .single();

    if (erroCampeonato || !campeonato) {
      console.error("Erro ao buscar campeonato:", erroCampeonato);
      return NextResponse.json(
        { error: "Campeonato não encontrado" },
        { status: 404 }
      );
    }

    console.log('Campeonato encontrado:', JSON.stringify(campeonato, null, 2));

    if (campeonato.status !== "Aberto" && campeonato.status !== "Em andamento") {
      console.log('Campeonato não aceita inscrições. Status:', campeonato.status);
      return NextResponse.json(
        { error: "Este campeonato não aceita inscrições no momento" },
        { status: 400 }
      );
    }

    // 3. Verificar vagas disponíveis
    console.log('Verificando vagas disponíveis...');
    const { data: inscricoesConfirmadasData, error: erroCount } = await supabase
      .from("inscricoes")
      .select("id, status")
      .eq("id_campeonato", id_campeonato);

    if (erroCount) {
      console.error("Erro ao contar inscrições:", {
        message: erroCount.message,
        code: erroCount.code,
        details: erroCount.details,
        hint: erroCount.hint,
      });
      return NextResponse.json(
        { error: "Erro ao verificar vagas", details: erroCount },
        { status: 500 }
      );
    }

    const inscricoesConfirmadas =
      inscricoesConfirmadasData?.filter(
        (item: any) => !isCancelledStatus(item.status)
      ).length ?? 0;

    console.log('Inscrições confirmadas:', inscricoesConfirmadas, 'Vagas max:', campeonato.vagas_max);

    if (inscricoesConfirmadas >= campeonato.vagas_max) {
      console.log('Campeonato lotado');
      return NextResponse.json(
        { error: "Este campeonato não possui mais vagas disponíveis" },
        { status: 400 }
      );
    }

    // 4. Criar inscrição como "Pendente" e depois confirmar (já que não há pagamento)
    console.log('Criando inscrição...');
    const { data: novaInscricao, error: erroInsercao } = await supabase
      .from("inscricoes")
      .insert({
        id_usuario: session.user.id,
        id_campeonato: id_campeonato,
      })
      .select();

    if (erroInsercao) {
      console.error("Erro detalhado ao criar inscrição:", JSON.stringify(erroInsercao, null, 2));
      return NextResponse.json(
        { error: "Erro ao criar inscrição", details: erroInsercao },
        { status: 500 }
      );
    }

    console.log('Inscrição criada com sucesso:', novaInscricao);

    return NextResponse.json(
      { message: "Inscrição realizada com sucesso!", data: novaInscricao },
      { status: 201 }
    );
  } catch (err) {
    console.error("Erro na rota POST /inscricoes:", err);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// DELETE: Cancelar inscrição
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const { id_inscricao } = await request.json();

    if (!id_inscricao) {
      return NextResponse.json(
        { error: "id_inscricao é obrigatório" },
        { status: 400 }
      );
    }

    // 1. Verificar se a inscrição pertence ao usuário
    const { data: inscricao, error: erroBusca } = await supabase
      .from("inscricoes")
      .select("id, id_usuario")
      .eq("id", id_inscricao)
      .single();

    if (erroBusca || !inscricao) {
      return NextResponse.json(
        { error: "Inscrição não encontrada" },
        { status: 404 }
      );
    }

    if (inscricao.id_usuario !== session.user.id) {
      return NextResponse.json(
        { error: "Você não tem permissão para cancelar esta inscrição" },
        { status: 403 }
      );
    }

    // 2. Cancelar inscrição (atualizar status, não deletar)
    const { error: erroAtualizacao } = await supabase
      .from("inscricoes")
      .update({ status: "cancelada" })
      .eq("id", id_inscricao);

    if (erroAtualizacao) {
      console.error("Erro ao cancelar inscrição:", erroAtualizacao);
      return NextResponse.json(
        { error: "Erro ao cancelar inscrição" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Inscrição cancelada com sucesso!" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Erro na rota DELETE /inscricoes:", err);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
