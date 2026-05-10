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
    const defaultAvatar = "/images/defaultAvatar.svg";

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
                    setProfileImage(session.user?.image || "");
                    return;
                }

                if (data) {
                    setProfileImage(data.avatar_url || defaultAvatar);
                    setProfileName(data.nickname_wildrift || session.user?.name || "");
                }
            } catch (err) {
                console.error("Erro ao buscar perfil:", err);
            }
        };

        fetchProfileImage();
        const interval = setInterval(fetchProfileImage, 5000);
        return () => clearInterval(interval);
    }, [session?.user?.id]);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Bloquear scroll quando menu mobile estiver aberto
    useEffect(() => {
        if (isOpen) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "unset";
    }, [isOpen]);

    return (
        <>
            <header 
                className={`w-full h-16 sm:h-20 fixed px-5 md:px-10 z-[70] transition-all duration-300 flex justify-center items-center
                ${isScrolled ? "bg-[#0a0a0a] shadow-2xl border-white/5 backdrop-blur-md" : "bg-transparent"}`}
            >
                <div className="flex justify-between items-center w-full max-w-7xl">
                    
                    {/* LOGO */}
                    <div className="flex h-full items-center">
                        <Link href={"/"} className="font-bold tracking-tighter flex items-center" style={{ fontSize: 'clamp(1.2rem, 3.5vw, 1.5rem)' }}>
                            <span className="text-[#cd6931]">ARENA</span>
                            <span className="text-white">RIFT</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <nav className="hidden sm:flex items-center gap-8">
                        <Link href={"/campeonatos"}>
                            <p className="text-gray-300 font-medium hover:text-[#cd6931] transition-all uppercase tracking-widest hover:underline" style={{ fontSize: 'clamp(0.6rem, 1.2vw, 0.8rem)' }}>
                                Campeonatos
                            </p>
                        </Link>
                        
                        {session ? (
                            <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="group flex items-center gap-3 bg-white/5 p-1 pr-4 rounded-full border border-white/10 hover:border-[#cd6931]/50 transition-all duration-300 cursor-pointer">
                                <img src={profileImage || session.user?.image || ""} alt="Avatar" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-[#cd6931] object-cover shadow-lg shadow-[#cd6931]/20" />
                                <div className="flex flex-col text-left">
                                    <span className="text-white text-[10px] font-black uppercase tracking-tighter group-hover:text-[#cd6931] transition-colors leading-none">Meu Perfil</span>
                                    <span className="text-gray-500 text-[8px] font-bold uppercase truncate max-w-[80px]">{profileName || session.user?.name}</span>
                                </div>
                            </button>
                        ) : (
                            <button onClick={() => setIsAuthModalOpen(true)} className="rounded-lg border border-[#cd6931]/50 text-[#cd6931] font-bold p-2.5 px-6 hover:bg-[#cd6931] hover:text-white transition-all duration-300 shadow-lg shadow-[#cd6931]/10 hover:cursor-pointer hover:scale-104" style={{ fontSize: 'clamp(0.55rem, 1vw, 0.75rem)' }}>
                                ENTRAR / INSCREVER-SE
                            </button>
                        )}
                    </nav>

                    {/* Hamburguer Mobile */}
                    <button className="sm:hidden text-white flex flex-col gap-1.5 z-[80] p-2 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                        <div className={`w-6 h-0.5 bg-current transition-all duration-300 ${isOpen ? "rotate-45 translate-y-2 text-[#cd6931]" : ""}`}></div>
                        <div className={`w-6 h-0.5 bg-current transition-all duration-300 ${isOpen ? "opacity-0" : ""}`}></div>
                        <div className={`w-6 h-0.5 bg-current transition-all duration-300 ${isOpen ? "-rotate-45 -translate-y-2 text-[#cd6931]" : ""}`}></div>
                    </button>
                </div>

                {/* Menu Mobile Sidebar (2/3 da tela) */}
                <div className={`fixed top-0 right-0 w-[66.66vw] h-screen bg-[#0a0a0a] flex flex-col pt-12 transition-transform duration-500 ease-in-out border-l border-white/10 sm:hidden z-[75] ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
                    
                    {/* Header Mobile: Foto Direita, Nome Esquerda */}
                    {session ? (
                        <div className="px-6 mb-10 w-full">
                            <Link 
                                href="/perfil" 
                                onClick={() => setIsOpen(false)} 
                                className="flex items-center justify-between gap-4 bg-white/3 border border-white/5 p-4 rounded-2xl active:scale-98 transition-transform"
                            >
                                {/* Nome à esquerda, levemente maior */}
                                <div className="flex flex-col text-left flex-1 truncate">
                                    <p className="text-white text-base font-black uppercase italic tracking-tighter truncate leading-tight">
                                        {profileName || session.user?.name}
                                    </p>
                                    <p className="text-[#cd6931] text-[9px] font-bold uppercase tracking-[0.2em]">Ver Perfil</p>
                                </div>
                                
                                {/* Foto à direita, levemente maior (w-18 = 72px) */}
                                <img 
                                    src={profileImage || session.user?.image || ""} 
                                    alt="Avatar Mobile" 
                                    className="w-18 h-18 rounded-full border-2 border-[#cd6931] object-cover shadow-lg shadow-[#cd6931]/30 flex-shrink-0"
                                />
                            </Link>
                        </div>
                    ) : (
                        <div className="px-6 mb-10">
                            <button 
                                onClick={() => { setIsOpen(false); setIsAuthModalOpen(true); }}
                                className="w-full rounded-xl bg-[#cd6931] text-white text-[10px] font-black py-4 uppercase tracking-widest cursor-pointer"
                            >
                                Entrar na Arena
                            </button>
                        </div>
                    )}

                    <div className="h-px w-full bg-white/5 mb-8"></div>

                    {/* Links de navegação no Mobile */}
                    <nav className="flex flex-col gap-4 px-6">
                        <Link href="/campeonatos" onClick={() => setIsOpen(false)} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl flex items-center justify-center group active:scale-95 transition-all">
                            <p className="text-white text-[11px] font-black uppercase tracking-widest group-hover:text-[#cd6931]">Ver Campeonatos</p>
                        </Link>

                        {session && (
                            <button 
                                onClick={() => { setIsOpen(false); signOut({ callbackUrl: '/' }); }}
                                className="w-full border border-red-500/20 p-4 rounded-xl flex items-center justify-center active:scale-95 transition-all cursor-pointer"
                            >
                                <p className="text-red-500 text-[11px] font-black uppercase tracking-widest">Sair da Conta</p>
                            </button>
                        )}
                    </nav>

                    <div className="mt-auto p-10 text-center">
                        <p className="text-gray-600 text-[8px] font-bold uppercase tracking-[0.5em]">ArenaRift v1.0</p>
                    </div>
                </div>
            </header>

            {/* Overlay para o Menu Sanduíche Mobile */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[65] sm:hidden" onClick={() => setIsOpen(false)}></div>
            )}

            {/* Barra Lateral de Perfil (Desktop) */}
            {session && (
                <div className={`fixed top-0 right-0 h-screen w-64 bg-[#0a0a0a] border-l border-white/10 flex flex-col items-center pt-24 gap-6 transition-transform duration-300 z-[90] ${isProfileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
                    <div className="flex flex-col items-center gap-3">
                        <img src={profileImage || session.user?.image || ""} alt="Avatar" className="w-20 h-20 rounded-full border-2 border-[#cd6931] object-cover shadow-lg shadow-[#cd6931]/20" />
                        <p className="text-white font-black text-sm uppercase tracking-tight text-center">{profileName || session.user?.name}</p>
                    </div>
                    <div className="w-full h-px bg-white/10"></div>
                    <Link href="/perfil" onClick={() => setIsProfileMenuOpen(false)} className="w-[80%] py-3 text-center text-white font-bold uppercase text-[10px] tracking-widest border border-[#cd6931]/30 rounded-lg hover:bg-[#cd6931] transition-all">Visualizar Perfil</Link>
                    <button onClick={() => { setIsProfileMenuOpen(false); signOut({ callbackUrl: '/' }); }} className="w-[80%] py-3 text-center text-red-500 font-bold uppercase text-[10px] tracking-widest border border-red-500/30 rounded-lg hover:bg-red-500 hover:text-white transition-all cursor-pointer">Sair</button>
                    <button onClick={() => setIsProfileMenuOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-white cursor-pointer">✕</button>
                </div>
            )}

            {isProfileMenuOpen && (
                <div className="fixed inset-0 bg-black/40 z-[85]" onClick={() => setIsProfileMenuOpen(false)}></div>
            )}

            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </>
    )
}