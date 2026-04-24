"use client"
import Link from "next/link";
import { useEffect, useState } from "react";

interface CampeonatoProps {
    id: string; 
    titulo: string;
    tipo: string;
    status: string;
    jogadores: string; 
    premio: string;    
    imagem: string;
}

export default function CampeonatoCard({ id, titulo, tipo, status, jogadores, premio, imagem }: CampeonatoProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Pequeno delay para garantir que a animação seja percebida ao carregar
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 150);
        return () => clearTimeout(timer);
    }, []);

    return (
        <Link href={`/Pages/Campeonatos/${id}`}>
            <div 
                className={`group bg-[#141414] border border-white/5 rounded-xl overflow-hidden hover:border-[#cd6931]/50 transition-all duration-700 ease-out flex flex-col h-full
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
                {/* Imagem com Altura Fixa e Centralizada */}
                <div className="relative h-44 overflow-hidden">
                    <img 
                        src={imagem} 
                        alt={titulo} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                    <div className="absolute top-3 right-3">
                        <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${
                            status === 'Aberto' ? 'bg-green-500 text-black' : 'bg-[#cd6931] text-white'
                        }`}>
                            {status}
                        </span>
                    </div>
                </div>

                {/* Conteúdo do Card */}
                <div className="p-5 flex flex-col flex-1">
                    <p className="text-[#cd6931] text-[10px] font-bold uppercase tracking-[0.2em] mb-1">
                        {tipo} • WILD RIFT
                    </p>
                    <h3 className="text-white text-lg font-bold leading-tight mb-4 group-hover:text-[#cd6931] transition-colors line-clamp-2">
                        {titulo}
                    </h3>

                    {/* Rodapé do Card - Alinhado à base */}
                    <div className="mt-auto flex justify-between items-center pt-4 border-t border-white/5">
                        <div className="flex flex-col">
                            <span className="text-gray-500 text-[9px] uppercase font-bold tracking-tighter">Jogadores</span>
                            <span className="text-white text-sm font-bold">{jogadores}</span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-gray-500 text-[9px] uppercase font-bold tracking-tighter">Premiação</span>
                            <span className="text-[#cd6931] text-sm font-black">{premio}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}