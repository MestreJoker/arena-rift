'use client'

import DetalheCampeonato from '@/app/Components/DetalheCampeonato/page';
import Footer from '@/app/Components/Footer/page';
import Header from '@/app/Components/Header/page';
import { useParams } from 'next/navigation';



export default function CampeonatoDetalhePage() {
  const params = useParams();
  const id = params.id;

  return (
    <main className="min-h-screen flex flex-col bg-[#0f0f0f]">
      <Header />

      <DetalheCampeonato id={id as string} />

      <Footer />
    </main>
  );
}