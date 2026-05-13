"use client"
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useSession } from "next-auth/react";
import { supabase } from "@/app/lib/supabase";
import { FiEdit2, FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi"; 

interface UserProfile {
  id: string;
  username_discord: string;
  nickname_wildrift: string;
  avatar_url: string | null;
  email: string;
}

const sugestoes = [
    "/images/sugestoes/sugestao1.jfif",
    "/images/sugestoes/sugestao2.jfif",
    "/images/sugestoes/sugestao3.jpg",
    "/images/sugestoes/sugestao4.jfif",
    "/images/sugestoes/sugestao5.webp",
];

export default function ProfileHeader({ initialData }: { initialData: UserProfile | null }) {
  const { data: session } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [handle, setHandle] = useState(initialData?.nickname_wildrift || "");
  const [avatar, setAvatar] = useState(initialData?.avatar_url || "");

  const hasChanges = handle !== initialData?.nickname_wildrift || avatar !== initialData?.avatar_url;
  // Verifica especificamente se a imagem mostrada no modal é diferente da original do banco
  const imageChanged = avatar !== (initialData?.avatar_url || "/images/defaultAvatar.svg");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (showPhotoModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [showPhotoModal]);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      carouselRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const handleUpdate = async () => {
    if (!initialData?.id || !hasChanges) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ 
        nickname_wildrift: handle,
        avatar_url: avatar || "/images/defaultAvatar.svg"
      })
      .eq("id", initialData.id);

    if (!error) window.location.reload();
    setSaving(false);
  };

  if (!initialData) return null;

  const currentAvatar = avatar || "/images/defaultAvatar.svg";
  const btnClass = "cursor-pointer transition-all hover:scale-103 active:scale-95";

  function handleFileUpload(arg0: File): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative group">
        <img src={currentAvatar} className="w-24 h-24 rounded-full border-2 border-[#cd6931] object-cover mb-4 shadow-xl shadow-[#cd6931]/20" alt="Avatar" />
        {isEditing && (
          <button onClick={() => setShowPhotoModal(true)} className="absolute bottom-4 right-0 bg-[#cd6931] p-2 rounded-full border-2 border-[#0a0a0a] text-white cursor-pointer hover:scale-110 transition-transform">
            <FiEdit2 size={14} />
          </button>
        )}
      </div>

      {!isEditing ? (
        <>
          <h1 className="text-white text-2xl font-black italic uppercase tracking-tighter">
             {initialData.nickname_wildrift}
          </h1>
          <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-[0.2em] mb-4">@{initialData.username_discord}</p>
          <button onClick={() => setIsEditing(true)} className={`text-[10px] text-[#cd6931] border border-[#cd6931]/30 px-4 py-1 rounded-full font-bold uppercase hover:bg-[#cd6931] hover:text-white ${btnClass}`}>
            Editar Perfil
          </button>
        </>
      ) : (
        <div className="w-full space-y-4 mt-2 text-left max-w-xs">
          <div>
            <label className="text-[9px] text-gray-500 uppercase font-semibold ml-1 tracking-widest">Nick ArenaRift</label>
            <input 
              type="text" 
              value={handle} 
              onChange={(e) => setHandle(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-[#cd6931]"
            />
          </div>
          <button onClick={handleUpdate} disabled={!hasChanges || saving} className={`w-full py-3 rounded-lg text-[10px] font-bold uppercase ${hasChanges ? "bg-green-600 text-white" : "bg-gray-800 text-gray-500 opacity-50"} ${btnClass}`}>
            {saving ? "Salvando..." : "Salvar Alterações"}
          </button>
          <button onClick={() => { setIsEditing(false); setAvatar(initialData.avatar_url || ""); setHandle(initialData.nickname_wildrift); }} className={`w-full bg-white/5 text-gray-400 text-[10px] font-bold py-2 rounded-lg uppercase hover:bg-white/10 ${btnClass}`}>
            Cancelar
          </button>
        </div>
      )}

      {showPhotoModal && mounted && createPortal(
        <div className="fixed inset-0 w-screen h-screen flex items-center justify-center z-[999999999]">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowPhotoModal(false)} />
          
          <div className="relative bg-[#141414] border border-white/10 rounded-2xl p-6 w-full max-w-sm flex flex-col items-center animate-in fade-in zoom-in duration-200">
            <h2 className="text-white text-lg font-black uppercase tracking-tighter mb-4 text-center italic">Ajustar Arena</h2>
            
            {/* Imagem Principal com botão de Reset (X) */}
            <div className="relative">
              <img 
                src={currentAvatar} 
                className="w-32 h-32 rounded-full border-4 border-[#cd6931] object-cover mb-4 shadow-2xl shadow-[#cd6931]/30 transition-all duration-300"
                alt="Preview"
              />
              {imageChanged && (
                <button 
                  onClick={() => setAvatar(initialData.avatar_url || "/images/defaultAvatar.svg")}
                  className="absolute -top-1 -left-1 bg-red-600 text-white p-1.5 rounded-full border-2 border-[#141414] hover:bg-red-700 transition-colors shadow-lg cursor-pointer"
                  title="Desfazer alteração"
                >
                  <FiX size={16} />
                </button>
              )}
            </div>

            {/* Carrossel de Sugestões com Setas */}
            <div className="w-full mb-6 relative group/carousel overflow-x-hidden">
              <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest mb-3 ml-1">Sugestões ArenaRift</p>
              
              <div className="relative flex items-center overflow-x-hidden">
                {/* Seta Esquerda (Oculta em Mobile) */}
                <button 
                  onClick={() => scrollCarousel('left')}
                  className="hidden sm:flex absolute -left-2 z-10 bg-[#0a0a0a] border border-white/10 p-1.5 rounded-full text-white hover:text-[#cd6931] opacity-0 group-hover/carousel:opacity-100 transition-opacity cursor-pointer"
                >
                  <FiChevronLeft size={18} />
                </button>

                <div 
                  ref={carouselRef}
                  className="flex gap-3 overflow-x-hidden pb-2 scrollbar-hide snap-x no-scrollbar"
                >
                  {sugestoes.map((url, index) => (
                    <button
                      key={index}
                      onClick={() => setAvatar(url)}
                      className={`flex-shrink-0 snap-center rounded-full border-2 transition-all ${
                        avatar === url ? "border-[#cd6931] scale-110" : "border-white/5 grayscale hover:grayscale-0 hover:border-white/20"
                      }`}
                    >
                      <img src={url} className="w-16 h-16 rounded-full object-cover" alt={`Sugestão ${index}`} />
                    </button>
                  ))}
                </div>

                {/* Seta Direita (Oculta em Mobile) */}
                <button 
                  onClick={() => scrollCarousel('right')}
                  className="hidden sm:flex absolute -right-2 z-10 bg-[#0a0a0a] border border-white/10 p-1.5 rounded-full text-white hover:text-[#cd6931] opacity-0 group-hover/carousel:opacity-100 transition-opacity cursor-pointer"
                >
                  <FiChevronRight size={18} />
                </button>
              </div>
            </div>

            <div className="w-full space-y-3">
              <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])} />
              
              <button onClick={() => fileInputRef.current?.click()} className={`w-full bg-white/5 border border-white/10 text-white text-[10px] font-bold py-3 rounded-lg uppercase hover:bg-white/10 ${btnClass}`}>
                {uploading ? "Sincronizando..." : "Escolher do Dispositivo"}
              </button>

              <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setAvatar(session?.user?.image || "https://cdn.discordapp.com/embed/avatars/0.png")} className={`bg-blue-600/20 border border-blue-600/30 text-blue-400 text-[9px] font-bold py-2 rounded-lg uppercase hover:bg-blue-600 hover:text-white ${btnClass}`}>
                      Usar Discord
                  </button>
                  <button onClick={() => setAvatar("/images/defaultAvatar.png")} className={`border border-red-600/30 text-red-500 text-[9px] font-bold py-2 rounded-lg uppercase hover:bg-red-600/10 ${btnClass}`}>
                      Apagar Foto
                  </button>
              </div>

              <div className="pt-2 border-t border-white/5 flex flex-col gap-2">
                  <button onClick={() => setShowPhotoModal(false)} className={`w-full bg-[#cd6931] text-white text-[10px] font-black py-3 rounded-lg uppercase ${btnClass}`}>
                      Confirmar Escolha
                  </button>
                  <button onClick={() => setShowPhotoModal(false)} className="w-full text-gray-500 text-[9px] font-bold uppercase py-1 hover:text-white transition-colors">
                      Fechar
                  </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}