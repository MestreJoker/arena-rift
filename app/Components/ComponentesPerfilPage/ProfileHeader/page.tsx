"use client"
import { useState } from "react";
import { supabase } from "@/app/lib/supabase";

interface UserProfile {
  id: string;
  username_discord: string;
  nickname_wildrift: string;
  avatar_url: string | null;
  email: string;
}

export default function ProfileHeader({ initialData }: { initialData: UserProfile | null }) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // 👇 Iniciamos o estado direto com o que vem do banco (sem useEffect)
  const [nickname, setNickname] = useState(initialData?.nickname_wildrift || "");
  const [avatar, setAvatar] = useState(initialData?.avatar_url || "");

  const handleUpdate = async () => {
    if (!initialData?.id) return;
    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({ 
        nickname_wildrift: nickname,
        avatar_url: avatar 
      })
      .eq("id", initialData.id);

    if (error) {
      alert("Erro ao atualizar: Nickname em uso ou problema de conexão.");
    } else {
      setIsEditing(false);
      window.location.reload(); 
    }
    setSaving(false);
  };

  if (!initialData) return null;

  return (
    <div className="flex flex-col items-center text-center">
      <img 
        src={avatar || "/default-avatar.png"} 
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
            <label className="text-[9px] text-gray-500 uppercase font-black ml-1">URL da Foto</label>
            <input 
              type="text" 
              value={avatar} 
              onChange={(e) => setAvatar(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-[#cd6931]"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={handleUpdate} disabled={saving} className="flex-1 bg-[#cd6931] text-white text-[10px] font-bold py-2 rounded-lg uppercase transition-opacity hover:opacity-80">
              {saving ? "Salvando..." : "Salvar"}
            </button>
            <button onClick={() => setIsEditing(false)} className="flex-1 bg-white/5 text-gray-400 text-[10px] font-bold py-2 rounded-lg uppercase hover:bg-white/10">
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}