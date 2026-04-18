'use client'
import { useState } from "react"
import Link from "next/link"
import CampeonatoCard from "../CampeonatoCard/page"

export default function CarrosselCampeonatos() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const campeonatos = [
        { id: "0", titulo: "1v1 Desafio Supremo", tipo: "1v1", status: "Aberto", jogadores: "12/16", premio: "R$100", imagem: "/images/imageHome5.jpg" },
        { id: "1", titulo: "5v5 Arena Elite", tipo: "5v5", status: "Em andamento", jogadores: "8/10", premio: "R$300", imagem: "/images/imageHome5.jpg" },
        { id: "2", titulo: "1v1 Rápido", tipo: "1v1", status: "Aberto", jogadores: "6/16", premio: "R$50", imagem: "/images/imageHome5.jpg" },
        { id: "3", titulo: "Copa Wild Rift #1", tipo: "5v5", status: "Aberto", jogadores: "4/16", premio: "R$500", imagem: "/images/imageHome5.jpg" },
        { id: "4", titulo: "Duelo de Titãs", tipo: "1v1", status: "Em andamento", jogadores: "14/16", premio: "R$200", imagem: "/images/imageHome5.jpg" },
        { id: "5", titulo: "Liga Semanal", tipo: "5v5", status: "Aberto", jogadores: "2/8", premio: "R$150", imagem: "/images/imageHome5.jpg" },
    ];

    // Ajuste de visibilidade: 3 no PC, 2 no Tablet, 1 no Mobile
    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1 >= campeonatos.length ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 < 0 ? campeonatos.length - 1 : prev - 1));
    };

    return (
        <section className="w-full py-16 px-4 sm:px-12 max-w-[1400px] mx-auto relative">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-[#cd6931] text-[10px] font-black tracking-[0.4em] uppercase">Competitivo</h2>
                    <h3 className="text-white text-3xl font-black italic uppercase">Destaques</h3>
                </div>
                <Link href="/Pages/Campeonatos" className="text-gray-500 hover:text-[#cd6931] transition-colors font-bold text-[10px] tracking-widest uppercase border-b border-white/5 pb-1">
                    Ver Todos →
                </Link>
            </div>

            {/* Container Relativo para as setas ficarem "fora" ou por cima das bordas */}
            <div className="relative px-2">
                
                {/* Janela de Visualização (Clip) */}
                <div className="overflow-hidden">
                    <div 
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{ 
                            transform: `translateX(-${currentIndex * (100 / (typeof window !== 'undefined' && window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3))}%)` 
                        }}
                    >
                        {campeonatos.map((camp) => (
                            <div key={camp.id} className="min-w-full sm:min-w-[50%] lg:min-w-[33.333%] px-3">
                                <CampeonatoCard 
                                    id={camp.id}
                                    titulo={camp.titulo}
                                    tipo={camp.tipo}
                                    status={camp.status}
                                    jogadores={camp.jogadores}
                                    premio={camp.premio}
                                    imagem={camp.imagem}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Setas Visíveis em todas as telas */}
                <button 
                    onClick={prevSlide}
                    className="absolute -left-4 sm:-left-8 top-1/2 -translate-y-1/2 bg-black border border-white/10 w-10 h-10 sm:w-12 sm:h-12 rounded-full text-white hover:text-[#cd6931] hover:border-[#cd6931]/50 z-30 transition-all flex items-center justify-center shadow-xl"
                    aria-label="Anterior"
                >
                    &#10094;
                </button>
                <button 
                    onClick={nextSlide}
                    className="absolute -right-4 sm:-right-8 top-1/2 -translate-y-1/2 bg-black border border-white/10 w-10 h-10 sm:w-12 sm:h-12 rounded-full text-white hover:text-[#cd6931] hover:border-[#cd6931]/50 z-30 transition-all flex items-center justify-center shadow-xl"
                    aria-label="Próximo"
                >
                    &#10095;
                </button>
            </div>
        </section>
    );
}