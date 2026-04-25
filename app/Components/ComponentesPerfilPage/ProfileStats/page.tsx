"use client";

interface ProfileStatsProps {
  userId: string;
}

export default function ProfileStats({ userId }: ProfileStatsProps) {
  // No futuro, você usará o userId para buscar esses dados no Supabase
  const stats = {
    campeonatos: 5,
    vitorias: 12,
    derrotas: 7,
    winrate: "63%",
  };

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