import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers";

// 👇 Importamos o centralizador de contextos

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ArenaRift",
  description: "Campeonatos oficiais de Wild Rift",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-br"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0a0a]">
        
        {/* A MÁGICA AGORA É AQUI: 
           O componente Providers contém o SessionProvider (NextAuth) 
           e o seu UserProvider (Contexto do App) 
        */}
        <Providers>
          {children}
        </Providers>

      </body>
    </html>
  );
}