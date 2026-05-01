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
        console.log("Iniciando verificação de usuário no Supabase para ID:", discord.id, "Email:", discord.email);

        const { data: userByEmail, error: emailError } = await supabase
          .from("profiles")
          .select("*")
          .eq("email", discord.email)
          .maybeSingle();

        const { data: userById, error: idError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", discord.id)
          .maybeSingle();

        if (emailError) console.error("Erro ao buscar por email:", emailError);
        if (idError) console.error("Erro ao buscar por ID:", idError);

        const existingUser = userById || userByEmail;

        if (existingUser) {
          console.log("Usuário existente encontrado:", existingUser.id);
          const updateData: Record<string, string> = {
            username_discord: discord.username,
            email: discord.email,
          };

          if (!existingUser.avatar_url) {
            updateData.avatar_url = avatarUrl;
          }

          const { error: updateError } = await supabase
            .from("profiles")
            .update(updateData)
            .eq("id", existingUser.id);
          
          if (updateError) {
            console.error("Erro ao atualizar perfil existente:", updateError);
          } else {
            console.log("Perfil existente atualizado com sucesso");
          }
        }

        return true;
      } catch (err) {
        console.error("Falha crítica na sincronização:", err);
        return true;
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