"use client"
import { useState } from "react";
import { useSession } from "next-auth/react";
import { supabase } from "@/app/lib/supabase";

interface UserProfile {
  id: string;
  username_discord: string;
  nickname_wildrift: string;
  avatar_url: string | null;
  email: string;
}

export default function ProfileHeader({ initialData }: { initialData: UserProfile | null }) {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [nickname, setNickname] = useState(initialData?.nickname_wildrift || "");
  const [avatar, setAvatar] = useState(initialData?.avatar_url || "");

  const discordAvatar = session?.user?.image || "https://cdn.discordapp.com/embed/avatars/0.png";

  // Converter arquivo em BASE64 para armazenar no banco
  const handleFileUpload = (file: File) => {
    if (!file) return;
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setAvatar(base64); // Armazena como string BASE64
      };
      reader.onerror = () => {
        alert("Erro ao ler a imagem.");
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Erro no upload:", error);
      alert("Erro ao fazer upload da imagem.");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async () => {
    if (!initialData?.id) return;
    setSaving(true);

    // Verificar se nickname já existe
    if (nickname !== initialData.nickname_wildrift) {
      const { data: existing } = await supabase
        .from("profiles")
        .select("id")
        .eq("nickname_wildrift", nickname)
        .neq("id", initialData.id)
        .single();
      if (existing) {
        alert("Este nickname já está em uso.");
        setSaving(false);
        return;
      }
    }

    const { error } = await supabase
      .from("profiles")
      .update({ 
        nickname_wildrift: nickname,
        avatar_url: avatar || null
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
    if (!initialData?.id) return;
    setSaving(true);

    try {
      // Deletar foto do banco de dados (set avatar_url = null)
      const { error } = await supabase
        .from("profiles")
        .update({ 
          avatar_url: null
        })
        .eq("id", initialData.id);

      if (error) {
        alert("Erro ao deletar a foto.");
        console.error("Erro ao deletar avatar:", error);
      } else {
        // Limpar avatar local após sucesso
        setAvatar("");
        setShowDeleteConfirm(false);
        window.location.reload();
      }
    } catch (error) {
      console.error("Erro ao deletar foto:", error);
      alert("Erro ao deletar a foto.");
    } finally {
      setSaving(false);
    }
  };

  const handleUseDiscordAvatar = () => {
    setAvatar(discordAvatar);
  };

  if (!initialData) return null;

  const currentAvatar = avatar || discordAvatar;

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
            {initialData.nickname_wildrift}
          </h1>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
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
        <div className="w-full space-y-3 mt-2 text-left">
          <div>
            <label className="text-[9px] text-gray-500 uppercase font-black ml-1">Nickname ArenaRift</label>
            <input 
              type="text" 
              value={nickname} 
              onChange={(e) => setNickname(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-[#cd6931]"
            />
          </div>
          <div>
            <label className="text-[9px] text-gray-500 uppercase font-black ml-1">Foto de Perfil</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-[#cd6931]"
              disabled={uploading}
            />
            {uploading && <p className="text-[8px] text-gray-400">Processando imagem...</p>}
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowDeleteConfirm(true)}
              disabled={!avatar || avatar === discordAvatar}
              className="flex-1 bg-red-600 text-white text-[10px] font-bold py-2 rounded-lg uppercase transition-opacity hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Apagar Foto
            </button>
            {session?.user?.image && (
              <button 
                onClick={handleUseDiscordAvatar} 
                className="flex-1 bg-blue-600 text-white text-[10px] font-bold py-2 rounded-lg uppercase transition-opacity hover:opacity-80"
              >
                Usar Foto Discord
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={handleUpdate} disabled={saving} className="flex-1 bg-[#cd6931] text-white text-[10px] font-bold py-2 rounded-lg uppercase transition-opacity hover:opacity-80 disabled:opacity-50">
              {saving ? "Salvando..." : "Salvar"}
            </button>
            <button onClick={() => setIsEditing(false)} className="flex-1 bg-white/5 text-gray-400 text-[10px] font-bold py-2 rounded-lg uppercase hover:bg-white/10">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Deleção */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 w-[90%] max-w-sm">
            <h2 className="text-white text-lg font-black uppercase tracking-tighter mb-2">
              Deletar Foto?
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              Tem certeza que deseja apagar a fotografia do perfil? Esta ação não pode ser desfeita e a imagem será deletada permanentemente.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteAvatar}
                disabled={saving}
                className="flex-1 bg-red-600 text-white font-bold py-2 rounded-lg uppercase text-[10px] hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Deletando..." : "Apagar"}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={saving}
                className="flex-1 bg-white/5 text-gray-400 font-bold py-2 rounded-lg uppercase text-[10px] hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}