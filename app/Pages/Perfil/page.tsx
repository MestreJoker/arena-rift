"use client"
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
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
    if (status === "authenticated" && session?.user?.id) {
      fetchUserData(session.user.id);
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [status, session, fetchUserData]);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (loading) return <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center text-white italic font-black uppercase">Carregando Arena...</div>;

  return (
    <main className="min-h-screen flex flex-col bg-[#0f0f0f]">
      <Header />
      <section className={`flex-1 w-full max-w-7xl mx-auto px-5 py-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <div className="bg-[#141414] border border-white/5 rounded-2xl p-6 sticky top-24">

              {/* A 'key' faz o componente reiniciar com os dados novos assim que eles carregam */}
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