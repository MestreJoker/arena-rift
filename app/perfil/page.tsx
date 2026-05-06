"use client"
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // Importado para o redirecionamento
import { supabase } from "@/app/lib/supabase";
import Header from "@/app/Components/Header/page";
import Footer from "@/app/Components/Footer/page";
import ProfileHeader from "@/app/Components/ComponentesPerfilPage/ProfileHeader/page";
import ProfileStats from "@/app/Components/ComponentesPerfilPage/ProfileStats/page";
import ProfileTournaments from "@/app/Components/ComponentesPerfilPage/ProfileTournaments/page";
import LogoutButton from "@/app/Components/ComponentesPerfilPage/LogoutButton/page";

interface UserProfile {
  id: string;
  username_discord: string;
  nickname_wildrift: string;
  avatar_url: string | null;
  email: string;
}

export default function Perfil() {
  const { data: session, status } = useSession();
  const router = useRouter(); // Inicialização do router
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUserData = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (!error && data) setUserData(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // PROTEÇÃO DE ROTA
    if (status === "unauthenticated") {
      router.back(); // Volta para a página anterior se não estiver logado
      return;
    }

    if (status === "authenticated" && session?.user?.id) {
      fetchUserData(session.user.id);
    }
  }, [status, session, fetchUserData, router]);

  useEffect(() => {
    if (!loading && status === "authenticated") {
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    }
  }, [loading, status]);

  // Enquanto verifica a sessão ou carrega dados, exibe o loading
  if (status === "loading" || (status === "authenticated" && loading)) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center text-white italic font-black uppercase tracking-widest">
        Carregando Arena...
      </div>
    );
  }

  // Se o usuário estiver deslogado, o useEffect router.back() cuidará disso, 
  // mas retornamos nulo aqui para evitar flash de conteúdo
  if (status === "unauthenticated") return null;

  if (status === "authenticated" && !userData) {
    return (
      <main className="min-h-screen flex flex-col bg-[#0f0f0f]">
        <Header />
        <section className="flex-1 w-full max-w-3xl mx-auto px-5 py-24 text-center">
          <div className="rounded-3xl border border-white/10 bg-[#141414] p-10">
            <h1 className="text-3xl font-black text-white mb-4">Finalize seu cadastro ArenaRift</h1>
            <p className="text-gray-400 mb-6">
              Sua conta Discord já está autenticada, mas falta criar o nick e a tag do ArenaRift.
            </p>
            <a
              href="/register"
              className="inline-flex rounded-2xl bg-[#cd6931] px-6 py-3 text-sm font-black uppercase text-white hover:bg-[#b45a2f] transition-colors"
            >
              Criar perfil agora
            </a>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-[#0f0f0f]">
      <Header />
      <section className={`mt-15 mb-4 flex-1 w-full max-w-7xl mx-auto px-5 py-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <div className="bg-[#141414] border border-white/5 rounded-2xl p-6 sticky top-24">
              <ProfileHeader
                key={userData?.id || 'loading'}
                initialData={userData}
              />
              <div className="my-6 h-px bg-white/5"></div>
              <LogoutButton />
            </div>
          </aside>
          <div className="lg:col-span-3 space-y-8">
            <ProfileStats userId={session?.user?.id || ""} />
            <ProfileTournaments userId={session?.user?.id || ""} />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}