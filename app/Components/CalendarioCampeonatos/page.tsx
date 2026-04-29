"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import Link from "next/link";

interface CampeonatoCalendario {
  id: string;
  titulo: string;
  status: string;
  data_inicio: string | null;
  valor_inscricao: number | string | null;
}

function formatDate(dateString: string | null) {
  if (!dateString) return "Data indefinida";
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function CalendarioCampeonatos() {
  const [eventos, setEventos] = useState<CampeonatoCalendario[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventos = async () => {
      const { data, error } = await supabase
        .from("campeonatos")
        .select("id,titulo,status,data_inicio,valor_inscricao")
        .in("status", ["Aberto", "Em andamento"])
        .order("data_inicio", { ascending: true })
        .limit(6);

      if (error) {
        console.error("Erro ao carregar calendário de campeonatos:", error);
        setEventos([]);
      } else {
        setEventos(data ?? []);
      }
      setLoading(false);
    };

    fetchEventos();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
        <div>
          <p className="text-[#cd6931] text-[10px] font-black tracking-[0.4em] uppercase">Calendário</p>
          <h2 className="text-white text-3xl font-black uppercase">Próximos Campeonatos</h2>
        </div>
        <Link href="/campeonatos" className="text-gray-500 hover:text-[#cd6931] transition-colors font-bold text-[10px] tracking-widest uppercase border-b border-white/5 pb-1">
          Ver todos os eventos →
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-3xl border border-white/10 bg-[#141414] p-6 animate-pulse" />
          ))
        ) : eventos.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-[#141414] p-8 text-center text-gray-400">
            Nenhum campeonato em breve.
          </div>
        ) : (
          eventos.map((camp) => (
            <Link
              key={camp.id}
              href={`/campeonatos/${camp.id}`}
              className="group rounded-3xl border border-white/10 bg-[#141414] p-6 transition-all hover:border-[#cd6931]/50 hover:bg-white/[0.03]"
            >
              <div className="mb-4 text-[10px] uppercase tracking-[0.3em] text-gray-500">{formatDate(camp.data_inicio)}</div>
              <h3 className="text-white text-lg font-black leading-snug mb-4">{camp.titulo}</h3>
              <div className="flex items-center justify-between gap-3 text-sm text-gray-300">
                <span className="rounded-full bg-white/5 px-3 py-1 uppercase tracking-[0.25em]">{camp.status}</span>
                <span className="text-[#cd6931] font-black">{camp.valor_inscricao != null ? `R$ ${Number(camp.valor_inscricao).toFixed(2)}` : 'Grátis'}</span>
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}
