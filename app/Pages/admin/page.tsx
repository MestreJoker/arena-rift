"use client"
import { useState, ChangeEvent, FormEvent } from 'react';
import { supabase } from '@/app/lib/supabase';
import { useSession } from 'next-auth/react';
import Header from '@/app/Components/Header/page';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    tipo: '5v5',
    status: 'Aberto',
    vagas_max: 16,
    premio_total: 0,
    descricao: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Proteção de Rota: Só carrega o form se houver sessão
  if (status === "loading") return <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center text-white italic">Verificando permissões...</div>;
  if (!session) return <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center text-white italic">Acesso negado. Por favor, faça login com o Discord.</div>;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = '';

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        // ADS Tip: Usar Date.now() em vez de Math.random() garante nomes únicos cronológicos
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `capas/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('campeonatos-fotos')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('campeonatos-fotos')
          .getPublicUrl(filePath);
        
        imageUrl = urlData.publicUrl;
      }

      // 2. Salvar dados no Banco de Dados vinculado ao ID do Discord
      const { error: dbError } = await supabase
        .from('campeonatos')
        .insert([{
          titulo: formData.titulo,
          tipo: formData.tipo,
          status: formData.status,
          vagas_max: formData.vagas_max,
          premio_total: formData.premio_total,
          descricao: formData.descricao,
          imagem_capa: imageUrl,
          created_by: session.user?.id // Agora sabemos QUEM criou o torneio
        }]);

      if (dbError) throw dbError;

      alert('Campeonato publicado na Arena Rift com sucesso!');
      window.location.href = '/campeonatos'; 
      
    } catch (error) {
      console.error('Erro:', error);
      alert('Falha ao criar campeonato. Verifique as políticas de RLS do Storage.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white">
      <Header />
      <section className="max-w-2xl mx-auto py-20 px-6">
        <div className="flex items-center gap-4 mb-8">
          <h1 className="text-3xl font-black italic uppercase text-[#cd6931]">Criar Arena</h1>
          <span className="text-[10px] bg-white/10 px-2 py-1 rounded text-gray-400 uppercase font-bold">
            Admin: {session.user?.name}
          </span>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6 bg-[#141414] p-8 rounded-2xl border border-white/5 shadow-2xl">
          {/* Campos de Input seguindo o seu padrão visual */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-gray-500 mb-2 tracking-widest">Título do Torneio</label>
            <input name="titulo" onChange={handleInputChange} required placeholder="Nome do Campeonato" className="w-full bg-[#0f0f0f] border border-white/10 rounded-lg p-3 text-white focus:border-[#cd6931] outline-none transition-all" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-500 mb-2 tracking-widest">Modo de Jogo</label>
              <select name="tipo" onChange={handleInputChange} className="w-full bg-[#0f0f0f] border border-white/10 rounded-lg p-3 outline-none focus:border-[#cd6931] cursor-pointer">
                <option value="5v5">5v5 (Equipes)</option>
                <option value="1v1">1v1 (Duelo)</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-500 mb-2 tracking-widest">Banner da Arena</label>
              <input type="file" accept="image/*" onChange={handleFileChange} className="w-full text-[10px] text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-[#cd6931] file:text-white hover:file:bg-[#b05a2a] cursor-pointer" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-gray-500 mb-2 tracking-widest">Informações e Regras</label>
            <textarea name="descricao" onChange={handleInputChange} rows={4} placeholder="Ex: Requisitos de elo, horários..." className="w-full bg-[#0f0f0f] border border-white/10 rounded-lg p-3 outline-none focus:border-[#cd6931] resize-none" />
          </div>

          <button disabled={loading} type="submit" className="w-full py-4 bg-[#cd6931] rounded-xl font-black uppercase tracking-widest hover:bg-[#b05a2a] transition-all disabled:opacity-50 shadow-lg shadow-[#cd6931]/20">
            {loading ? 'Sincronizando com Supabase...' : 'Publicar Torneio Oficial'}
          </button>
        </form>
      </section>
    </main>
  );
}