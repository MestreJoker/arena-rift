"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";

interface ProfileStatsProps {
  userId: string;
}

export default function ProfileStats({ userId }: ProfileStatsProps) {
  const [stats, setStats] = useState({
    campeonatos: 0,
    vitorias: 0,
    derrotas: 0,
    winrate: "0%",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchStats = async () => {
      try {
        // Contar torneios (inscrições do usuário)
        const { count: torneiosCount } = await supabase
          .from("inscricoes")
          .select("*", { count: "exact", head: true })
          .eq("id_usuario", userId);

        // Contar vitórias (partidas onde o usuário é vencedor)
        const { count: vitoriasCount } = await supabase
          .from("partidas")
          .select("*", { count: "exact", head: true })
          .or(`competidor_a_profile_id.eq.${userId},competidor_b_profile_id.eq.${userId}`)
          .eq("vencedor_profile_id", userId);

        // Contar derrotas (partidas onde o usuário participou mas não venceu)
        const { data: allPartidas } = await supabase
          .from("partidas")
          .select("vencedor_profile_id")
          .or(`competidor_a_profile_id.eq.${userId},competidor_b_profile_id.eq.${userId}`);

        const derrotasCount = allPartidas?.filter(p => p.vencedor_profile_id !== userId).length || 0;

        const totalPartidas = (vitoriasCount || 0) + derrotasCount;
        const winrate = (totalPartidas > 0 && vitoriasCount !== null) 
          ? Math.round((vitoriasCount / totalPartidas) * 100) + "%" 
          : "0%";

        setStats({
          campeonatos: torneiosCount || 0,
          vitorias: vitoriasCount || 0,
          derrotas: derrotasCount,
          winrate,
        });
      } catch (error) {
        console.error("Erro ao buscar estatísticas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userId]);

  if (loading) return <div className="text-white">Carregando estatísticas...</div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { label: "Torneios", value: stats.campeonatos },
        { label: "Vitórias", value: stats.vitorias, color: "text-green-500" },
        { label: "Derrotas", value: stats.derrotas, color: "text-red-500" },
        { label: "Win Rate", value: stats.winrate, color: "text-[#cd6931]" },
      ].map((stat, i) => (
        <div key={i} className="bg-[#141414] border border-white/5 p-5 rounded-2xl flex flex-col items-center justify-center transition-all hover:border-[#cd6931]/30 group">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1 group-hover:text-gray-400">
            {stat.label}
          </span>
          <p className={`text-2xl font-black italic uppercase tracking-tighter ${stat.color || "text-white"}`}>
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}