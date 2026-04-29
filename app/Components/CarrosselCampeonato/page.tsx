'use client'
import { useState, useEffect } from "react"
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

    useEffect(() => {
      const fetchCampeonatos = async () => {
        const { data, error } = await supabase
          .from('campeonatos')
          .select('id,titulo,tipo,status,vagas_max,valor_inscricao,premio_total,imagem_capa,data_inicio')
          .in('status', ['Aberto', 'Em andamento'])
          .order('data_inicio', { ascending: true })
          .limit(10);

        if (error) {
          console.error('Erro ao carregar campeonatos do carrossel:', error);
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

    const items = loading
      ? Array.from({ length: itemsToShow }, (_, index) => ({
          id: `skeleton-${index}`,
          titulo: 'Carregando...',
          tipo: '...',
          status: '...',
          jogadores: '---',
          premio: '---',
          valor_inscricao: '---',
          imagem: '/images/imageHome5.jpg'
        }))
      : campeonatos.map((camp) => ({
          id: camp.id,
          titulo: camp.titulo,
          tipo: camp.tipo,
          status: camp.status,
          jogadores: camp.vagas_max ? `${camp.vagas_max} vagas` : 'Vagas indisponíveis',
          premio: camp.premio_total != null ? `R$ ${Number(camp.premio_total).toFixed(2)}` : 'Sem prêmio',
          imagem: camp.imagem_capa || '/images/imageHome5.jpg',
          valor_inscricao: camp.valor_inscricao != null ? Number(camp.valor_inscricao).toFixed(2) : '0.00'
        }))

    return (
        <section className="w-full py-16 px-4 sm:px-12 max-w-[1400px] mx-auto relative">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-[#cd6931] text-[10px] font-black tracking-[0.4em] uppercase">Competitivo</h2>
                    <h3 className="text-white text-3xl font-black italic uppercase">Destaques</h3>
                </div>
                <Link href="/campeonatos" className="text-gray-500 hover:text-[#cd6931] transition-colors font-bold text-[10px] tracking-widest uppercase border-b border-white/5 pb-1">
                    Ver Todos →
                </Link>
            </div>

            <div className="relative px-2">
                <div className="overflow-hidden">
                    <div 
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{ 
                            transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)` 
                        }}
                    >
                        {items.map((camp) => (
                            <div key={camp.id} className="min-w-full sm:min-w-[50%] lg:min-w-[33.333%] px-3">
                                <CampeonatoCard {...camp} valor_inscricao={camp.valor_inscricao} />
                            </div>
                        ))}
                    </div>
                </div>

                {currentIndex > 0 && (
                    <button 
                        onClick={prevSlide}
                        className="absolute -left-4 sm:-left-8 top-1/2 -translate-y-1/2 bg-black border border-white/10 w-10 h-10 sm:w-12 sm:h-12 rounded-full text-white hover:text-[#cd6931] hover:border-[#cd6931]/50 z-30 transition-all flex items-center justify-center shadow-xl hover:cursor-pointer"
                    >
                        &#10094;
                    </button>
                )}

                {currentIndex < campeonatos.length - itemsToShow && (
                    <button 
                        onClick={nextSlide}
                        className="absolute -right-4 sm:-right-8 top-1/2 -translate-y-1/2 bg-black border border-white/10 w-10 h-10 sm:w-12 sm:h-12 rounded-full text-white hover:text-[#cd6931] hover:border-[#cd6931]/50 z-30 transition-all flex items-center justify-center shadow-xl hover:cursor-pointer"
                    >
                        &#10095;
                    </button>
                )}
            </div>
        </section>
    );
}