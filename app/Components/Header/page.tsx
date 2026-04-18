"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import AuthModal from "../Modal/page"

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <header 
                className={`w-full h-16 sm:h-20 fixed px-5 md:px-10 z-50 transition-all duration-300 flex justify-center items-center
                ${isScrolled 
                    ? "bg-[#0a0a0a] shadow-2xl border-white/5 backdrop-blur-md" 
                    : "bg-transparent"
                }`}
            >
                <div className="flex justify-between items-center w-full max-w-7xl">
                    
                    {/* LOGO */}
                    <div className="flex h-full items-center">
                        <Link href={"/"} className="font-bold tracking-tighter flex items-center"
                              style={{ fontSize: 'clamp(1.2rem, 3.5vw, 1.5rem)' }}>
                            <span className="text-[#cd6931]">ARENA</span>
                            <span className="text-white">RIFT</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <nav className="hidden sm:flex items-center gap-8">
                        <Link href={"/Pages/Campeonatos"}>
                            <p className="text-gray-300 font-medium hover:text-[#cd6931] transition-colors uppercase tracking-widest"
                               style={{ fontSize: 'clamp(0.6rem, 1.2vw, 0.8rem)' }}>
                                Campeonatos
                            </p>
                        </Link>
                        
                        <button 
                            onClick={() => setIsAuthModalOpen(true)}
                            className="rounded-lg border border-[#cd6931]/50 text-[#cd6931] font-bold p-2.5 px-6 hover:bg-[#cd6931] hover:text-white transition-all duration-300 shadow-lg shadow-[#cd6931]/10"
                            style={{ fontSize: 'clamp(0.55rem, 1vw, 0.75rem)' }}
                        >
                            ENTRAR / INSCREVER-SE
                        </button>
                    </nav>

                    {/* Hamburguer Mobile */}
                    <button
                        className="sm:hidden text-white flex flex-col gap-1.5 z-[60] p-2"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <div className={`w-6 h-0.5 bg-current transition-all duration-300 ${isOpen ? "rotate-45 translate-y-2 text-[#cd6931]" : ""}`}></div>
                        <div className={`w-6 h-0.5 bg-current transition-all duration-300 ${isOpen ? "opacity-0" : ""}`}></div>
                        <div className={`w-6 h-0.5 bg-current transition-all duration-300 ${isOpen ? "-rotate-45 -translate-y-2 text-[#cd6931]" : ""}`}></div>
                    </button>
                </div>

                {/* Menu Mobile Sidebar - Ocupa exatamente 1/3 da tela */}
                <div className={`fixed top-0 right-0 w-[33.33vw] h-screen bg-[#0a0a0a] flex flex-col items-center pt-32 gap-10 transition-transform duration-500 ease-in-out border-l border-white/10 sm:hidden z-50 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
                    <Link href={"/Pages/Campeonatos"} onClick={() => setIsOpen(false)}>
                        <p className="text-white text-[10px] font-bold hover:text-[#cd6931] tracking-tighter text-center px-2">CAMPEONATOS</p>
                    </Link>
                    <button 
                        onClick={() => {
                            setIsOpen(false);
                            setIsAuthModalOpen(true);
                        }}
                        className="w-[80%] rounded-md border border-[#cd6931] text-[#cd6931] text-[8px] font-bold py-3 hover:bg-[#cd6931] hover:text-white transition-all"
                    >
                        ENTRAR
                    </button>
                </div>
            </header>

            {/* Modal de Autenticação */}
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </>
    )
}