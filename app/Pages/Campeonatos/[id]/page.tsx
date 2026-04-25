// app/pages/Campeonatos/[id]/page.tsx
'use client'

import { useParams } from 'next/navigation';
import DetalheCampeonato from '@/app/Components/DetalheCampeonato/page';
import Header from '@/app/Components/Header/page';
import Footer from '@/app/Components/Footer/page';

export default function Page() {
  const params = useParams();
  const id = params.id as string; // Aqui pegamos o ID da URL (ex: /1)

  return (
    <main className="min-h-screen flex flex-col bg-[#0f0f0f]">
      <Header />
      {/* Passamos o ID capturado para o componente que busca os dados */}
      <DetalheCampeonato id={id} />
      <Footer />
    </main>
  );
}