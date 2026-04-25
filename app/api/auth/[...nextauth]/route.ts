import NextAuth, { NextAuthOptions } from "next-auth";
import DiscordProvider, { DiscordProfile } from "next-auth/providers/discord";
import { supabase } from "@/app/lib/supabase";

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
      authorization: { params: { scope: "identify email" } },
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      const discord = profile as DiscordProfile;
      
      if (!discord || !discord.email || !discord.id) {
        console.error("ERRO: Dados insuficientes do Discord.");
        return false;
      }

      const avatarUrl = discord.image_url ?? 
        `https://cdn.discordapp.com/avatars/${discord.id}/${discord.avatar}.png`;

      try {
        // 1. Tentar buscar usuário existente por ID ou E-mail
        const { data: userByEmail } = await supabase
          .from("profiles")
          .select("*")
          .eq("email", discord.email)
          .maybeSingle();

        const { data: userById } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", discord.id)
          .maybeSingle();

        const existingUser = userById || userByEmail;

        if (existingUser) {
          // Se já existe, apenas atualizamos os campos imutáveis do Discord e a foto
          await supabase
            .from("profiles")
            .update({
              username_discord: discord.username,
              avatar_url: avatarUrl,
              email: discord.email // Garante que o e-mail esteja atualizado
            })
            .eq("id", existingUser.id);
          
          return true;
        }

        // 2. NOVO USUÁRIO: Tratar Nickname Único
        let finalNickname = discord.username;
        
        // Loop simples para garantir que o nickname seja único no ArenaRift
        const { data: conflict } = await supabase
          .from("profiles")
          .select("nickname_wildrift")
          .eq("nickname_wildrift", finalNickname)
          .maybeSingle();

        if (conflict) {
          // Se o nick "X" já existe, gera "X_123"
          finalNickname = `${discord.username}_${Math.floor(100 + Math.random() * 899)}`;
        }

        // 3. INSERIR NO BANCO
        const { error: insertError } = await supabase
          .from("profiles")
          .insert({
            id: discord.id,
            username_discord: discord.username,
            nickname_wildrift: finalNickname,
            email: discord.email,
            avatar_url: avatarUrl,
          });

        if (insertError) {
          console.error("Erro ao inserir perfil no Supabase:", insertError.message);
          // Se falhar a inserção, não barramos o login (para evitar Access Denied), 
          // mas o usuário ficará sem perfil no banco até o próximo login.
          return true; 
        }

        console.log("Novo usuário ArenaRift criado:", finalNickname);
        return true;
      } catch (err) {
        console.error("Falha crítica na sincronização:", err);
        return true; // Retornamos true para permitir o acesso, mesmo com erro de sync
      }
    },

    async jwt({ token, profile }) {
      if (profile) {
        token.sub = (profile as DiscordProfile).id;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };