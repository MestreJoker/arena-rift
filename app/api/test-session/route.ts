import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: NextRequest) {
  try {
    console.log('GET /api/test-session - Headers:', Object.fromEntries(request.headers.entries()));

    const session = await getServerSession(authOptions);
    console.log('Test Session - Sessão obtida:', session ? 'Sim' : 'Não');
    console.log('Test Session - Dados da sessão:', JSON.stringify(session, null, 2));

    return NextResponse.json({
      authenticated: !!session,
      session: session,
      userId: session?.user?.id,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    // Verifica se 'err' é uma instância de Error para acessar .message com segurança
    const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
    
    console.error("Erro no teste de sessão:", err);
    return NextResponse.json(
      { error: "Erro interno do servidor", details: errorMessage },
      { status: 500 }
    );
  }
}