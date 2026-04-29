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

        // 1. Tentar buscar usuário existente por ID ou E-mail
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
          // Se já existe, atualizamos apenas os campos imutáveis do Discord
          // E APENAS atualizamos avatar_url se o usuário não tiver um avatar customizado (BASE64)
          
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const updateData: any = {
            username_discord: discord.username,
            email: discord.email // Garante que o e-mail esteja atualizado
          };

          // Só atualizar avatar se estiver completamente vazio (null ou '')
          // Se tiver QUALQUER valor (customizado, padrão, ou Discord anterior), respeita
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
          
          return true;
        }

        console.log("Usuário não encontrado, criando novo perfil");

        // 2. NOVO USUÁRIO: Tratar Nickname Único
        let finalNickname = discord.username;
        
        // Loop simples para garantir que o nickname seja único no ArenaRift
        const { data: conflict, error: conflictError } = await supabase
          .from("profiles")
          .select("nickname_wildrift")
          .eq("nickname_wildrift", finalNickname)
          .maybeSingle();

        if (conflictError) console.error("Erro ao verificar conflito de nickname:", conflictError);

        if (conflict) {
          // Se o nick "X" já existe, gera "X_123"
          finalNickname = `${discord.username}_${Math.floor(100 + Math.random() * 899)}`;
          console.log("Nickname conflitante, gerado novo:", finalNickname);
        }

        // 3. INSERIR NO BANCO
        console.log("Tentando inserir novo perfil:", { id: discord.id, nickname: finalNickname });
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
          console.error("Erro ao inserir perfil no Supabase:", insertError.message, insertError.details);
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