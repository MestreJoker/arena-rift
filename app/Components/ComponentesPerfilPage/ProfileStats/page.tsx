"use client";

export default function ProfileStats() {
  const stats = {
    campeonatos: 5,
    vitorias: 12,
    derrotas: 7,
  };

  return (
    <div className="bg-neutral-900 p-4 rounded-2xl">
      <h2 className="text-lg font-semibold mb-4">Estatísticas</h2>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold">{stats.campeonatos}</p>
          <span className="text-sm text-neutral-400">Campeonatos</span>
        </div>

        <div>
          <p className="text-2xl font-bold">{stats.vitorias}</p>
          <span className="text-sm text-neutral-400">Vitórias</span>
        </div>

        <div>
          <p className="text-2xl font-bold">{stats.derrotas}</p>
          <span className="text-sm text-neutral-400">Derrotas</span>
        </div>
      </div>
    </div>
  );
}