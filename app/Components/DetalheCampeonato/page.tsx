"use client"
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { supabase } from '@/app/lib/supabase';
import { CampeonatoDb } from '@/app/lib/types';
import AuthModal from '../Modal/page';

interface Props {
  id: string;
}

export default function DetalheCampeonato({ id }: Props) {
  const [campeonato, setCampeonato] = useState<CampeonatoDb | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isParticipating, setIsParticipating] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const { data: session, status } = useSession();
  const isLoggedIn = status === 'authenticated';
  const isSessionLoading = status === 'loading';

  const isCancelledStatus = (statusValue: string | undefined) =>
    typeof statusValue === 'string' &&
    ['cancelada', 'cancelado'].includes(statusValue.toLowerCase());

  useEffect(() => {
    async function getCampeonato() {
      const { data, error } = await supabase
        .from('campeonatos')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        setCampeonato(data as CampeonatoDb);
      }
      setLoading(false);
      setTimeout(() => setIsVisible(true), 100);
    }
    getCampeonato();
  }, [id]);

  useEffect(() => {
    if (!isLoggedIn) {
      setIsParticipating(false);
      return;
    }

    const checkParticipation = async () => {
      try {
        const response = await fetch('/api/inscricoes', { credentials: 'include' });
        if (!response.ok) return;

        const result = await response.json();
        const inscricoes = Array.isArray(result) ? result : result.data || [];
        const activeInscricao = inscricoes.find(
          (item: any) =>
            item.id_campeonato === id &&
            !isCancelledStatus(item.status)
        );
        setIsParticipating(Boolean(activeInscricao));
      } catch (error) {
        console.error('Erro ao verificar inscrição:', error);
      }
    };

    checkParticipation();
  }, [id, isLoggedIn]);

  if (loading) return <div className="flex-1 py-20 text-center text-white italic">Carregando detalhes da arena...</div>;
  if (!campeonato) return <div className="flex-1 py-20 text-center text-white">Campeonato não encontrado.</div>;

  const handleJoin = async () => {
    console.log('HandleJoin - Status da sessão:', status);
    console.log('HandleJoin - Sessão:', session);
    console.log('HandleJoin - isLoggedIn:', isLoggedIn);
    
    if (isSessionLoading) {
      console.log('Sessão ainda carregando...');
      return;
    }

    if (!isLoggedIn) {
      console.log('Usuário não logado, abrindo modal');
      setIsAuthModalOpen(true);
      return;
    }

    if (isParticipating) {
      console.log('Usuário já inscrito');
      return;
    }

    console.log('Fazendo inscrição...');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/inscricoes', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_campeonato: id }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || 'Erro ao inscrever no campeonato.');
        return;
      }

      setIsParticipating(true);
    } catch (error) {
      console.error('Erro ao inscrever no campeonato:', error);
      alert('Erro ao inscrever no campeonato.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`flex-1 transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* DEBUG INFO - REMOVER DEPOIS */}
      <div className="bg-red-500 text-white p-2 text-xs">
        DEBUG: Status={status}, LoggedIn={isLoggedIn ? 'YES' : 'NO'}, Session={session ? 'YES' : 'NO'}
      </div>
      
      {/* HEADER DO CAMPEONATO */}
      <section className="relative w-full h-[300px] md:h-[450px] overflow-hidden">
        <img 
          src={campeonato.imagem_capa || "/images/imageHome5.jpg"} 
          className="w-full h-full object-cover" 
          alt={campeonato.titulo} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
          <div className="max-w-7xl mx-auto">
            <span className="bg-[#cd6931] text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-widest">
              {campeonato.status}
            </span>
            <h1 className="text-white text-3xl md:text-6xl font-black mt-4 uppercase italic">
              {campeonato.titulo}
            </h1>
          </div>
        </div>
      </section>

      {/* INFO ADICIONAL */}
      <section className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-8">
          <div>
            <h2 className="text-[#cd6931] text-xl font-bold uppercase mb-4 tracking-tighter">Sobre o Torneio</h2>
            <p className="text-gray-400 leading-relaxed text-lg">
              {campeonato.descricao || "Participe da maior competição de Wild Rift. Regras oficiais do Open Series 2026 aplicadas."}
            </p>
          </div>
        </div>

        <div className="bg-[#141414] p-8 rounded-3xl border border-white/5 h-fit sticky top-24">
          <div className="space-y-6 mb-8">
            <div className="flex justify-between border-b border-white/5 pb-4">
              <span className="text-gray-500 uppercase text-xs font-bold">Modo</span>
              <span className="text-white font-bold">{campeonato.tipo}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-4">
              <span className="text-gray-500 uppercase text-xs font-bold">Premiação</span>
              <span className="text-[#cd6931] font-black">
                {campeonato.premio_total ? `R$ ${campeonato.premio_total.toLocaleString('pt-BR')}` : "A consultar"}
              </span>
            </div>
          </div>

          <button 
            onClick={handleJoin}
            disabled={isSubmitting || isSessionLoading}
            className={`w-full py-4 rounded-xl font-black uppercase tracking-widest transition-all duration-300 ${
              isParticipating 
                ? 'bg-transparent border-2 border-green-500 text-green-500' 
                : 'bg-[#cd6931] hover:bg-[#b55a2a] text-white shadow-[0_0_20px_rgba(205,105,49,0.3)]'} ${isSubmitting || isSessionLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {isParticipating ? 'Inscrito com Sucesso' : isSubmitting ? 'Inscrevendo...' : 'Inscrever-se Agora'}
          </button>
        </div>
      </section>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}