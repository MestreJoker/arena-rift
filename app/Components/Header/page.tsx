"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { supabase } from "@/app/lib/supabase"
import AuthModal from "../Modal/page"

export default function Header() {
    const { data: session } = useSession()
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [profileImage, setProfileImage] = useState<string>("");
    const [profileName, setProfileName] = useState<string>("");

    // Buscar foto do perfil do ArenaRift (atualizado em tempo real)
    useEffect(() => {
        if (!session?.user?.id) return;

        const fetchProfileImage = async () => {
            try {
                const { data, error } = await supabase
                    .from("profiles")
                    .select("avatar_url, nickname_wildrift")
                    .eq("id", session.user.id)
                    .single();

                if (error) {
                    console.error("Erro ao buscar perfil no Header:", error);
                    setProfileImage(session.user?.image || "");
                    return;
                }

                if (data) {
                    console.log("Perfil carregado no Header:", { avatar_url: data.avatar_url ? "presente" : "vazio", nickname: data.nickname_wildrift });
                    setProfileImage(data.avatar_url || session.user?.image || "");
                    setProfileName(data.nickname_wildrift || session.user?.name || "");
                } else {
                    console.warn("Nenhum perfil encontrado para ID:", session.user.id);
                    setProfileImage(session.user?.image || "");
                }
            } catch (err) {
                console.error("Exceção ao buscar perfil:", err);
                setProfileImage(session.user?.image || "");
            }
        };

        fetchProfileImage();

        // Atualizar a cada 5 segundos para refletir mudanças em tempo real
        const interval = setInterval(fetchProfileImage, 5000);
        return () => clearInterval(interval);
    }, [session?.user?.id, session?.user?.image]);

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
                        <Link href={"/campeonatos"}>
                            <p className="text-gray-300 font-medium hover:text-[#cd6931] transition-all uppercase tracking-widest hover:underline"
                               style={{ fontSize: 'clamp(0.6rem, 1.2vw, 0.8rem)' }}>
                                Campeonatos
                            </p>
                        </Link>
                        
                        {session ? (
                            /* ESTADO LOGADO: Clique na foto abre menu lateral */
                            <button
                                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                className="group flex items-center gap-3 bg-white/5 p-1 pr-4 rounded-full border border-white/10 hover:border-[#cd6931]/50 transition-all duration-300"
                            >
                                <img 
                                    src={profileImage || session.user?.image || ""} 
                                    alt="Foto de Perfil" 
                                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-[#cd6931] object-cover shadow-lg shadow-[#cd6931]/20"
                                />
                                <div className="flex flex-col">
                                    <span className="text-white text-[10px] font-black uppercase tracking-tighter group-hover:text-[#cd6931] transition-colors leading-none">
                                        Meu Perfil
                                    </span>
                                    <span className="text-gray-500 text-[8px] font-bold uppercase truncate max-w-[80px]">
                                        {profileName || session.user?.name || ""}
                                    </span>
                                </div>
                            </button>
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
                    <Link href={"/campeonatos"} onClick={() => setIsOpen(false)}>
                        <p className="text-white text-[10px] font-bold hover:text-[#cd6931] tracking-tighter text-center px-2 uppercase">Campeonatos</p>
                    </Link>
                    
                    {session ? (
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                setIsProfileMenuOpen(true);
                            }}
                            className="flex flex-col items-center gap-2"
                        >
                            <img 
                                src={profileImage || session.user?.image || ""} 
                                alt="Foto Perfil Mobile" 
                                className="w-12 h-12 rounded-full border-2 border-[#cd6931] object-cover"
                            />
                            <p className="text-white text-[8px] font-bold uppercase tracking-widest">{profileName || session.user?.name}</p>
                        </button>
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

            {/* Barra Lateral de Perfil */}
            {session && (
                <div
                    className={`fixed top-0 right-0 h-screen w-64 bg-[#0a0a0a] border-l border-white/10 flex flex-col items-center pt-24 gap-6 transition-transform duration-300 z-40 ${
                        isProfileMenuOpen ? "translate-x-0" : "translate-x-full"
                    }`}
                >
                    {/* Avatar Grande */}
                    <div className="flex flex-col items-center gap-3">
                        <img 
                            src={profileImage || session.user?.image || ""} 
                            alt="Foto de Perfil Grande" 
                            className="w-20 h-20 rounded-full border-2 border-[#cd6931] object-cover shadow-lg shadow-[#cd6931]/20"
                        />
                        <p className="text-white font-black text-sm uppercase tracking-tight text-center">
                            {profileName || session.user?.name}
                        </p>
                    </div>

                    <div className="w-full h-px bg-white/10"></div>

                    {/* Opções */}
                    <Link
                        href="/perfil"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="w-full px-6 py-3 text-center text-white font-bold uppercase text-[10px] tracking-widest border border-[#cd6931]/30 rounded-lg hover:bg-[#cd6931] hover:border-[#cd6931] transition-all"
                    >
                        Visualizar Perfil
                    </Link>

                    <button
                        onClick={() => {
                            setIsProfileMenuOpen(false);
                            signOut({ callbackUrl: '/' });
                        }}
                        className="w-full px-6 py-3 text-center text-red-500 font-bold uppercase text-[10px] tracking-widest border border-red-500/30 rounded-lg hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
                    >
                        Sair
                    </button>

                    {/* Fechar Barra */}
                    <button
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Overlay para fechar menu */}
            {isProfileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-30"
                    onClick={() => setIsProfileMenuOpen(false)}
                ></div>
            )}

            {/* Modal de Autenticação */}
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </>
    )
}