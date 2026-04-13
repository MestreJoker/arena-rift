'use client'


import FiltrosCampeonato from "@/app/Components/Filtro/page";
import Footer from "@/app/Components/Footer/page";
import Header from "@/app/Components/Header/page";
import ListaCampeonatos from "@/app/Components/ListaCampeonatos/page";

export default function Campeonatos() {
  return (
    <main className="min-h-screen flex flex-col bg-[#0f0f0f]">
      <Header />

      {/* HERO */}
      <section className="relative w-full h-[300px] sm:h-[350px] md:h-[400px] 
                          bg-[url('/images/imageHome5.jpg')] bg-cover bg-center
                          flex items-center justify-center">

        <div className="absolute inset-0 bg-gradient-to-t 
                        from-black via-black/70 to-transparent"></div>

        <div className="relative z-10 text-center">
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold">
            CAMPEONATOS
          </h1>
          <p className="text-gray-300 mt-2 text-sm sm:text-base">
            Escolha onde provar seu valor
          </p>
        </div>
      </section>

      {/* CONTEÚDO */}
      <section className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <FiltrosCampeonato />
        <ListaCampeonatos />
      </section>

      <Footer />
    </main>
  );
}