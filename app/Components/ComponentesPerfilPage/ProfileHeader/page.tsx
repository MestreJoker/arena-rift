"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { FiEdit2 } from "react-icons/fi";
import { supabase } from "@/app/lib/supabase";
import AvatarPhotoModal from "@/app/Components/AvatarPhotoModal";

interface UserProfile {
  id: string;
  username_discord: string;
  nickname_wildrift: string;
  avatar_url: string | null;
  email: string;
}

const DEFAULT_AVATAR = "/images/defaultAvatar.png";

export default function ProfileHeader({ initialData }: { initialData: UserProfile | null }) {
  const { data: session } = useSession();

  const [isEditing, setIsEditing] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [handle, setHandle] = useState(initialData?.nickname_wildrift || "");
  const [avatar, setAvatar] = useState(initialData?.avatar_url || "");

  const hasChanges = handle !== initialData?.nickname_wildrift || avatar !== initialData?.avatar_url;

  const handleUpdate = async () => {
    if (!initialData?.id || !hasChanges) return;

    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        nickname_wildrift: handle,
        avatar_url: avatar || DEFAULT_AVATAR,
      })
      .eq("id", initialData.id);

    if (!error) window.location.reload();
    setSaving(false);
  };

  if (!initialData) return null;

  const currentAvatar = avatar || DEFAULT_AVATAR;
  const btnClass = "cursor-pointer transition-all hover:scale-103 active:scale-95";

  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative group">
        <img
          src={currentAvatar}
          className="w-24 h-24 rounded-full border-2 border-[#cd6931] object-cover mb-4 shadow-xl shadow-[#cd6931]/20"
          alt="Avatar"
        />
        {isEditing && (
          <button
            type="button"
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
            {initialData.nickname_wildrift}
          </h1>
          <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-[0.2em] mb-4">
            @{initialData.username_discord}
          </p>
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className={`text-[10px] text-[#cd6931] border border-[#cd6931]/30 px-4 py-1 rounded-full font-bold uppercase hover:bg-[#cd6931] hover:text-white ${btnClass}`}
          >
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
              onChange={(event) => setHandle(event.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-[#cd6931]"
            />
          </div>
          <button
            type="button"
            onClick={handleUpdate}
            disabled={!hasChanges || saving}
            className={`w-full py-3 rounded-lg text-[10px] font-bold uppercase ${
              hasChanges ? "bg-green-600 text-white" : "bg-gray-800 text-gray-500 opacity-50"
            } ${btnClass}`}
          >
            {saving ? "Salvando..." : "Salvar Alterações"}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setAvatar(initialData.avatar_url || "");
              setHandle(initialData.nickname_wildrift);
            }}
            className={`w-full bg-white/5 text-gray-400 text-[10px] font-bold py-2 rounded-lg uppercase hover:bg-white/10 ${btnClass}`}
          >
            Cancelar
          </button>
        </div>
      )}

      <AvatarPhotoModal
        isOpen={showPhotoModal}
        avatar={currentAvatar}
        initialAvatar={initialData.avatar_url || DEFAULT_AVATAR}
        discordAvatar={session?.user?.image}
        onAvatarChange={setAvatar}
        onClose={() => setShowPhotoModal(false)}
        onConfirm={() => setShowPhotoModal(false)}
      />
    </div>
  );
}
