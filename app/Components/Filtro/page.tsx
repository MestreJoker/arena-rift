"use client"

interface FiltroProps {
    modoAtivo: string;
    setModo: (val: string) => void;
    statusAtivo: string;
    setStatus: (val: string) => void;
}

export default function FiltrosCampeonato({ modoAtivo, setModo, statusAtivo, setStatus }: FiltroProps) {
    const modos = ["Todos os Modos", "1v1", "5v5"];
    const statusOpcoes = ["Todos os Status", "Aberto", "Em andamento", "Finalizado"];

    return (
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-2 bg-[#141414] p-1 rounded-lg border border-white/5">
                {modos.map((m) => (
                    <button
                        key={m}
                        onClick={() => setModo(m)}
                        className={`px-4 py-2 rounded-md text-xs font-bold transition-all hover:cursor-pointer hover:scale-105 ${
                            modoAtivo === m 
                            ? "bg-[#cd6931] text-white" 
                            : "text-gray-400 hover:text-white"
                        }`}
                    >
                        {m}
                    </button>
                ))}
            </div>

            <div className="flex gap-2 bg-[#141414] p-1 rounded-lg border border-white/5">
                {statusOpcoes.map((s) => (
                    <button
                        key={s}
                        onClick={() => setStatus(s)}
                        className={`px-4 py-2 rounded-md text-xs font-bold transition-all hover:cursor-pointer hover:scale-105 ${
                            statusAtivo === s 
                            ? "bg-[#cd6931] text-white" 
                            : "text-gray-400 hover:text-white"
                        }`}
                    >
                        {s}
                    </button>
                ))}
            </div>
        </div>
    );
}