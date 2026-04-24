"use client"
import { useState, ChangeEvent, FormEvent } from 'react';
import { supabase } from '@/app/lib/supabase';
import Header from '@/app/Components/Header/page';

export default function AdminPage() {
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

      // 1. Upload da Imagem para o Storage
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `capas/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('campeonatos-fotos')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        // Pegar a URL pública da imagem
        const { data: urlData } = supabase.storage
          .from('campeonatos-fotos')
          .getPublicUrl(filePath);
        
        imageUrl = urlData.publicUrl;
      }

      // 2. Salvar dados no Banco de Dados
      const { error: dbError } = await supabase
        .from('campeonatos')
        .insert([{
          titulo: formData.titulo,
          tipo: formData.tipo,
          status: formData.status,
          vagas_max: formData.vagas_max,
          premio_total: formData.premio_total,
          descricao: formData.descricao,
          imagem_capa: imageUrl // Link da imagem que acabamos de subir
        }]);

      if (dbError) throw dbError;

      alert('Campeonato criado com sucesso!');
      // Limpar formulário
    } catch (error) {
      console.error('Erro:', error);
      alert('Falha ao criar campeonato.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white">
      <Header />
      <section className="max-w-2xl mx-auto py-20 px-6">
        <h1 className="text-3xl font-black italic uppercase text-[#cd6931] mb-8">Criar Arena</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6 bg-[#141414] p-8 rounded-2xl border border-white/5">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Título do Torneio</label>
            <input name="titulo" onChange={handleInputChange} required className="w-full bg-[#0f0f0f] border border-white/10 rounded-lg p-3 text-white focus:border-[#cd6931] outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Tipo</label>
              <select name="tipo" onChange={handleInputChange} className="w-full bg-[#0f0f0f] border border-white/10 rounded-lg p-3 outline-none">
                <option value="5v5">5v5</option>
                <option value="1v1">1v1</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Imagem de Capa</label>
              <input type="file" accept="image/*" onChange={handleFileChange} className="w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#cd6931] file:text-white hover:file:bg-[#b05a2a] cursor-pointer" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Descrição</label>
            <textarea name="descricao" onChange={handleInputChange} rows={4} className="w-full bg-[#0f0f0f] border border-white/10 rounded-lg p-3 outline-none focus:border-[#cd6931]" />
          </div>

          <button disabled={loading} type="submit" className="w-full py-4 bg-[#cd6931] rounded-xl font-black uppercase tracking-widest hover:bg-[#b05a2a] transition-all disabled:opacity-50">
            {loading ? 'Processando...' : 'Publicar Campeonato'}
          </button>
        </form>
      </section>
    </main>
  );
}