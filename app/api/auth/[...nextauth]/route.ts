// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import DiscordProvider, { DiscordProfile } from "next-auth/providers/discord";

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    // Usamos a tipagem genérica do NextAuth para os parâmetros
    async signIn({ profile }) {
      // Fazemos o cast seguro para DiscordProfile para acessar os campos específicos
      const discordProfile = profile as DiscordProfile;

      if (!discordProfile) return false;

      const discordUsername = discordProfile.username; // Seu username_discord
      const discordAvatar = discordProfile.image_url ?? 
        `https://cdn.discordapp.com/avatars/${discordProfile.id}/${discordProfile.avatar}.png`;

      try {
        // Lógica da tabela 'profiles' para o ArenaRift:
        // SELECT FROM profiles WHERE username_discord = discordUsername
        // Se não existir, INSERT...
        return true;
      } catch (error) {
        console.error("Erro no login:", error);
        return false;
      }
    },

    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };