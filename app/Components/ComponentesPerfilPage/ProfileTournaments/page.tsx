"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";

interface ProfileTournamentsProps {
  userId: string;
}

interface Campeonato {
  id: string;
  titulo: string;
  status: string;
  data_inicio: string;
}

export default function ProfileTournaments({ userId }: ProfileTournamentsProps) {
  const [campeonatos, setCampeonatos] = useState<Campeonato[]>([]);
  const [loading, setLoading] = useState(true);

  const isRelevantStatus = (status: string | undefined) =>
    typeof status === 'string' &&
    [
      'Em andamento',
      'Finalizado',
      'Aberto',
      'aprovado',
      'pendente',
      'cancelada',
      'cancelado',
    ].includes(status.toLowerCase());

  useEffect(() => {
    if (!userId) return;

    const fetchCampeonatos = async () => {
      try {
        // Buscar inscrições aprovadas do usuário (ajuste status se necessário)
        const { data: inscricoes, error: inscError } = await supabase
          .from("inscricoes")
          .select(`
            id_campeonato,
            campeonatos (
              id,
              titulo,
              status,
              data_inicio
            )
          `)
          .eq("id_usuario", userId);

        if (inscError) {
          console.error("Erro ao buscar inscrições:", inscError);
          return;
        }

        // Filtrar campeonatos por status relevante (ajuste conforme seus enums)
        const filtered = (inscricoes || [])
          .filter((i) => Array.isArray(i?.campeonatos) && i.campeonatos.length > 0)
          .map((i) => i.campeonatos[0] as Campeonato)
          .filter((c) => isRelevantStatus(c.status));

        setCampeonatos(filtered);
      } catch (error) {
        console.error("Erro ao buscar campeonatos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampeonatos();
  }, [userId]);

  if (loading) return <div className="text-white">Carregando campeonatos...</div>;

  if (campeonatos.length === 0) {
    return <div className="text-gray-500 text-center py-8">Nenhum campeonato encontrado.</div>;
  }

  return (
    <div className="space-y-3">
      {campeonatos.map((c) => (
        <div
          key={c.id}
          className="group flex flex-col sm:flex-row justify-between items-center bg-[#141414] border border-white/5 p-4 rounded-2xl hover:bg-white/[0.02] transition-all"
        >
          <div className="flex items-center gap-4 w-full">
            <div className="w-10 h-10 rounded-xl bg-[#cd6931]/10 flex items-center justify-center border border-[#cd6931]/20">
               <span className="text-[#cd6931] font-black text-xs">WR</span>
            </div>
            <div>
              <p className="text-white font-black italic uppercase tracking-tighter text-sm">
                {c.titulo}
              </p>
              <div className="flex gap-3 items-center">
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">
                  {new Date(c.data_inicio).toLocaleDateString('pt-BR')}
                </span>
                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                  c.status === "Em andamento" ? "bg-green-500/10 text-green-500" :
                  c.status === "Finalizado" ? "bg-red-500/10 text-red-500" :
                  "bg-white/5 text-gray-500"
                }`}>
                  {c.status}
                </span>
              </div>
            </div>
          </div>

          <button className="mt-4 sm:mt-0 w-full sm:w-auto text-[10px] font-black uppercase tracking-widest border border-white/10 text-white px-6 py-2.5 rounded-lg hover:bg-[#cd6931] hover:border-[#cd6931] transition-all duration-300 shadow-lg shadow-black/20">
            Detalhes
          </button>
        </div>
      ))}
    </div>
  );
}