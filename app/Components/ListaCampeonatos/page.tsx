"use client"
import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { CampeonatoDb } from "@/app/lib/types";
import CampeonatoCard from "../CampeonatoCard/page";

interface ListaProps {
  filtroModo: string;
  filtroStatus: string;
  busca: string; 
}

export default function ListaCampeonatos({ filtroModo, filtroStatus, busca }: ListaProps) {
  const [campeonatos, setCampeonatos] = useState<CampeonatoDb[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchCampeonatos() {
      setLoading(true);
      const { data, error } = await supabase
        .from('campeonatos')
        .select('*');
      
      if (!error && data) {
        setCampeonatos(data as CampeonatoDb[]);
      }
      setLoading(false);
    }
    fetchCampeonatos();
  }, []);

  const campeonatosFiltrados = campeonatos.filter((camp) => {
    const bateModo = filtroModo === "Todos os Modos" || camp.tipo === filtroModo;
    const bateStatus = filtroStatus === "Todos os Status" || camp.status === filtroStatus;
    const bateBusca = camp.titulo.toLowerCase().includes(busca.toLowerCase());

    return bateModo && bateStatus && bateBusca;
  });

  if (loading) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-500 animate-pulse font-medium italic">Sincronizando com a Arena...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {campeonatosFiltrados.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {campeonatosFiltrados.map((camp) => (
            <CampeonatoCard 
              key={camp.id} 
              id={camp.id}
              titulo={camp.titulo}
              tipo={camp.tipo}
              status={camp.status}
              jogadores={camp.vagas_max ? `0/${camp.vagas_max}` : "0/16"}
              premio={camp.premio_total ? `R$ ${camp.premio_total.toLocaleString('pt-BR')}` : "A definir"}
              imagem={camp.imagem_capa || "/images/imageHome5.jpg"}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 border border-white/5 rounded-3xl bg-white/[0.02]">
          <p className="text-gray-500 font-medium italic">Nenhum campeonato encontrado para sua busca.</p>
        </div>
      )}
    </div>
  );
}