import CardHome from "../Components/CardHome/page"

export default function CardsHome() {
    const propsCards = [
        { titulo: "1x1 Competitivo", descricao: "Duelos diretos onde só o melhor avança. Sem time, sem desculpas — apenas habilidade pura em cada partida.", imagem: "M14.5 2.5l7 7-2.5 2.5-7-7V2.5h2.5zM2.5 9.5l7 7H2.5V14l-2-2 2-2.5zM20 14l-6-6-1.5 1.5 6 6L20 14zM4 4l6 6 1.5-1.5-6-6L4 4z" },

        { titulo: "Avance por Fases", descricao: "Fase de grupos, quartas, semi e grande final. Cada vitória te aproxima do topo do ranking nacional.", imagem: "M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V18H9v2h6v-2h-2v-2.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" },

        { titulo: "Ganhe Prêmios", descricao: "Os melhores colocados são premiados. Glória, reconhecimento e recompensas reais aguardam os campeões.", imagem: "M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z", }


    ]
    return (
        <>
            <div className="text-center mt-15 px-3">
                <p className="text-[#FF7A00] font-[Rajdhani] text-[15px]">
                    POR QUE COMPETIR AQUI?
                </p>
                <h3 className="text-white text-[24px]">Tudo o que você precisa para vencer</h3>
            </div>
            <section className="flex flex-col sm:flex-row sm:justify-center sm:gap-x-8 mt-10 px-4 sm:h-75 gap-y-8 items-center">
                {propsCards.map((item, index) => {
                    return (
                        <CardHome key={index} tituloCard={item.titulo} descricaoCard={item.descricao}
                            linkImgCard={item.imagem} />
                    )
                })}
            </section>

            <style>
                {`
                    @media(max-width: )
                `}
            </style>
        </>

    )
}