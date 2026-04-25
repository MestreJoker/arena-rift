import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  // Adicionamos a definição do Profile para o TS reconhecer o ID do Discord
  interface Profile {
    id?: string;
    username?: string;
    email?: string;
    image_url?: string;
    avatar?: string;
  }

  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub: string;
  }
}