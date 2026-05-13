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
  descricao?: string;
}

interface CarrosselProps {
    isAdmin?: boolean;
    onEditClick?: (camp: CampeonatoData) => void;
}

export default function CarrosselCampeonatos({ isAdmin = false, onEditClick }: CarrosselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsToShow, setItemsToShow] = useState(3);
    const [campeonatos, setCampeonatos] = useState<CampeonatoData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) setItemsToShow(1);
            else if (window.innerWidth < 1024) setItemsToShow(2);
            else setItemsToShow(3);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
      const fetchCampeonatos = async () => {
        let query = supabase.from('campeonatos').select('*');
        
        // Se não for admin, filtra apenas os ativos. Se for admin, mostra tudo.
        if (!isAdmin) {
            query = query.in('status', ['Aberto', 'Em andamento']);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) console.error(error);
        else setCampeonatos(data ?? []);
        setLoading(false);
      };

      fetchCampeonatos();
    }, [isAdmin]);

    const nextSlide = () => {
        if (currentIndex < campeonatos.length - itemsToShow) setCurrentIndex(prev => prev + 1);
    };

    const prevSlide = () => {
        if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
    };

    return (
        <section className={`w-full py-8 relative font-sans ${isAdmin ? '' : 'px-4 sm:px-12 max-w-[1400px] mx-auto'}`}>
            {!isAdmin && (
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-[#cd6931] text-[10px] font-black tracking-[0.4em] uppercase">Competitivo</h2>
                        <h3 className="text-white text-3xl font-black italic uppercase">Destaques</h3>
                    </div>
                    <Link href="/campeonatos" className="text-gray-500 hover:text-[#cd6931] transition-colors font-bold text-[10px] tracking-widest uppercase border-b border-white/5 pb-1">
                        Ver Todos →
                    </Link>
                </div>
            )}

            <div className="relative group/carousel">
                <div className={`overflow-hidden ${itemsToShow === 1 ? 'snap-x snap-mandatory' : ''}`}>
                    <div 
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{ transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)` }}
                    >
                        {campeonatos.map((camp) => (
                            <div 
                                key={camp.id} 
                                className={`px-2 flex-shrink-0 min-w-full sm:min-w-[50%] lg:min-w-[33.333%]`}
                            >
                                <div className="relative">
                                    <CampeonatoCard 
                                        {...camp} 
                                        imagem={camp.imagem_capa || '/images/imageHome5.jpg'}
                                        jogadores={camp.vagas_max ? `${camp.vagas_max} vagas` : '---'}
                                        premio={camp.premio_total ? `R$ ${Number(camp.premio_total).toFixed(2)}` : '---'}
                                        valor_inscricao={Number(camp.valor_inscricao).toFixed(2)}
                                    />
                                    
                                    {isAdmin && (
                                        <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center rounded-2xl backdrop-blur-sm">
                                            <p className="text-[8px] font-mono text-gray-400 mb-2">ID: {camp.id}</p>
                                            <button 
                                                onClick={() => onEditClick?.(camp)}
                                                className="bg-[#cd6931] text-white px-6 py-2 rounded-full font-black uppercase text-[10px] tracking-tighter hover:scale-110 transition-transform cursor-pointer"
                                            >
                                                Editar Dados
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {campeonatos.length > itemsToShow && (
                    <>
                        <button onClick={prevSlide} className="absolute -left-4 top-1/2 -translate-y-1/2 bg-black/80 border border-white/10 w-10 h-10 rounded-full text-white z-30 transition-all hover:text-[#cd6931]">&#10094;</button>
                        <button onClick={nextSlide} className="absolute -right-4 top-1/2 -translate-y-1/2 bg-black/80 border border-white/10 w-10 h-10 rounded-full text-white z-30 transition-all hover:text-[#cd6931]">&#10095;</button>
                    </>
                )}
            </div>
        </section>
    );
}