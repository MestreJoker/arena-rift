"use client"
import { useState, useEffect } from "react";
import Header from "@/app/Components/Header/page";
import Footer from "@/app/Components/Footer/page";
import ProfileHeader from "@/app/Components/ComponentesPerfilPage/ProfileHeader/page";
import ProfileStats from "@/app/Components/ComponentesPerfilPage/ProfileStats/page";
import ProfileTournaments from "@/app/Components/ComponentesPerfilPage/ProfileTournaments/page";
import LogoutButton from "@/app/Components/ComponentesPerfilPage/LogoutButton/page";

export default function PerfilPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen flex flex-col bg-[#0f0f0f]">
      <Header />

      {/* Container Principal com Animação de Entrada */}
      <section 
        className={`flex-1 w-full max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-12 transition-all duration-700 ease-out 
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar de Perfil (Esquerda) */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-[#141414] border border-white/5 rounded-2xl p-6 sticky top-24">
              <ProfileHeader />
              <div className="my-6 h-px bg-white/5"></div>
              <LogoutButton />
            </div>
          </aside>

          {/* Conteúdo Principal (Direita) */}
          <div className="lg:col-span-3 space-y-8">
            {/* Estatísticas do Jogador */}
            <section>
              <h2 className="text-[#cd6931] text-[10px] font-black uppercase tracking-[0.4em] mb-4">Desempenho</h2>
              <ProfileStats />
            </section>

            {/* Torneios Inscritos / Histórico */}
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-white text-xl font-black italic uppercase tracking-tighter">Meus Campeonatos</h2>
                <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">
                  Fase Beta
                </span>
              </div>
              <ProfileTournaments />
            </section>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}