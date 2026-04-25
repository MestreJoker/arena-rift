'use client'

import { useState } from 'react';
import FiltrosCampeonato from "@/app/Components/Filtro/page";
import Footer from "@/app/Components/Footer/page";
import Header from "@/app/Components/Header/page";
import ListaCampeonatos from "@/app/Components/ListaCampeonatos/page";

export default function Campeonatos() {
  // Estados para controlar os filtros e a busca
  const [modo, setModo] = useState("Todos os Modos");
  const [status, setStatus] = useState("Todos os Status");
  const [busca, setBusca] = useState(""); // ADICIONADO: Estado para a barra de busca

  return (
    <main className="min-h-screen flex flex-col bg-[#0f0f0f]">
      <Header />

      {/* HERO ULTRA COMPACTO */}
      <section className="relative w-full h-[160px] sm:h-[200px] md:h-[240px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-[url('/images/imageHome5.jpg')] bg-cover bg-center"
          style={{ backgroundPosition: 'center 50%' }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/50 to-transparent"></div>

        <div className="relative z-10 text-center px-4 mt-4">
          <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter uppercase italic drop-shadow-2xl">
            CAMPEONATOS
          </h1>
          <div className="flex items-center justify-center gap-3 mt-1.5">
            <div className="w-6 h-[2px] bg-[#cd6931]"></div>
            <p className="text-gray-300 text-[10px] sm:text-xs font-bold uppercase tracking-[0.4em]">Arena Rift</p>
            <div className="w-6 h-[2px] bg-[#cd6931]"></div>
          </div>
        </div>
      </section>

      {/* CONTEÚDO */}
      <section className="flex-1 w-full max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-6 md:py-10">
        <div className="flex flex-col gap-6">
          {/* CORRIGIDO: Agora passamos o estado 'busca' e a função 'setBusca' real */}
          <FiltrosCampeonato 
            modoAtivo={modo} 
            setModo={setModo} 
            statusAtivo={status} 
            setStatus={setStatus}
            busca={busca}
            setBusca={setBusca}
          />
          
          <div className="w-full h-px bg-white/5"></div>

          {/* CORRIGIDO: Passamos a 'busca' para a lista filtrar os nomes */}
          <ListaCampeonatos 
            filtroModo={modo} 
            filtroStatus={status} 
            busca={busca} 
          />
        </div>
      </section>

      <Footer />
    </main>
  );
}