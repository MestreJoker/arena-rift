import Image from "next/image"
import Link from "next/link"

export default function Header() {
    return (
        <header className="w-full bg-[#3117066c] h-15 md:h-18 fixed px-5 md:px-10 flex justify-between items-center">
            <div className="flex h-full items-center w-900">
                <Image src={"/images/imgLogo2.png"} alt={"Logo"} width={65} height={65} className="h-[80%] w-fit" />
            </div>
            <div className="flex gap-x-8 items-center">
                <Link href={""}>
                    <p className="text-gray-300 text-[0.75rem] hover:text-[#f57c01] border-b-2 border-transparent hover:border-b-[#f57c01] transition-colors">
                        CAMPEONATO
                    </p>
                </Link>
                <Link href={""}>
                    <button className="rounded-lg border-2 border-[#f57c01] text-[#f57c01]
                    text-[0.8rem] p-4 whitespace-nowrap hover:bg-[#f57c01] hover:text-black transition-all hover:cursor-pointer">
                        ENTRAR / INSCREVER-SE
                    </button>
                </Link>
            </div>

        </header>
    )
}