interface propsCardHome{
    tituloCard: string
    descricaoCard: string
    linkImgCard: string
}

export default function CardHome(props: propsCardHome) {
    return (
        <div className="w-[96%] sm:max-w-75.75 rounded-lg bg-[#181818] p-9 flex flex-col gap-5 hover:scale-102 transition-all h-full md:max-h-65">
            <div className="w-12 h-12 bg-[#2c2116] p-3 border-[#f57c01] border rounded-xl flex justify-center items-center">
                <svg viewBox="0 0 24 24" className="fill-current text-[#f57c01]">
                    <path d={props.linkImgCard}>

                    </path>
                </svg>
            </div>
            <h4 className="text-xl sm:text-[13px] md:text-[15px] text-white">{props.tituloCard}</h4>
            <p id="descCardHome" className="text-[#8a8a8a] text-[18px] sm:text-[14px]">
                {props.descricaoCard}
            </p>

        </div>
    )
}