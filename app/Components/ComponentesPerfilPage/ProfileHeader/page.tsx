"use client"
import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { supabase } from "@/app/lib/supabase";

interface UserProfile {
  id: string;
  username_discord: string;
  nickname_wildrift: string;
  avatar_url: string | null;
  email: string;
}

const normalizeHandle = (rawHandle: string) => {
  const trimmed = rawHandle.trim();
  const [base, tag] = trimmed.split('#').map((part) => part.trim());
  const cleanBase = (base || "Player")
    .replace(/\s+/g, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 20) || "Player";
  const cleanTag = typeof tag === "string" && /^\d{4}$/.test(tag)
    ? tag
    : Math.floor(1000 + Math.random() * 9000).toString();

  return `${cleanBase}#${cleanTag}`;
};

const splitHandle = (handle: string) => {
  const [name, tag] = handle.split('#');
  return {
    base: name || handle || "Player",
    tag: tag || "0000",
  };
};

export default function ProfileHeader({ initialData }: { initialData: UserProfile | null }) {
  const { data: session } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDiscordConfirm, setShowDiscordConfirm] = useState(false);

  const [handle, setHandle] = useState(initialData?.nickname_wildrift || "");
  const [avatar, setAvatar] = useState(initialData?.avatar_url || "");

  // Bloquear rolagem do fundo quando qualquer modal estiver aberto
  useEffect(() => {
    const isAnyModalOpen = showPhotoModal || showDeleteConfirm || showDiscordConfirm;
    if (isAnyModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [showPhotoModal, showDeleteConfirm, showDiscordConfirm]);

  const discordAvatar = session?.user?.image || "https://cdn.discordapp.com/embed/avatars/0.png";
  const defaultAvatar = "/images/defaultAvatar.svg";

  const handleFileUpload = (file: File) => {
    if (!file) return;
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setAvatar(base64);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      alert("Erro ao fazer upload da imagem.");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async () => {
    if (!initialData?.id) return;
    setSaving(true);
    const formattedHandle = normalizeHandle(handle);

    const { error } = await supabase
      .from("profiles")
      .update({ 
        nickname_wildrift: formattedHandle,
        avatar_url: avatar || defaultAvatar
      })
      .eq("id", initialData.id);

    if (error) {
      alert("Erro ao atualizar perfil.");
    } else {
      setIsEditing(false);
      setShowPhotoModal(false);
      window.location.reload(); 
    }
    setSaving(false);
  };

  const handleDeleteAvatar = async () => {
    setAvatar(defaultAvatar);
    setShowDeleteConfirm(false);
  };

  const handleUseDiscordAvatar = () => {
    if (avatar !== defaultAvatar && avatar !== discordAvatar) {
      setShowDiscordConfirm(true);
      return;
    }
    setAvatar(discordAvatar);
  };

  if (!initialData) return null;
  const currentAvatar = avatar || defaultAvatar;

  return (
    <div className="flex flex-col items-center text-center">
      <img 
        src={currentAvatar} 
        className="w-24 h-24 rounded-full border-2 border-[#cd6931] object-cover mb-4 shadow-xl shadow-[#cd6931]/20"
        alt="Avatar"
      />

      {!isEditing ? (
        <>
          <h1 className="text-white text-2xl font-black italic uppercase tracking-tighter">
            {splitHandle(initialData.nickname_wildrift).base}
            <span className="text-gray-500 text-[1rem]">#{splitHandle(initialData.nickname_wildrift).tag}</span>
          </h1>
          <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-[0.2em] mb-4">
            @{initialData.username_discord}
          </p>
          <button 
            onClick={() => setIsEditing(true)} 
            className="text-[10px] text-[#cd6931] border border-[#cd6931]/30 px-4 py-1 rounded-full font-bold uppercase hover:bg-[#cd6931] hover:text-white transition-all"
          >
            Editar Perfil
          </button>
        </>
      ) : (
        <div className="w-full space-y-4 mt-2 text-left">
          <div>
            <label className="text-[9px] text-gray-500 uppercase font-semibold ml-1">Handle ArenaRift</label>
            <input 
              type="text" 
              value={handle} 
              onChange={(e) => setHandle(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-[#cd6931]"
            />
          </div>

          <button 
            onClick={() => setShowPhotoModal(true)}
            className="w-full bg-white/5 border border-white/10 text-white text-[10px] font-bold py-2 rounded-lg uppercase hover:bg-white/10 transition-all"
          >
            Editar Foto
          </button>

          <button 
            onClick={() => setShowDeleteConfirm(true)}
            disabled={currentAvatar === defaultAvatar}
            className="w-full bg-red-600/10 border border-red-600/20 text-red-500 text-[10px] font-bold py-2 rounded-lg uppercase hover:bg-red-600 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Apagar Foto Atual
          </button>

          <div className="flex gap-2 pt-2 border-t border-white/5">
            <button onClick={() => setIsEditing(false)} className="flex-1 bg-white/5 text-gray-400 text-[10px] font-bold py-2 rounded-lg uppercase hover:bg-white/10">
              Voltar
            </button>
          </div>
        </div>
      )}

      {/* MODAL DE EDIÇÃO DE FOTO - POSICIONAMENTO ABSOLUTO NO TOPO */}
      {showPhotoModal && (
        <div className="fixed w-screen h-screen inset-0 bg-black/90 flex items-center justify-center z-[99999999] backdrop-blur-md p-4">
          <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 w-full max-w-sm flex flex-col items-center animate-in fade-in zoom-in duration-200">
            <h2 className="text-white text-lg font-black uppercase tracking-tighter mb-4 text-center">Ajustar Imagem</h2>
            
            <img 
              src={currentAvatar} 
              className="w-32 h-32 rounded-full border-4 border-[#cd6931] object-cover mb-6 shadow-2xl shadow-[#cd6931]/30"
              alt="Preview"
            />

            <div className="w-full space-y-3">
              <input 
                type="file" 
                ref={fileInputRef}
                hidden 
                accept="image/*"
                onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
              />
              
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-white/5 border border-white/10 text-white text-[10px] font-bold py-3 rounded-lg uppercase hover:bg-white/10"
              >
                {uploading ? "Processando..." : "Escolher Arquivo"}
              </button>

              {session?.user?.image && (
                <button 
                  onClick={handleUseDiscordAvatar}
                  className="w-full bg-blue-600/20 border border-blue-600/30 text-blue-400 text-[10px] font-bold py-3 rounded-lg uppercase hover:bg-blue-600 hover:text-white transition-all"
                >
                  Usar Foto do Discord
                </button>
              )}

              <div className="pt-4 space-y-2">
                <button 
                  onClick={handleUpdate} 
                  disabled={saving} 
                  className="w-full bg-[#cd6931] text-white text-[10px] font-bold py-3 rounded-lg uppercase transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {saving ? "Salvando..." : "Salvar Alterações"}
                </button>
                <button 
                  onClick={() => setShowPhotoModal(false)}
                  className="w-full text-gray-500 text-[9px] font-bold uppercase hover:text-white transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modais de Confirmação com Z-index ainda maior se necessário */}
      {(showDeleteConfirm || showDiscordConfirm) && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[1000] p-4 backdrop-blur-md">
          <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 w-full max-w-sm animate-in fade-in zoom-in duration-200">
            {showDeleteConfirm && (
              <>
                <h2 className="text-white text-lg font-black uppercase tracking-tighter mb-2">Apagar Foto?</h2>
                <p className="text-gray-400 text-sm mb-6">A imagem será removida e substituída pelo avatar padrão. Você precisará salvar o perfil para confirmar.</p>
                <div className="flex gap-3">
                  <button onClick={handleDeleteAvatar} className="flex-1 bg-red-600 text-white font-bold py-2 rounded-lg uppercase text-[10px]">Confirmar</button>
                  <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 bg-white/5 text-gray-400 font-bold py-2 rounded-lg uppercase text-[10px]">Cancelar</button>
                </div>
              </>
            )}
            {showDiscordConfirm && (
              <>
                <h2 className="text-white text-lg font-black uppercase tracking-tighter mb-2">Usar foto do Discord?</h2>
                <p className="text-gray-400 text-sm mb-6">Isso substituirá sua foto atual pela do seu perfil do Discord.</p>
                <div className="flex gap-3">
                  <button onClick={() => {setAvatar(discordAvatar); setShowDiscordConfirm(false);}} className="flex-1 bg-blue-600 text-white font-bold py-2 rounded-lg uppercase text-[10px]">Confirmar</button>
                  <button onClick={() => setShowDiscordConfirm(false)} className="flex-1 bg-white/5 text-gray-400 font-bold py-2 rounded-lg uppercase text-[10px]">Cancelar</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}