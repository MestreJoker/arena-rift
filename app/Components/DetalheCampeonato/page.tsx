"use client"
import { useState } from 'react';
import AuthModal from '../Modal/page';

interface Props {
  id: string;
}

export default function DetalheCampeonato({ id }: Props) {
  // Estados para gerenciar a funcionalidade do botão e modal
  const [isParticipating, setIsParticipating] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Simulação para o MVP

  const campeonatos = [
    {
      id: "0",
      titulo: "1v1 Desafio Supremo",
      tipo: "1v1",
      status: "Aberto",
      jogadores: "12/16",
      premio: "R$100",
      descricao: "Mostre sua habilidade em combates diretos e prove que você é o melhor no Wild Rift.",
      imagem: "/images/imageHome5.jpg",
      participantes: ["Victor", "Gabriel", "Marcos", "Lucas", "Rafael", "Bruno", "Thiago", "Felipe", "Diego", "Enzo", "Valentina", "Arthur"]
    },
    {
      id: "1",
      titulo: "5v5 Arena Elite",
      tipo: "5v5",
      status: "Em andamento",
      jogadores: "8/10",
      premio: "R$300",
      descricao: "Monte sua equipe e lute pela vitória na arena competitiva mais disputada.",
      imagem: "/images/imageHome5.jpg",
      participantes: ["Time Alpha", "Time Bravo", "Time Charlie", "Time Delta", "Time Echo", "Time Foxtrot", "Time Golf", "Time Hotel"]
    },
    {
      id: "2",
      titulo: "1v1 Rápido",
      tipo: "1v1",
      status: "Aberto",
      jogadores: "6/16",
      premio: "R$50",
      descricao: "Duelos rápidos focados em mecânica pura. Vença e suba no ranking.",
      imagem: "/images/imageHome5.jpg",
      participantes: ["Katarina Main", "Yasuo007", "ZedGod", "LuxSupp", "JinxCarry", "ViEnforcer"]
    }
  ];

  const campeonato = campeonatos.find((item) => item.id === id);

  if (!campeonato) {
    return (
      <div className="flex-1 flex items-center justify-center text-white py-20">
        <p className="text-gray-400 font-bold uppercase tracking-widest">Campeonato não encontrado.</p>
      </div>
    );
  }

  // Função para lidar com a inscrição
  const handleJoin = () => {
    if (!isLoggedIn) {
      setIsAuthModalOpen(true);
    } else {
      setIsParticipating(!isParticipating);
    }
  };

  return (

    <div className="flex-1 bg-[#0f0f0f]">
      {/* Botão Voltar */}
      <div className="max-w-7xl mx-auto px-5 pt-6 absolute mt-20 z-1000">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-white hover:text-[#cd6931] hover:cursor-pointer transition-colors group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="group-hover:-translate-x-1 transition-transform"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Voltar para campeonatos</span>
        </button>
      </div>
      {/* HERO REDUZIDO */}
      <div className="relative h-[200px] md:h-[280px] w-full overflow-hidden">
        <img
          src={campeonato.imagem}
          className="w-full h-full object-cover opacity-40"
          alt={campeonato.titulo}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/60 to-transparent"></div>

        <div className="absolute bottom-6 left-0 w-full px-5 md:px-10 max-w-7xl mx-auto right-0">
          <span className="text-[#cd6931] text-[10px] font-black uppercase tracking-[0.3em]">
            {campeonato.tipo} • Wild Rift
          </span>
          <h1 className="text-white text-2xl md:text-4xl font-black italic uppercase tracking-tighter mt-1">
            {campeonato.titulo}
          </h1>
        </div>
      </div>

      {/* GRID RESPONSIVO */}
      <div className="max-w-7xl mx-auto px-5 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8 text-white">

        {/* COLUNA DA ESQUERDA: Descrição e Participantes */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#141414] p-6 rounded-xl border border-white/5">
            <h2 className="text-[#cd6931] font-bold uppercase text-[10px] mb-3 tracking-widest">Sobre o Torneio</h2>
            <p className="text-gray-300 text-sm leading-relaxed italic">
              {campeonato.descricao}
            </p>
          </div>

          <div className="bg-[#141414] rounded-xl border border-white/5 overflow-hidden">
            <div className="p-4 border-b border-white/5 flex justify-between items-center">
              <h2 className="text-white font-bold uppercase text-[10px] tracking-widest">Participantes Inscritos</h2>
              <span className="bg-white/5 px-2 py-1 rounded text-[10px] text-gray-400">
                {isParticipating ? "Você e mais " : ""}{campeonato.jogadores}
              </span>
            </div>

            <div className="h-[250px] overflow-y-auto p-2 custom-scroll">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* Simulando você na lista se estiver participando */}
                {isParticipating && (
                  <div className="flex items-center gap-3 bg-[#cd6931]/20 p-3 rounded-lg border border-[#cd6931]/30">
                    <div className="w-8 h-8 rounded-full bg-[#cd6931] flex items-center justify-center font-bold text-xs text-white">G</div>
                    <span className="text-sm font-bold text-[#cd6931]">Gabriel (Você)</span>
                  </div>
                )}
                {campeonato.participantes.map((player, index) => (
                  <div key={index} className="flex items-center gap-3 bg-white/5 p-3 rounded-lg hover:bg-white/10 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs text-gray-400">
                      {player[0]}
                    </div>
                    <span className="text-sm font-medium">{player}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* COLUNA DA DIREITA: Sidebar de Ações */}
        <div className="space-y-4">
          <div className="bg-[#141414] p-6 rounded-xl border border-white/10 sticky top-24">
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <span className="text-gray-500 text-[10px] uppercase font-bold tracking-tighter">Status atual</span>
                <span className="text-green-500 text-xs font-black uppercase italic">{campeonato.status}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <span className="text-gray-500 text-[10px] uppercase font-bold tracking-tighter">Premiação Total</span>
                <span className="text-[#cd6931] text-sm font-black italic">{campeonato.premio}</span>
              </div>
            </div>

            <button
              onClick={handleJoin}
              className={`w-full py-4 rounded-xl font-black transition-all uppercase text-xs tracking-widest shadow-lg active:scale-95 hover:cursor-pointer hover:scale-103 ${isParticipating
                  ? "bg-green-600 text-white shadow-none"
                  : "bg-[#cd6931] text-white hover:bg-[#b05a2a] shadow-[#cd6931]/20"
                }`}
            >
              {isParticipating ? "✓ Inscrito" : "Inscrever-se agora"}
            </button>
            <p className="text-[9px] text-gray-500 text-center mt-4 uppercase tracking-tighter">
              Acesso via Discord Obrigatório
            </p>
          </div>
        </div>
      </div>

      {/* Inclusão do Modal de Autenticação */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

    </div>
  );
}