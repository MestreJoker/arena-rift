"use client";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/app/lib/supabase";
import Link from "next/link";

interface Camp {
  id: string; titulo: string; tipo: string; status: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data_inicio: string | null; valor_inscricao: any; premio_total: any;
  vagas_max: number | null;
}

export default function CalendarioCampeonatos({ filtroModo = "Todos", filtroStatus = "Todos", busca = "" }) {
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

  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const startOffset = new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  return (
    <section className="text-left max-w-5xl py-8 px-4 font-sans antialiased text-white">
      <header className="mb-6 flex items-end justify-between border-l-2 border-[#cd6931] pl-4">
        <div>
          <span className="text-[10px] font-bold tracking-[0.3em] text-[#cd6931] uppercase">Agenda</span>
          <h2 className="text-2xl font-black uppercase tracking-tight">Campeonatos</h2>
        </div>
        <Link href="/campeonatos" className="text-[10px] font-bold uppercase text-gray-500 hover:text-[#cd6931] transition-colors">
          Ver Tudo →
        </Link>
      </header>

      <div className="grid gap-4 md:grid-cols-[1fr_320px]">
        {/* Calendário */}
        <div className="rounded-2xl border border-white/5 bg-[#111] p-4 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-black uppercase tracking-widest italic">
              {date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
            </h3>
            <div className="flex gap-1">
              <button onClick={() => setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1))} className="p-2 hover:bg-white/5 rounded-lg transition">‹</button>
              <button onClick={() => setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1))} className="p-2 hover:bg-white/5 rounded-lg transition">›</button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2 text-[9px] font-bold text-gray-600 uppercase text-center">
            {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(d => <div key={d}>{d}</div>)}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: startOffset + daysInMonth }).map((_, i) => {
              const d = i - startOffset + 1;
              if (d <= 0) return <div key={i} className="aspect-square bg-white/[0.02] rounded-md" />;
              
              const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
              const dayEvents = eventMap.get(key) || [];
              const isToday = key === new Date().toISOString().split("T")[0];
              const isActive = selectedDay === key;

              return (
                <button
                  key={key}
                  onClick={() => setSelectedDay(key)}
                  className={`relative aspect-square rounded-md border text-xs font-bold transition-all flex flex-col items-center justify-center
                    ${isActive ? "border-[#cd6931] bg-[#cd6931]/20" : "border-white/5 bg-white/5 hover:border-white/20"}
                    ${dayEvents.length > 0 && !isActive ? "border-[#cd6931]/30" : ""}`}
                >
                  <span className={isToday ? "text-[#cd6931]" : ""}>{d}</span>
                  {dayEvents.length > 0 && (
                    <span className="absolute bottom-1 h-1 w-1 rounded-full bg-[#cd6931]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Lista Lateral */}
        <div className="rounded-2xl border border-white/5 bg-[#111] p-5">
          <div className="mb-4 border-b border-white/5 pb-2">
            <p className="text-[9px] font-bold uppercase text-gray-500 tracking-tighter">Eventos Selecionados</p>
            <h4 className="text-xs font-bold text-white/60 uppercase italic">{selectedDay || "Clique em uma data"}</h4>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[340px] pr-2 scrollbar-hide">
            {loading ? (
              <div className="h-12 w-full animate-pulse bg-white/5 rounded-xl" />
            ) : (eventMap.get(selectedDay || "") || []).length > 0 ? (
              eventMap.get(selectedDay!)?.map(c => (
                <Link key={c.id} href={`/campeonatos/${c.id}`} className="group block rounded-xl border border-white/5 bg-black/40 p-3 transition hover:border-[#cd6931]/50">
                  <h5 className="text-[11px] font-black uppercase leading-tight group-hover:text-[#cd6931] transition-colors">{c.titulo}</h5>
                  <div className="mt-2 flex items-center justify-between text-[9px] text-gray-500 font-bold uppercase tracking-tighter">
                    <span>{c.tipo}</span>
                    <span className="text-[#cd6931]">{c.vagas_max} Vagas</span>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-[10px] text-gray-600 italic">Nenhum evento para este dia.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}