"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react" // Importação acrescentada
import AuthModal from "../Modal/page"

export default function Header() {
    const { data: session } = useSession()
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
                <div className="flex justify-between items-center w-full max-max-w-7xl">
                    
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
                        <Link href={"/pages/Campeonatos"}>
                            <p className="text-gray-300 font-medium hover:text-[#cd6931] transition-all uppercase tracking-widest hover:underline"
                               style={{ fontSize: 'clamp(0.6rem, 1.2vw, 0.8rem)' }}>
                                Campeonatos
                            </p>
                        </Link>
                        
                        {session ? (
                            /* ESTADO LOGADO: Exibe Foto do Perfil do Discord + Botão Sair */
                            <div className="flex items-center gap-6">
                                <Link href="/pages/perfil" className="group flex items-center gap-3 bg-white/5 p-1 pr-4 rounded-full border border-white/10 hover:border-[#cd6931]/50 transition-all duration-300">
                                    <img 
                                        src={session.user?.image || ""} 
                                        alt="Foto de Perfil" 
                                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-[#cd6931] object-cover shadow-lg shadow-[#cd6931]/20"
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-white text-[10px] font-black uppercase tracking-tighter group-hover:text-[#cd6931] transition-colors leading-none">
                                            Meu Perfil
                                        </span>
                                        <span className="text-gray-500 text-[8px] font-bold uppercase truncate max-w-[80px]">
                                            {session.user?.name}
                                        </span>
                                    </div>
                                </Link>
                                
                                {/* BOTÃO SAIR DESKTOP */}
                                <button 
                                    onClick={() => signOut({ callbackUrl: '/' })}
                                    className="text-gray-500 text-[9px] font-bold uppercase tracking-widest hover:text-red-500 transition-colors"
                                >
                                    Sair
                                </button>
                            </div>
                        ) : (
                            /* ESTADO DESLOGADO: Botão Entrar Original */
                            <button 
                                onClick={() => setIsAuthModalOpen(true)}
                                className="rounded-lg border border-[#cd6931]/50 text-[#cd6931] font-bold p-2.5 px-6 hover:bg-[#cd6931] hover:text-white transition-all duration-300 shadow-lg shadow-[#cd6931]/10 hover:cursor-pointer hover:scale-104"
                                style={{ fontSize: 'clamp(0.55rem, 1vw, 0.75rem)' }}
                            >
                                ENTRAR / INSCREVER-SE
                            </button>
                        )}
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

                {/* Menu Mobile Sidebar */}
                <div className={`fixed top-0 right-0 w-[33.33vw] h-screen bg-[#0a0a0a] flex flex-col items-center pt-32 gap-10 transition-transform duration-500 ease-in-out border-l border-white/10 sm:hidden z-50 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
                    <Link href={"/pages/Campeonatos"} onClick={() => setIsOpen(false)}>
                        <p className="text-white text-[10px] font-bold hover:text-[#cd6931] tracking-tighter text-center px-2 uppercase">Campeonatos</p>
                    </Link>
                    
                    {session ? (
                        <div className="flex flex-col items-center gap-6">
                            <Link href="/pages/perfil" onClick={() => setIsOpen(false)} className="flex flex-col items-center gap-2">
                                <img 
                                    src={session.user?.image || ""} 
                                    alt="Foto Perfil Mobile" 
                                    className="w-12 h-12 rounded-full border-2 border-[#cd6931]"
                                />
                                <p className="text-white text-[8px] font-bold uppercase tracking-widest">Ver Perfil</p>
                            </Link>

                            {/* BOTÃO SAIR MOBILE */}
                            <button 
                                onClick={() => signOut({ callbackUrl: '/' })}
                                className="text-red-500 text-[9px] font-bold uppercase tracking-widest"
                            >
                                Sair
                            </button>
                        </div>
                    ) : (
                        <button 
                            onClick={() => {
                                setIsOpen(false);
                                setIsAuthModalOpen(true);
                            }}
                            className="w-[80%] rounded-md border border-[#cd6931] text-[#cd6931] text-[8px] font-bold py-3 hover:bg-[#cd6931] hover:text-white transition-all"
                        >
                            ENTRAR
                        </button>
                    )}
                </div>
            </header>

            {/* Modal de Autenticação */}
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </>
    )
}