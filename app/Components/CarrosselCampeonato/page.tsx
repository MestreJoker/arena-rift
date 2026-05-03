'use client'
import { useState, useEffect, useMemo } from "react"
import { supabase } from "@/app/lib/supabase"
import Link from "next/link"
import CampeonatoCard from "../CampeonatoCard/page"

interface CampeonatoData {
  id: string;
  titulo: string;
  tipo: string;
  status: string;
  vagas_max: number | null;
  valor_inscricao: number | string | null;
  premio_total: number | string | null;
  imagem_capa: string | null;
  data_inicio: string | null;
}

export default function CarrosselCampeonatos() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsToShow, setItemsToShow] = useState(3);
    const [campeonatos, setCampeonatos] = useState<CampeonatoData[]>([]);
    const [loading, setLoading] = useState(true);

    // Ajusta a quantidade de itens visíveis e define o comportamento (Desktop vs Mobile)
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setItemsToShow(1);
            } else if (window.innerWidth < 1024) {
                setItemsToShow(2);
            } else {
                setItemsToShow(3);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Busca os campeonatos ativos no Supabase
    useEffect(() => {
      const fetchCampeonatos = async () => {
        const { data, error } = await supabase
          .from('campeonatos')
          .select('id,titulo,tipo,status,vagas_max,valor_inscricao,premio_total,imagem_capa,data_inicio')
          .in('status', ['Aberto', 'Em andamento'])
          .order('data_inicio', { ascending: true })
          .limit(10);

        if (error) {
          console.error('Erro ao carregar campeonatos:', error);
          setCampeonatos([]);
        } else {
          setCampeonatos(data ?? []);
        }
        setLoading(false);
      };

      fetchCampeonatos();
    }, []);

    const nextSlide = () => {
        if (currentIndex < campeonatos.length - itemsToShow) {
            setCurrentIndex((prev) => prev + 1);
        }
    };

    const prevSlide = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
        }
    };

    // Prepara os itens ou skeletons para exibição
    const items = useMemo(() => {
        if (loading) {
            return Array.from({ length: 3 }, (_, index) => ({
                id: `skeleton-${index}`,
                titulo: 'Carregando...',
                tipo: '...',
                status: '...',
                jogadores: '---',
                premio: '---',
                valor_inscricao: '0.00',
                imagem: '/images/imageHome5.jpg'
            }));
        }
        return campeonatos.map((camp) => ({
            id: camp.id,
            titulo: camp.titulo,
            tipo: camp.tipo,
            status: camp.status,
            jogadores: camp.vagas_max ? `${camp.vagas_max} vagas` : 'Vagas indisponíveis',
            premio: camp.premio_total != null ? `R$ ${Number(camp.premio_total).toFixed(2)}` : 'Sem prêmio',
            imagem: camp.imagem_capa || '/images/imageHome5.jpg',
            valor_inscricao: camp.valor_inscricao != null ? Number(camp.valor_inscricao).toFixed(2) : '0.00'
        }));
    }, [loading, campeonatos]);

    return (
        <section className="w-full py-16 px-4 sm:px-12 max-w-[1400px] mx-auto relative font-sans antialiased">
            {/* Cabeçalho no estilo ArenaRift */}
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-[#cd6931] text-[10px] font-black tracking-[0.4em] uppercase">Competitivo</h2>
                    <h3 className="text-white text-3xl font-black italic uppercase">Destaques</h3>
                </div>
                <Link href="/campeonatos" className="text-gray-500 hover:text-[#cd6931] transition-colors font-bold text-[10px] tracking-widest uppercase border-b border-white/5 pb-1">
                    Ver Todos →
                </Link>
            </div>

            <div className="relative">
                {/* 
                    Container de Scroll:
                    - Mobile: overflow-x-auto com snap-scroll e padding à direita para mostrar o próximo card.
                    - Desktop: overflow-hidden controlado pelas setas.
                */}
                <div className={`
                    ${itemsToShow === 1 
                        ? 'overflow-x-auto scroll-smooth snap-x snap-mandatory pr-16 scrollbar-hide' 
                        : 'overflow-hidden px-2'}
                `}>
                    <div 
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{ 
                            transform: itemsToShow === 1 ? 'none' : `translateX(-${currentIndex * (100 / itemsToShow)}%)` 
                        }}
                    >
                        {items.map((camp) => (
                            <div 
                                key={camp.id} 
                                className={`
                                    px-3 flex-shrink-0 transition-all
                                    ${itemsToShow === 1 ? 'min-w-[85vw] snap-start' : 'min-w-full sm:min-w-[50%] lg:min-w-[33.333%]'}
                                `}
                            >
                                <CampeonatoCard {...camp} valor_inscricao={camp.valor_inscricao} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Controles de Navegação (Apenas Desktop) */}
                {itemsToShow > 1 && (
                    <>
                        {currentIndex > 0 && (
                            <button 
                                onClick={prevSlide}
                                className="absolute -left-4 sm:-left-8 top-1/2 -translate-y-1/2 bg-black border border-white/10 w-10 h-10 sm:w-12 sm:h-12 rounded-full text-white hover:text-[#cd6931] hover:border-[#cd6931]/50 z-30 transition-all flex items-center justify-center shadow-xl hover:cursor-pointer"
                            >
                                &#10094;
                            </button>
                        )}

                        {currentIndex < items.length - itemsToShow && (
                            <button 
                                onClick={nextSlide}
                                className="absolute -right-4 sm:-right-8 top-1/2 -translate-y-1/2 bg-black border border-white/10 w-10 h-10 sm:w-12 sm:h-12 rounded-full text-white hover:text-[#cd6931] hover:border-[#cd6931]/50 z-30 transition-all flex items-center justify-center shadow-xl hover:cursor-pointer"
                            >
                                &#10095;
                            </button>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}