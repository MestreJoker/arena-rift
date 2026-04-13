import Link from "next/link";

interface BotaoProps{
    texto: string
}

export default function Botao(props: BotaoProps){
    return(
        <Link href={""} >
            <button
            className="p-7 md:p-5 rounded-md bg-orange-400 font-bold text-[1.1rem] mt-8 sm:mt-0 m:text-[0.7rem] md:text-sm hover:scale-105 hover:cursor-pointer hover:bg-orange-500 transition-all shadow-lg shadow-orange-500/50 hover:text-white">
                {props.texto}
            </button>
        </Link>
    )
}