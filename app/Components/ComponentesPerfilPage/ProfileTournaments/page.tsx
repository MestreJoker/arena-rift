"use client";

export default function ProfileTournaments() {
  const campeonatos = [
    { id: 1, nome: "Copa Wild Rift #1", status: "Em andamento" },
    { id: 2, nome: "Liga Semanal", status: "Finalizado" },
  ];

  return (
    <div className="bg-neutral-900 p-4 rounded-2xl">
      <h2 className="text-lg font-semibold mb-4">Seus Campeonatos</h2>

      <div className="flex flex-col gap-3">
        {campeonatos.map((c) => (
          <div
            key={c.id}
            className="flex justify-between items-center bg-neutral-800 p-3 rounded-xl"
          >
            <div>
              <p className="font-medium">{c.nome}</p>
              <span className="text-sm text-neutral-400">{c.status}</span>
            </div>

            <button className="text-sm bg-white text-black px-3 py-1 rounded-lg hover:bg-neutral-200 transition">
              Ver
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}