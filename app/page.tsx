'use client'
import Image from "next/image";
import Header from "./Components/Header/page";
import Botao from "./Components/Botao/page";
import InfosHome from "./Components/InfosHome/page";
import Footer from "./Components/Footer/page";
import CardsHome from "./Widgets/CardsHome";
import AuthModal from "./Components/Modal/page";
import { useEffect, useState } from "react";
import CarrosselCampeonatos from "./Components/CarrosselCampeonato/page";
import CalendarioCampeonatos from "./Components/CalendarioCampeonatos/page";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);
  
  return (
    <main className="min-h-screen flex flex-col max-w-full overflow-x-hidden">
      <Header />

      <section id="content" className="w-full max-w-[3840px] mx-auto flex-1 relative">
        <div
          id="topo"
          className="relative bg-[url('/images/imageHome5.jpg')] bg-cover bg-center 
                     min-h-[500px] sm:min-h-[600px] md:h-screen md:max-h-[900px] 
                     pt-16 sm:pt-20 md:pt-25
                     before:absolute before:inset-0 before:bg-gradient-to-t 
                     before:from-black before:via-black/70 before:to-transparent
                     before:pointer-events-none"
        >
          {/* Degradê nas laterais para telas > 3840px */}
          <div className="hidden min-[3840px]:block absolute inset-0 pointer-events-none z-[5]">
            {/* Degradê esquerdo */}
            <div className="absolute top-0 left-0 w-[300px] h-full 
                           bg-gradient-to-r from-black via-black/80 to-transparent"></div>
            {/* Degradê direito */}
            <div className="absolute top-0 right-0 w-[300px] h-full 
                           bg-gradient-to-l from-black via-black/80 to-transparent"></div>
          </div>

          {/* Conteúdo com z-index maior para ficar acima do degradê */}
          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
            <h1
              id="tituloPrincipal"
              className={`text-white text-4xl lg:text-5xl 
             xl:text-6xl 2xl:text-7xl pt-8 sm:pt-6 md:-mt-10
             text-center leading-tight sm:leading-snug md:leading-normal
             transition-all duration-700 ease-out
             ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
              Faça parte de campeonatos <br className="hidden sm:block" /> de{' '}
              <span className="text-orange-400 font-bold">
                wild<span className="px-0.5 text-transparent">.</span>rift
              </span>
            </h1>

            <p
              id="subtituloPrincipal"
              className={`text-center text-xs sm:text-sm md:text-[0.7rem] text-white 
             mt-3 sm:mt-4 w-full max-w-[90%] sm:max-w-[80%] md:max-w-[70%] 
             mx-auto px-4
             transition-all duration-700 ease-out delay-150
             ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
              TESTE SUAS HABILIDADES E AVANÇE ATÉ O FINAL
            </p>

            <div className={`flex justify-center mt-6 sm:mt-8 md:mt-10
                            transition-all duration-700 ease-out delay-300
                            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <Botao texto={"PARTICIPAR AGORA"} />
            </div>

            <InfosHome />
          </div>
        </div>

        <CardsHome />
        <CarrosselCampeonatos />
        <CalendarioCampeonatos />
      </section>

      <div id="bgFooter" className="w-full mt-6">
        <Footer />
      </div>
    </main>
  );
}