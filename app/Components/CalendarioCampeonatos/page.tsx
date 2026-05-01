"use client";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/app/lib/supabase";
import Link from "next/link";

interface Camp {
  id: string;
  titulo: string;
  tipo: string;
  status: string;
  data_inicio: string | null;
  vagas_max: number | null;
}

export default function CalendarioArena({ filtroModo = "Todos", filtroStatus = "Todos", busca = "" }) {
  const [eventos, setEventos] = useState<Camp[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [date, setDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("campeonatos").select("*").order("data_inicio");
      setEventos(data || []);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = useMemo(() => eventos.filter(c => 
    (filtroModo === "Todos" || c.tipo === filtroModo) &&
    (filtroStatus === "Todos" || c.status === filtroStatus) &&
    (c.titulo?.toLowerCase().includes(busca.toLowerCase()))
  ), [eventos, filtroModo, filtroStatus, busca]);

  const eventMap = useMemo(() => {
    const m = new Map<string, Camp[]>();
    filtered.forEach(c => {
      if (!c.data_inicio) return;
      const k = c.data_inicio.split("T")[0];
      m.set(k, [...(m.get(k) || []), c]);
    });
    return m;
  }, [filtered]);

  const nextEvents = useMemo(() => {
    const now = new Date();
    return filtered
      .filter(c => c.data_inicio && new Date(c.data_inicio) >= now)
      .sort((a, b) => new Date(a.data_inicio!).getTime() - new Date(b.data_inicio!).getTime())
      .slice(0, 4);
  }, [filtered]);

  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const startOffset = new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  return (
    <section className="w-full py-16 px-4 sm:px-12 max-w-[1400px] mx-auto relative font-sans antialiased">
      {/* Cabeçalho seguindo o padrão de "Destaques" */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-[#cd6931] text-[10px] font-black tracking-[0.4em] uppercase">Competitivo</h2>
          <h3 className="text-white text-3xl font-black italic uppercase">Calendário</h3>
        </div>
        <Link href="/campeonatos" className="text-gray-500 hover:text-[#cd6931] transition-colors font-bold text-[10px] tracking-widest uppercase border-b border-white/5 pb-1">
          Ver Todos →
        </Link>
      </div>

      {/* Grid Ajustado: Calendário (w-fit) e Lista Lateral (Expandida) */}
      <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch">
        
        {/* Lado Esquerdo: Calendário */}
        <div 
          className="rounded-xl bg-[#111] p-5 shadow-xl h-full w-fit flex-shrink-0"
          style={{ border: "2px solid #cd6931" }}
        >
          <div className="flex items-center justify-between mb-4 gap-4">
            <button onClick={() => setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1))} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition text-[12px] text-gray-300">
              ‹
            </button>
            <h3 className="text-[16px] font-extrabold uppercase tracking-[0.2em] text-white/90 text-center flex-1">
              {date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
            </h3>
            <button onClick={() => setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1))} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition text-[12px] text-gray-300">
              ›
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-3 text-[9px] font-black text-gray-600 uppercase text-center">
            {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(d => <div key={d} className="w-[48px]">{d}</div>)}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: startOffset + daysInMonth }).map((_, i) => {
              const d = i - startOffset + 1;
              if (d <= 0) return <div key={i} className="w-[48px] h-[48px]" />;
              
              const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
              const dayEvents = eventMap.get(key) || [];
              const isToday = key === new Date().toISOString().split("T")[0];
              const isActive = selectedDay === key;

              return (
                <button
                  key={key}
                  onClick={() => setSelectedDay(key)}
                  className={`relative w-[48px] h-[48px] rounded-md border-2 text-[13px] font-semibold transition-all flex items-center justify-center cursor-pointer
                    ${isActive ? "border-[#cd6931] bg-[#cd6931]/20 text-white shadow-lg" : "border-white/10 bg-white/5 hover:border-white/30 text-gray-400"}`}
                >
                  <span className={isToday ? "text-[#cd6931] font-bold" : ""}>{d}</span>
                  {dayEvents.length > 0 && !isActive && <span className="absolute bottom-1.5 w-1 h-1 bg-[#cd6931] rounded-full" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Lado Direito: Próximos Eventos (Mesma altura e largura maior) */}
        <div className="rounded-xl border border-white/5 bg-[#111] p-6 flex flex-col flex-grow min-w-[450px]">
          <div className="mb-6 border-b border-white/5 pb-4">
            <p className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] mb-1">Próximos Eventos</p>
            <h4 className="text-[18px] font-black italic text-[#cd6931] uppercase tracking-tighter">
              Agenda ArenaRift
            </h4>
          </div>

          <div className="space-y-4 overflow-y-auto pr-2 scrollbar-hide flex-grow">
            {loading ? (
              <div className="space-y-4">
                <div className="h-24 w-full animate-pulse bg-white/5 rounded-xl" />
                <div className="h-24 w-full animate-pulse bg-white/5 rounded-xl" />
              </div>
            ) : nextEvents.length > 0 ? (
              nextEvents.map(c => {
                const eventDate = new Date(c.data_inicio!);
                const day = String(eventDate.getDate()).padStart(2, "0");
                const month = eventDate.toLocaleDateString("pt-BR", { month: "short" }).toUpperCase().replace(".", "");
                const time = eventDate.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

                return (
                  <Link key={c.id} href={`/campeonatos/${c.id}`} className="group grid grid-cols-[85px_1fr] gap-4 rounded-xl border border-white/5 bg-white/[0.03] p-4 transition hover:border-[#cd6931]/40 hover:bg-white/[0.06]">
                    <div className="flex flex-col items-center justify-center rounded-lg bg-[#cd6931]/10 border border-[#cd6931]/20 p-2 text-center h-[70px]">
                      <span className="text-[22px] font-black leading-none text-white">{day}</span>
                      <span className="text-[11px] uppercase text-[#cd6931] font-black tracking-widest">{month}</span>
                    </div>
                    <div className="flex flex-col justify-center min-w-0">
                      <h5 className="text-[15px] font-black uppercase italic truncate text-white group-hover:text-[#cd6931] transition-colors tracking-tight">
                        {c.titulo}
                      </h5>
                      <div className="flex items-center gap-3 mt-2">
                        <p className="text-[11px] text-gray-400 uppercase font-bold">
                          {c.tipo} • {time}
                        </p>
                        <span className="text-[10px] text-[#cd6931] font-black uppercase border-l border-white/10 pl-3">
                          {c.vagas_max ? `${c.vagas_max} Vagas` : "Ilimitado"}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center h-full opacity-30 text-center py-10">
                <p className="text-[12px] uppercase font-black tracking-[0.3em]">Nenhum evento futuro</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}