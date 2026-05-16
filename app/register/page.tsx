"use client";

import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FiEdit2 } from "react-icons/fi";
import { supabase } from "@/app/lib/supabase";
import AvatarPhotoModal from "@/app/Components/AvatarPhotoModal";

const DEFAULT_AVATAR = "/images/defaultAvatar.png";

const normalizeBaseName = (name: string) =>
  name
    .trim()
    .replace(/\s+/g, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 20) || "Player";

const randomTag = () => Math.floor(1000 + Math.random() * 9000).toString();

const buildHandle = (base: string, tag: string) => `${base}#${tag}`;

export default function RegisterPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [nick, setNick] = useState("");
  const [tag, setTag] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [checking, setChecking] = useState(true);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(DEFAULT_AVATAR);
  const [draftAvatar, setDraftAvatar] = useState(DEFAULT_AVATAR);
  const [storedDiscord, setStoredDiscord] = useState<{ name: string; email: string | null; image: string | null } | null>(null);

  useEffect(() => {
    const verifyProfile = async () => {
      if (!session?.user?.id) return setChecking(false);

      const storagePayload = {
        name: session.user.name || "",
        email: session.user.email || null,
        image: session.user.image || null,
      };
      window.localStorage.setItem("arenaRiftDiscordProfile", JSON.stringify(storagePayload));
      setStoredDiscord(storagePayload);

      const { data } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", session.user.id)
        .single();

      if (data) {
        router.push("/perfil");
      } else {
        setChecking(false);
      }
    };

    if (status === "authenticated") {
      verifyProfile();
    } else if (status === "unauthenticated") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setChecking(false);
    }
  }, [status, session, router]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("arenaRiftDiscordProfile");
    if (stored) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setStoredDiscord(JSON.parse(stored));
      } catch {
        window.localStorage.removeItem("arenaRiftDiscordProfile");
      }
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!session?.user?.id) {
      setError("Você precisa fazer login antes de continuar.");
      return;
    }

    const base = normalizeBaseName(nick || session.user.name || storedDiscord?.name || "Player");
    const normalizedTag = tag.trim();
    const cleanTag = normalizedTag === "" ? randomTag() : /^[0-9]{4}$/.test(normalizedTag) ? normalizedTag : "";

    if (!cleanTag) {
      setError("A tag deve ter 4 dígitos numéricos ou ser deixada em branco para gerar automaticamente.");
      return;
    }

    const handle = buildHandle(base, cleanTag);
    setSaving(true);

    try {
      const { data: existing } = await supabase
        .from("profiles")
        .select("id")
        .eq("nickname_wildrift", handle)
        .single();

      if (existing) {
        setError("Nick já existe no ArenaRift. Tente outro nick ou outra tag.");
        setSaving(false);
        return;
      }

      const email = session.user.email || storedDiscord?.email || "";
      const usernameDiscord = session.user.name || storedDiscord?.name || "DiscordUser";

      const { error: insertError } = await supabase.from("profiles").insert({
        id: session.user.id,
        username_discord: usernameDiscord,
        nickname_wildrift: handle,
        email,
        avatar_url: selectedAvatar || DEFAULT_AVATAR,
      });

      if (insertError) {
        console.error("Erro ao criar perfil ArenaRift:", insertError);
        setError("Não foi possível criar seu perfil no momento. Tente novamente mais tarde.");
        setSaving(false);
        return;
      }

      window.localStorage.removeItem("arenaRiftDiscordProfile");
      setShowAvatarModal(false);
      router.push("/perfil");
    } catch (err) {
      console.error(err);
      setError("Erro inesperado ao criar o perfil.");
      setSaving(false);
    }
  };

  const openAvatarModal = () => {
    setDraftAvatar(selectedAvatar || DEFAULT_AVATAR);
    setShowAvatarModal(true);
  };

  const handleSaveAvatar = () => {
    setSelectedAvatar(draftAvatar || DEFAULT_AVATAR);
    setShowAvatarModal(false);
  };

  if (checking) {
    return (
      <main className="min-h-screen bg-[#0f0f0f] flex items-center justify-center text-white">
        <span className="text-sm uppercase tracking-[0.35em]">Verificando cadastro...</span>
      </main>
    );
  }

  if (status === "unauthenticated") {
    return (
      <main className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4">
        <div className="max-w-xl w-full rounded-3xl border border-white/10 bg-[#141414] p-10 text-center">
          <h1 className="text-2xl font-black text-white mb-4">Cadastre seu nick ArenaRift</h1>
          <p className="text-gray-400 mb-6">Faça login com Discord para continuar e escolher o seu nick com tag.</p>
          <button
            type="button"
            onClick={() => signIn("discord", { callbackUrl: "/register" })}
            className="bg-[#cd6931] text-white uppercase text-sm font-bold px-6 py-3 rounded-xl hover:bg-[#b45b2b] transition-colors"
          >
            Entrar com Discord
          </button>
        </div>
      </main>
    );
  }

  const displayName = session?.user?.name || storedDiscord?.name || "Discord User";
  const displayImage = selectedAvatar || DEFAULT_AVATAR;
  const discordAvatar = session?.user?.image || storedDiscord?.image;

  return (
    <main className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-[#141414] p-10 shadow-2xl shadow-black/30">
        <div className="mb-10 text-center">
          <p className="text-[#cd6931] text-[10px] uppercase tracking-[0.35em] mb-3">Cadastro</p>
          <div className="relative mx-auto mb-6 w-28 h-28">
            <div className="h-full w-full overflow-hidden rounded-full border-2 border-[#cd6931] shadow-lg shadow-[#cd6931]/20">
              <img src={displayImage} alt="Avatar escolhido" className="h-full w-full object-cover" />
            </div>
            <button
              type="button"
              onClick={openAvatarModal}
              className="absolute bottom-0 right-0 rounded-full border-2 border-[#141414] bg-[#cd6931] p-2 text-white shadow-lg shadow-black/30 transition-transform hover:scale-110 cursor-pointer"
              aria-label="Alterar foto de perfil"
            >
              <FiEdit2 size={14} />
            </button>
          </div>
          <h1 className="text-3xl font-black text-white">Crie seu nick ArenaRift</h1>
          <p className="mt-2 text-gray-300 font-semibold">{displayName}</p>
          <p className="mt-3 text-gray-400 leading-relaxed">
            Insira um nick para o ArenaRift e complete seu cadastro no site.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.35em] text-gray-400 mb-2">Nick ArenaRift</label>
            <input
              value={nick}
              onChange={(event) => setNick(event.target.value)}
              placeholder={session?.user?.name || "Seu nick"}
              className="w-full rounded-2xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-white outline-none focus:border-[#cd6931]"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.35em] text-gray-400 mb-2">Tag (4 dígitos)</label>
            <input
              value={tag}
              onChange={(event) => setTag(event.target.value.replace(/[^0-9]/g, ""))}
              placeholder="Deixe vazio para gerar automaticamente"
              maxLength={4}
              className="w-full rounded-2xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-white outline-none focus:border-[#cd6931]"
            />
            <p className="mt-2 text-[11px] text-gray-500">
              Exemplo: Gabriel#1234. Se a tag ficar vazia, o sistema gera uma tag numérica aleatória.
            </p>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-2xl bg-[#cd6931] px-5 py-3 text-sm font-black uppercase text-white transition hover:bg-[#b45a2f] hover:scale-102 hover:cursor-pointer disabled:opacity-50"
          >
            {saving ? "Criando perfil..." : "Criar perfil"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/")}
            className="w-full rounded-2xl border hover:cursor-pointer border-white/10 bg-white/5 px-5 py-3 text-sm font-bold uppercase text-gray-300 transition hover:border-[#cd6931] hover:text-white"
          >
            Voltar para a home
          </button>
        </form>
      </div>

      <AvatarPhotoModal
        isOpen={showAvatarModal}
        avatar={draftAvatar}
        initialAvatar={DEFAULT_AVATAR}
        discordAvatar={discordAvatar}
        title="Foto de Perfil"
        confirmLabel="Salvar alterações"
        onAvatarChange={setDraftAvatar}
        onClose={() => setShowAvatarModal(false)}
        onConfirm={handleSaveAvatar}
        showDeleteButton={false}
      />
    </main>
  );
}
