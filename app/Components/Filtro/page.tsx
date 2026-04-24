"use client"

interface FiltroProps {
  modoAtivo: string;
  setModo: (modo: string) => void;
  statusAtivo: string;
  setStatus: (status: string) => void;
  busca: string;
  setBusca: (busca: string) => void;
}

export default function FiltrosCampeonato({ 
  modoAtivo, setModo, statusAtivo, setStatus, busca, setBusca 
}: FiltroProps) {
  
  const modos = ["Todos os Modos", "1v1", "5v5"];
  const statusOpcoes = ["Todos os Status", "Aberto", "Em andamento", "Finalizado"];

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* BARRA DE BUSCA POR TEXTO */}
      <div className="relative w-full max-w-md">
        <input 
          type="text"
          placeholder="Buscar campeonato pelo nome..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full bg-[#141414] border border-white/5 rounded-xl py-3 px-5 text-sm text-white placeholder:text-gray-600 focus:border-[#cd6931]/50 focus:outline-none transition-all"
        />
        <svg className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        {/* FILTRO DE MODO */}
        <div className="flex bg-[#141414] p-1 rounded-lg border border-white/5">
          {modos.map((m) => (
            <button
              key={m}
              onClick={() => setModo(m)}
              className={`px-4 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${
                modoAtivo === m ? "bg-[#cd6931] text-white" : "text-gray-500 hover:text-white"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* FILTRO DE STATUS */}
        <div className="flex bg-[#141414] p-1 rounded-lg border border-white/5">
          {statusOpcoes.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-4 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${
                statusAtivo === s ? "bg-[#cd6931] text-white" : "text-gray-500 hover:text-white"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}