"use client"
import CampeonatoCard from "../CampeonatoCard/page";

// ESTA INTERFACE É O QUE RESOLVE O ERRO: 
// Ela define que este componente espera os filtros, não os dados de um card.
interface ListaCampeonatosProps {
    filtroModo: string;
    filtroStatus: string;
}

export default function ListaCampeonatos({ filtroModo, filtroStatus }: ListaCampeonatosProps) {
    // Mock de dados atualizado com o padrão de cor #cd6931
    const todosCampeonatos = [
        { 
            id: "0", 
            titulo: "1v1 Desafio Supremo", 
            tipo: "1v1", 
            status: "Aberto", 
            jogadores: "12/16", 
            premio: "R$100", 
            imagem: "/images/imageHome5.jpg" 
        },
        { 
            id: "1", 
            titulo: "5v5 Arena Elite", 
            tipo: "5v5", 
            status: "Em andamento", 
            jogadores: "8/10", 
            premio: "R$300", 
            imagem: "/images/imageHome5.jpg" 
        },
        { 
            id: "2", 
            titulo: "1v1 Rápido", 
            tipo: "1v1", 
            status: "Aberto", 
            jogadores: "6/16", 
            premio: "R$50", 
            imagem: "/images/imageHome5.jpg" 
        },
    ];

    // Lógica de filtragem que atende ao fluxo dinâmico discutido [cite: 69, 442]
    const campeonatosFiltrados = todosCampeonatos.filter(camp => {
        const bateModo = filtroModo === "Todos os Modos" || camp.tipo === filtroModo;
        const bateStatus = filtroStatus === "Todos os Status" || camp.status === filtroStatus;
        return bateModo && bateStatus;
    });

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {campeonatosFiltrados.length > 0 ? (
                campeonatosFiltrados.map((camp) => (
                    <CampeonatoCard 
                        key={camp.id} 
                        {...camp} // Aqui passamos os dados individuais para o componente de card
                    />
                ))
            ) : (
                <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-xl">
                    <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-xs">
                        Nenhum campeonato encontrado com esses filtros.
                    </p>
                    <div className="w-8 h-1 bg-[#cd6931] mx-auto mt-4 opacity-50"></div>
                </div>
            )}
        </div>
    );
}