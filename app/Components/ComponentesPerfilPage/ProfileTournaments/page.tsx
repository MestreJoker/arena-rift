"use client";

interface ProfileTournamentsProps {
  userId: string;
}

export default function ProfileTournaments({ userId }: ProfileTournamentsProps) {
  const campeonatos = [
    { id: 1, nome: "Copa Wild Rift #1", status: "Em andamento", data: "25 Abr" },
    { id: 2, nome: "Liga Semanal ArenaRift", status: "Finalizado", data: "18 Abr" },
  ];

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
                {c.nome}
              </p>
              <div className="flex gap-3 items-center">
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">
                  {c.data}
                </span>
                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                  c.status === "Em andamento" ? "bg-green-500/10 text-green-500" : "bg-white/5 text-gray-500"
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