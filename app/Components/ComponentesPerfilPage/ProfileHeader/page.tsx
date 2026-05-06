"use client"
import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { supabase } from "@/app/lib/supabase";
import { FiEdit2 } from "react-icons/fi"; // Certifique-se de ter react-icons instalado

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

  // Verifica se houve qualquer alteração em relação aos dados iniciais
  const hasChanges = handle !== initialData?.nickname_wildrift || avatar !== initialData?.avatar_url;

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
        setShowPhotoModal(false); // Fecha o modal após selecionar o arquivo
      };
      reader.readAsDataURL(file);
    } catch (error) {
      alert("Erro ao fazer upload da imagem.");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async () => {
    if (!initialData?.id || !hasChanges) return;
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
      window.location.reload(); 
    }
    setSaving(false);
  };

  const handleDeleteAvatar = async () => {
    setAvatar(defaultAvatar);
    setShowDeleteConfirm(false);
    setShowPhotoModal(false); // Fecha o modal após a ação
  };

  const handleUseDiscordAvatar = () => {
    setAvatar(discordAvatar);
    setShowDiscordConfirm(false);
    setShowPhotoModal(false); // Fecha o modal após a ação
  };

  if (!initialData) return null;
  const currentAvatar = avatar || defaultAvatar;

  const btnClass = "cursor-pointer transition-all hover:scale-103 active:scale-95";

  return (
    <div className="flex flex-col items-center text-center">
      {/* Container da Imagem com Lápis se estiver editando */}
      <div className="relative group">
        <img 
          src={currentAvatar} 
          className="w-24 h-24 rounded-full border-2 border-[#cd6931] object-cover mb-4 shadow-xl shadow-[#cd6931]/20"
          alt="Avatar"
        />
        {isEditing && (
          <button
            onClick={() => setShowPhotoModal(true)}
            className="absolute bottom-4 right-0 bg-[#cd6931] p-2 rounded-full border-2 border-[#0a0a0a] text-white cursor-pointer hover:scale-110 transition-transform"
          >
            <FiEdit2 size={14} />
          </button>
        )}
      </div>

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
            className={`text-[10px] text-[#cd6931] border border-[#cd6931]/30 px-4 py-1 rounded-full font-bold uppercase hover:bg-[#cd6931] hover:text-white ${btnClass}`}
          >
            Editar Perfil
          </button>
        </>
      ) : (
        <div className="w-full space-y-4 mt-2 text-left max-w-xs">
          <div>
            <label className="text-[9px] text-gray-500 uppercase font-semibold ml-1">Handle ArenaRift</label>
            <input 
              type="text" 
              value={handle} 
              onChange={(e) => setHandle(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-[#cd6931]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <button 
              onClick={handleUpdate} 
              disabled={!hasChanges || saving} 
              className={`w-full py-2 rounded-lg text-[10px] font-bold uppercase ${
                hasChanges 
                ? "bg-green-600 text-white hover:bg-green-700" 
                : "bg-gray-800 text-gray-500 cursor-not-allowed opacity-50"
              } ${btnClass}`}
            >
              {saving ? "Salvando..." : "Salvar Alterações"}
            </button>
            
            <button 
              onClick={() => {
                setIsEditing(false);
                setHandle(initialData.nickname_wildrift);
                setAvatar(initialData.avatar_url || "");
              }} 
              className={`w-full bg-white/5 text-gray-400 text-[10px] font-bold py-2 rounded-lg uppercase hover:bg-white/10 ${btnClass}`}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* MODAL DE EDIÇÃO DE FOTO */}
      {showPhotoModal && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[99999999] backdrop-blur-md p-4">
          <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 w-full max-w-sm flex flex-col items-center animate-in fade-in zoom-in duration-200">
            <h2 className="text-white text-lg font-black uppercase tracking-tighter mb-4 text-center">Editar Imagem</h2>
            
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
                className={`w-full bg-white/5 border border-white/10 text-white text-[10px] font-bold py-3 rounded-lg uppercase hover:bg-white/10 ${btnClass}`}
              >
                {uploading ? "Processando..." : "Escolher Arquivo"}
              </button>

              {session?.user?.image && (
                <button 
                  onClick={() => avatar === discordAvatar ? setShowPhotoModal(false) : setShowDiscordConfirm(true)}
                  className={`w-full bg-blue-600/20 border border-blue-600/30 text-blue-400 text-[10px] font-bold py-3 rounded-lg uppercase hover:bg-blue-600 hover:text-white ${btnClass}`}
                >
                  Usar Foto do Discord
                </button>
              )}

              <button 
                onClick={() => currentAvatar === defaultAvatar ? setShowPhotoModal(false) : setShowDeleteConfirm(true)}
                className={`w-full border border-red-600/30 text-red-500 text-[10px] font-bold py-3 rounded-lg uppercase hover:bg-red-600/10 ${btnClass}`}
              >
                Apagar Foto Atual
              </button>

              <button 
                onClick={() => setShowPhotoModal(false)}
                className={`w-full text-gray-500 text-[9px] font-bold uppercase pt-2 hover:text-white ${btnClass}`}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMAÇÕES */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100000000] p-4 backdrop-blur-sm">
          <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 w-full max-w-sm">
            <h2 className="text-white text-lg font-black uppercase tracking-tighter mb-2">Remover Foto?</h2>
            <p className="text-gray-400 text-sm mb-6">A imagem será substituída pelo avatar padrão na visualização atual.</p>
            <div className="flex gap-3">
              <button onClick={handleDeleteAvatar} className={`flex-1 bg-red-600 text-white font-bold py-2 rounded-lg uppercase text-[10px] ${btnClass}`}>Confirmar</button>
              <button onClick={() => setShowDeleteConfirm(false)} className={`flex-1 bg-white/5 text-gray-400 font-bold py-2 rounded-lg uppercase text-[10px] ${btnClass}`}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {showDiscordConfirm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100000000] p-4 backdrop-blur-sm">
          <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 w-full max-w-sm">
            <h2 className="text-white text-lg font-black uppercase tracking-tighter mb-2">Usar foto do Discord?</h2>
            <p className="text-gray-400 text-sm mb-6">Sua foto será alterada para a do Discord na visualização atual.</p>
            <div className="flex gap-3">
              <button onClick={handleUseDiscordAvatar} className={`flex-1 bg-blue-600 text-white font-bold py-2 rounded-lg uppercase text-[10px] ${btnClass}`}>Confirmar</button>
              <button onClick={() => setShowDiscordConfirm(false)} className={`flex-1 bg-white/5 text-gray-400 font-bold py-2 rounded-lg uppercase text-[10px] ${btnClass}`}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}