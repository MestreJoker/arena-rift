interface propsCardHome{
    tituloCard: string
    descricaoCard: string
    linkImgCard: string
}

export default function CardHome(props: propsCardHome) {
    return (
        <div className="
            group
            w-[96%] sm:max-w-75.75 rounded-lg bg-[#181818] p-9 flex flex-col gap-5 
            hover:scale-102 transition-all duration-300 h-full md:max-h-65
            relative overflow-hidden
            border border-transparent hover:border-t-orange-500/40
            cursor-pointer
        ">
            {/* Borda superior brilhante */}
            <div className="
                absolute top-0 left-0 w-full h-[3px] 
                bg-gradient-to-r from-transparent via-orange-400 to-transparent
                opacity-0 group-hover:opacity-100
                transition-opacity duration-300
            "></div>

            {/* Efeito de brilho nas laterais no hover */}
            <div className="
                absolute top-0 left-0 w-full h-full
                opacity-0 group-hover:opacity-100
                transition-opacity duration-500
                pointer-events-none
            ">
                <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-orange-400 via-orange-500/50 to-transparent"></div>
                <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-orange-400 via-orange-500/50 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500/30 to-transparent"></div>
            </div>

            <div className="w-12 h-12 bg-[#2c2116] p-3 border-[#f57c01] border rounded-xl flex justify-center items-center group-hover:scale-110 transition-transform duration-300">
                <svg viewBox="0 0 24 24" className="fill-current text-[#f57c01]">
                    <path d={props.linkImgCard}>
                    </path>
                </svg>
            </div>
            <h4 className="text-xl sm:text-[13px] md:text-[15px] text-white group-hover:text-orange-400 transition-colors duration-300">
                {props.tituloCard}
            </h4>
            <p id="descCardHome" className="text-[#8a8a8a] text-[18px] sm:text-[14px] group-hover:text-gray-300 transition-colors duration-300">
                {props.descricaoCard}
            </p>
        </div>
    )
}