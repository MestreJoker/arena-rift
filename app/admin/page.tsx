/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Header from '@/app/Components/Header/page';
import CarrosselCampeonatos from '../Components/CarrosselCampeonato/page';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [vagasIlimitadas, setVagasIlimitadas] = useState(false);
  
  // Estado para Criação
  const [formData, setFormData] = useState({
    titulo: '', tipo: '5v5', status: 'Aberto', vagas_max: 16,
    premio_total: 0, valor_inscricao: 0, descricao: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Estados para Edição e Modais
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  const ADMIN_IDS = ["1069102751008706710", "337353633500758027"];

  useEffect(() => {
    if (status === "unauthenticated" || (status === "authenticated" && !ADMIN_IDS.includes(session?.user?.id || ""))) {
      router.back();
    }
  }, [status, session, router]);

  if (status === "loading" || (status === "authenticated" && !ADMIN_IDS.includes(session?.user?.id || ""))) {
    return <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center text-white italic font-black uppercase tracking-widest">Verificando credenciais...</div>;
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, isEdit = false) => {
    const { name, value } = e.target;
    if (isEdit) {
      setEditData((prev: any) => ({ ...prev, [name]: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleOpenEdit = (camp: any) => {
    setEditData({ ...camp });
    setShowEditModal(true);
  };

  const handleUpdateFinal = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('campeonatos')
        .update({
          titulo: editData.titulo,
          tipo: editData.tipo,
          status: editData.status,
          vagas_max: editData.vagas_max,
          premio_total: editData.premio_total,
          valor_inscricao: editData.valor_inscricao,
          descricao: editData.descricao
        })
        .eq('id', editData.id);

      if (error) throw error;
      alert('Arena atualizada com sucesso!');
      window.location.reload();
    } catch (error) {
      alert('Erro ao atualizar campeonato.');
    } finally {
      setLoading(false);
      setShowConfirmModal(false);
    }
  };

  // Função original de criação (mantida)
  const handleSubmitCreate = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = '';
      if (imageFile) {
        const filePath = `capas/${Date.now()}.${imageFile.name.split('.').pop()}`;
        await supabase.storage.from('campeonatos-fotos').upload(filePath, imageFile);
        const { data: urlData } = supabase.storage.from('campeonatos-fotos').getPublicUrl(filePath);
        imageUrl = urlData.publicUrl;
      }
      const { error } = await supabase.from('campeonatos').insert([{
        ...formData,
        vagas_max: vagasIlimitadas ? null : parseInt(formData.vagas_max.toString()),
        imagem_capa: imageUrl
      }]);
      if (error) throw error;
      alert('Campeonato publicado!');
      router.push('/campeonatos');
    } catch (error) {
      alert('Erro na criação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white pb-20">
      <Header />
      <section className="max-w-4xl mx-auto py-20 px-6">
        <div className="flex items-center gap-4 mb-8">
          <h1 className="text-3xl font-black italic uppercase text-[#cd6931]">Administração Arena</h1>
        </div>
        
        {/* FORMULÁRIO DE CRIAÇÃO */}
        <div className="mb-20">
          <h2 className="text-sm font-black uppercase text-gray-500 mb-6 tracking-[0.3em] border-l-2 border-[#cd6931] pl-3">Criar Novo Torneio</h2>
          <form onSubmit={handleSubmitCreate} className="space-y-6 bg-[#141414] p-8 rounded-2xl border border-white/5 shadow-2xl">
            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-500 mb-2">Título</label>
              <input name="titulo" onChange={handleInputChange} required className="w-full bg-[#0f0f0f] border border-white/10 rounded-lg p-3 text-white focus:border-[#cd6931] outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <select name="tipo" onChange={handleInputChange} className="bg-[#0f0f0f] border border-white/10 rounded-lg p-3 outline-none">
                <option value="5v5">5v5 (Equipes)</option>
                <option value="1v1">1v1 (Duelo)</option>
              </select>
              <input type="file" accept="image/*" onChange={(e) => e.target.files && setImageFile(e.target.files[0])} className="text-[10px] text-gray-400 file:bg-[#cd6931] file:text-white file:border-0 file:rounded file:px-4 file:py-2" />
            </div>
            <textarea name="descricao" onChange={handleInputChange} rows={3} placeholder="Regras..." className="w-full bg-[#0f0f0f] border border-white/10 rounded-lg p-3 outline-none" />
            <button disabled={loading} type="submit" className="w-full py-4 bg-[#cd6931] rounded-xl font-black uppercase tracking-widest hover:bg-[#b05a2a] transition-all">
              Publicar Torneio Oficial
            </button>
          </form>
        </div>

        {/* SEÇÃO DE ATUALIZAÇÃO COM CARROSSEL */}
        <div className="w-full">
          <h2 className="text-sm font-black uppercase text-gray-500 mb-6 tracking-[0.3em] border-l-2 border-[#cd6931] pl-3">Gerenciar e Atualizar</h2>
          <CarrosselCampeonatos isAdmin={true} onEditClick={handleOpenEdit} />
        </div>
      </section>

      {/* MODAL DE EDIÇÃO (FORMULÁRIO IGUAL) */}
      {showEditModal && editData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#141414] border border-white/10 p-8 rounded-2xl w-full max-w-2xl my-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-[#cd6931] uppercase italic">Editar: {editData.titulo}</h2>
              <span className="text-[8px] font-mono text-gray-600 uppercase">ID: {editData.id}</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase">Título</label>
                <input name="titulo" value={editData.titulo} onChange={(e) => handleInputChange(e, true)} className="w-full bg-[#0a0a0a] border border-white/10 p-3 rounded-lg text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Status</label>
                  <select name="status" value={editData.status} onChange={(e) => handleInputChange(e, true)} className="w-full bg-[#0a0a0a] border border-white/10 p-3 rounded-lg text-sm">
                    <option value="Aberto">Aberto</option>
                    <option value="Em andamento">Em andamento</option>
                    <option value="Finalizado">Finalizado</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Vagas Máx</label>
                  <input type="number" name="vagas_max" value={editData.vagas_max || ''} onChange={(e) => handleInputChange(e, true)} className="w-full bg-[#0a0a0a] border border-white/10 p-3 rounded-lg text-sm" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase">Descrição</label>
                <textarea name="descricao" value={editData.descricao} onChange={(e) => handleInputChange(e, true)} rows={4} className="w-full bg-[#0a0a0a] border border-white/10 p-3 rounded-lg text-sm resize-none" />
              </div>

              <div className="flex gap-4 pt-4">
                <button onClick={() => setShowConfirmModal(true)} className="flex-1 py-4 bg-green-600 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-green-700 transition-all">Atualizar Dados</button>
                <button onClick={() => setShowEditModal(false)} className="flex-1 py-4 bg-white/5 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-white/10 transition-all">Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMAÇÃO */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#1a1a1a] border border-white/10 p-8 rounded-2xl max-w-sm text-center shadow-2xl">
            <h3 className="text-white font-black uppercase italic mb-2">Salvar Alterações?</h3>
            <p className="text-gray-400 text-xs mb-6">Esta ação modificará os dados permanentemente na Arena Rift.</p>
            <div className="flex gap-4">
              <button onClick={handleUpdateFinal} className="flex-1 bg-green-600 py-3 rounded-lg font-bold text-[10px] uppercase">Sim, Confirmar</button>
              <button onClick={() => setShowConfirmModal(false)} className="flex-1 bg-white/5 py-3 rounded-lg font-bold text-[10px] uppercase">Não, Voltar</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}