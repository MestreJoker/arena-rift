"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";

const DEFAULT_AVATAR = "/images/defaultAvatar.png";

const sugestoes = [
  "/images/sugestoes/sugestao1.jfif",
  "/images/sugestoes/sugestao2.jfif",
  "/images/sugestoes/sugestao3.jpg",
  "/images/sugestoes/sugestao4.jfif",
  "/images/sugestoes/sugestao5.webp",
];

interface AvatarPhotoModalProps {
  isOpen: boolean;
  avatar: string;
  initialAvatar?: string;
  discordAvatar?: string | null;
  title?: string;
  confirmLabel?: string;
  confirmDisabled?: boolean;
  confirming?: boolean;
  uploadingLabel?: string;
  onAvatarChange: (avatar: string) => void;
  onClose: () => void;
  onConfirm: () => void;
  showDeleteButton?: boolean;
}

export default function AvatarPhotoModal({
  isOpen,
  avatar,
  initialAvatar = DEFAULT_AVATAR,
  discordAvatar,
  title = "Ajustar Arena",
  confirmLabel = "Confirmar Escolha",
  confirmDisabled = false,
  confirming = false,
  uploadingLabel = "Sincronizando...",
  onAvatarChange,
  onClose,
  onConfirm,
  showDeleteButton = true,
}: AvatarPhotoModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [uploading, setUploading] = useState(false);

  const currentAvatar = avatar || DEFAULT_AVATAR;
  const resetAvatar = initialAvatar || DEFAULT_AVATAR;
  const imageChanged = currentAvatar !== resetAvatar;
  const btnClass = "cursor-pointer transition-all hover:scale-103 active:scale-95";

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const scrollCarousel = (direction: "left" | "right") => {
    if (!carouselRef.current) return;

    const scrollAmount = carouselRef.current.clientWidth * 0.6;
    carouselRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const handleFileUpload = (file: File) => {
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      onAvatarChange(event.target?.result as string);
      setUploading(false);
    };
    reader.onerror = () => setUploading(false);
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 w-screen h-screen flex items-center justify-center z-[999999999]">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />

      <div className="relative bg-[#141414] border border-white/10 rounded-2xl p-6 w-full max-w-sm flex flex-col items-center animate-in fade-in zoom-in duration-200">
        <h2 className="text-white text-lg font-black uppercase tracking-tighter mb-4 text-center italic">{title}</h2>

        <div className="relative">
          <img
            src={currentAvatar}
            className="w-32 h-32 rounded-full border-4 border-[#cd6931] object-cover mb-4 shadow-2xl shadow-[#cd6931]/30 transition-all duration-300"
            alt="Preview"
          />
          {imageChanged && (
            <button
              type="button"
              onClick={() => onAvatarChange(resetAvatar)}
              className="absolute -top-1 -left-1 bg-red-600 text-white p-1.5 rounded-full border-2 border-[#141414] hover:bg-red-700 transition-colors shadow-lg cursor-pointer z-10"
              aria-label="Restaurar foto padrao"
            >
              <FiX size={16} />
            </button>
          )}
        </div>

        <div className="w-full mb-6 relative group/carousel">
          <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest mb-3 ml-1">Sugestões ArenaRift</p>

          <div className="relative flex items-center">
            <button
              type="button"
              onClick={() => scrollCarousel("left")}
              className="hidden lg:flex absolute -left-4 z-20 bg-[#141414] border border-white/10 p-2 rounded-full text-[#cd6931] hover:bg-[#cd6931] hover:text-white opacity-0 group-hover/carousel:opacity-100 transition-all cursor-pointer"
              aria-label="Ver sugestoes anteriores"
            >
              <FiChevronLeft size={20} />
            </button>

            <div
              ref={carouselRef}
              className="flex gap-3 overflow-x-auto lg:overflow-x-hidden scroll-smooth snap-x snap-mandatory no-scrollbar pb-2 w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              {sugestoes.map((url, index) => (
                <button
                  key={url}
                  type="button"
                  onClick={() => onAvatarChange(url)}
                  className={`flex-shrink-0 snap-center rounded-full border-2 transition-all duration-300 ${
                    avatar === url ? "border-[#cd6931] scale-105" : "border-white/5 grayscale hover:grayscale-0 hover:border-white/20"
                  }`}
                >
                  <img src={url} className="w-16 h-16 rounded-full object-cover" alt={`Sugestão ${index + 1}`} />
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => scrollCarousel("right")}
              className="hidden lg:flex absolute -right-4 z-20 bg-[#141414] border border-white/10 p-2 rounded-full text-[#cd6931] hover:bg-[#cd6931] hover:text-white opacity-0 group-hover/carousel:opacity-100 transition-all cursor-pointer"
              aria-label="Ver proximas sugestoes"
            >
              <FiChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="w-full space-y-3">
          <input
            type="file"
            ref={fileInputRef}
            hidden
            accept="image/*"
            onChange={(event) => event.target.files && handleFileUpload(event.target.files[0])}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`w-full bg-white/5 border border-white/10 text-white text-[10px] font-bold py-3 rounded-lg uppercase hover:bg-white/10 ${btnClass}`}
          >
            {uploading ? uploadingLabel : "Escolher do Dispositivo"}
          </button>

          <div className={showDeleteButton ? "grid grid-cols-2 gap-2" : "grid grid-cols-1 gap-2"}>
            <button
              type="button"
              onClick={() => onAvatarChange(discordAvatar || "https://cdn.discordapp.com/embed/avatars/0.png")}
              className={`bg-blue-600/20 border border-blue-600/30 text-blue-400 text-[9px] font-bold py-2 rounded-lg uppercase hover:bg-blue-600 hover:text-white ${btnClass}`}
            >
              Usar Discord
            </button>
            {showDeleteButton && (
              <button
                type="button"
                onClick={() => onAvatarChange(DEFAULT_AVATAR)}
                className={`border border-red-600/30 text-red-500 text-[9px] font-bold py-2 rounded-lg uppercase hover:bg-red-600/10 ${btnClass}`}
              >
                Apagar Foto
              </button>
            )}
          </div>

          <div className="pt-2 border-t border-white/5 flex flex-col gap-2">
            <button
              type="button"
              onClick={onConfirm}
              disabled={confirmDisabled || confirming}
              className={`w-full bg-[#cd6931] text-white text-[10px] font-black py-3 rounded-lg uppercase disabled:opacity-60 disabled:cursor-not-allowed ${btnClass}`}
            >
              {confirming ? "Criando..." : confirmLabel}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full text-gray-500 text-[9px] font-bold uppercase py-1 hover:text-white transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
