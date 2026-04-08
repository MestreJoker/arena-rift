"use client" // Necessário no Next.js para usar o useState
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="w-full bg-[#3117066c] h-13 sm:h-15 md:h-18 fixed px-5 md:px-10 flex justify-between items-center z-50 backdrop-blur-sm">
            <div className="flex h-full items-center">
                <Image src={"/images/imgLogo2.png"} alt={"Logo"} width={65} height={65} className="h-[80%] w-fit" />
            </div>

            {/* Desktop Menu */}
            <div id="botoesHeader" className="hidden sm:flex gap-x-5 sm:gap-x-6 md:gap-x-8 items-center">
                <Link href={""}>
                    <p className="text-gray-300 text-[0.6rem] sm:text-[0.65rem] md:text-[0.75rem] hover:text-[#f57c01] border-b-2 border-transparent hover:border-b-[#f57c01] transition-colors">
                        CAMPEONATO
                    </p>
                </Link>
                <Link href={""}>
                    <button
                        className="rounded-lg border-2 border-[#f57c01] text-[#f57c01]
                    text-[0.5rem] sm:text-[0.6rem] md:text-[0.8rem] p-2 sm:p-3 md:p-4 whitespace-nowrap hover:bg-[#f57c01] hover:text-black transition-all hover:cursor-pointer">
                        ENTRAR / INSCREVER-SE
                    </button>
                </Link>
            </div>

            {/* Botão Sanduíche (Mobile) */}
            <button 
                className="sm:hidden text-white flex flex-col gap-1.5 z-50"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className={`w-6 h-0.5 bg-current transition-all ${isOpen ? "rotate-45 translate-y-2" : ""}`}></div>
                <div className={`w-6 h-0.5 bg-current transition-all ${isOpen ? "opacity-0" : ""}`}></div>
                <div className={`w-6 h-0.5 bg-current transition-all ${isOpen ? "-rotate-45 -translate-y-2" : ""}`}></div>
            </button>

            {/* Menu Mobile Dropdown */}
            <div className={`absolute top-full left-0 w-full bg-[#311706f0] flex flex-col items-center gap-6 py-10 transition-all duration-300 sm:hidden ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
                <Link href={""} onClick={() => setIsOpen(false)}>
                    <p className="text-gray-300 text-sm hover:text-[#f57c01]">CAMPEONATO</p>
                </Link>
                <Link href={""} onClick={() => setIsOpen(false)}>
                    <button className="rounded-lg border-2 border-[#f57c01] text-[#f57c01] text-xs p-3 px-6 hover:bg-[#f57c01] hover:text-black">
                        ENTRAR / INSCREVER-SE
                    </button>
                </Link>
            </div>
        </header>
    )
}
