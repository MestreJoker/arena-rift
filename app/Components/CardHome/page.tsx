interface propsCardHome{
    tituloCard: string
    descricaoCard: string
    linkImgCard: string
}

export default function CardHome(props: propsCardHome) {
    return (
        <div className="w-75.75 h-61.25 rounded-lg bg-[#181818] p-9 flex flex-col gap-5 hover:scale-102 transition-all">
            <div className="w-12 h-12 bg-[#2c2116] p-3 border-[#f57c01] border rounded-xl flex justify-center items-center">
                <svg viewBox="0 0 24 24" className="fill-current text-[#f57c01]">
                    <path d={props.linkImgCard}>

                    </path>
                </svg>
            </div>
            <h4 className="text-[13px] text-white">{props.tituloCard}</h4>
            <p id="descCardHome" className="text-[#5a5a5a] text-[12px] text-[14px]">
                {props.descricaoCard}
            </p>

        </div>
    )
}