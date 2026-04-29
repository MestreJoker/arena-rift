"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface ProfileTournamentsProps {
  userId: string;
}

interface Campeonato {
  id: string;
  titulo: string;
  status: string;
  data_inicio: string;
  valor_inscricao?: number | string | null;
  premio_total?: number | string | null;
}

interface InscricaoItem {
  id: string;
  status: string;
  created_at: string;
  campeonatos: Campeonato[];
}

const isCancelledStatus = (status?: string) =>
  typeof status === 'string' &&
  ['cancelada', 'cancelado'].includes(status.toLowerCase());

export default function ProfileTournaments({ userId }: ProfileTournamentsProps) {
  const [inscricoes, setInscricoes] = useState<InscricaoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchInscricoes = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/inscricoes');
      const data = await response.json();

      if (!response.ok) {
        console.error('Erro ao buscar inscrições:', data);
        setInscricoes([]);
        return;
      }

      setInscricoes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao buscar inscrições:', error);
      setInscricoes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;
    fetchInscricoes();
  }, [userId, fetchInscricoes]);

  const handleCancel = async (inscricaoId: string) => {
    if (!confirm('Deseja realmente cancelar esta inscrição?')) return;

    setCancellingId(inscricaoId);

    try {
      const response = await fetch('/api/inscricoes', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_inscricao: inscricaoId }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Erro ao cancelar inscrição:', result);
        alert(result.error || 'Não foi possível cancelar a inscrição.');
        return;
      }

      alert(result.message || 'Inscrição cancelada com sucesso.');
      fetchInscricoes();
    } catch (error) {
      console.error('Erro ao cancelar inscrição:', error);
      alert('Erro ao cancelar inscrição. Tente novamente.');
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) return <div className="text-white">Carregando campeonatos...</div>;

  if (inscricoes.length === 0) {
    return <div className="text-gray-500 text-center py-8">Você ainda não está inscrito em nenhum campeonato.</div>;
  }

  return (
    <div className="space-y-4">
      {inscricoes.map((item) => {
        const campeonato = Array.isArray(item.campeonatos) ? item.campeonatos[0] : item.campeonatos;
        if (!campeonato) return null;

        const started = new Date(campeonato.data_inicio).getTime() <= Date.now();
        const canCancel = !isCancelledStatus(item.status) && !started;

        return (
          <div key={item.id} className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#141414] p-4 shadow-lg shadow-black/10 transition-all hover:border-[#cd6931]/40 hover:bg-white/[0.02]">
            <Link href={`/campeonatos/${campeonato.id}`} className="absolute inset-0 z-0" aria-label={`Ver detalhes do campeonato ${campeonato.titulo}`} />
            <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-[#cd6931]/10 border border-[#cd6931]/20 text-[#cd6931] font-black">
                  WR
                </div>
                <div>
                  <p className="text-white text-base font-black tracking-tight">{campeonato.titulo}</p>
                  <p className="text-gray-400 text-sm">
                    {new Date(campeonato.data_inicio).toLocaleString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.3em] text-gray-300">
                    <span className="rounded-full bg-white/5 px-3 py-1">{campeonato.status}</span>
                    <span className="rounded-full bg-white/5 px-3 py-1">
                      Inscrição: {campeonato.valor_inscricao != null ? `R$ ${Number(campeonato.valor_inscricao).toFixed(2)}` : 'Grátis'}
                    </span>
                    <span className={`rounded-full px-3 py-1 ${isCancelledStatus(item.status) ? 'bg-red-500/10 text-red-300' : 'bg-green-500/10 text-green-200'}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative z-20 flex flex-col items-start gap-2 sm:items-end">
                <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500">
                  {isCancelledStatus(item.status)
                    ? 'Inscrição cancelada'
                    : started
                    ? 'Não é mais possível cancelar'
                    : 'Cancelar antes do início'}
                </span>
                <button
                  type="button"
                  disabled={!canCancel || cancellingId === item.id}
                  onClick={(event) => {
                    event.stopPropagation();
                    event.preventDefault();
                    handleCancel(item.id);
                  }}
                  className={`rounded-2xl border px-5 py-2 text-[11px] font-black uppercase tracking-[0.35em] transition-all ${
                    canCancel
                      ? 'border-[#cd6931] bg-[#cd6931] text-black hover:bg-[#e89a60]'
                      : 'cursor-not-allowed border-white/10 bg-white/5 text-gray-500'
                  }`}
                >
                  {cancellingId === item.id ? 'Cancelando...' : 'Cancelar'}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}