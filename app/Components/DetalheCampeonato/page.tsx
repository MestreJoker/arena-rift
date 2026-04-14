interface Props {
  id: string;
}

export default function DetalheCampeonato({ id }: Props) {

  const campeonatos = [
    {
      id: "1",
      titulo: "1v1 Desafio Supremo",
      tipo: "1v1",
      status: "aberto",
      jogadores: "12/16",
      premio: "R$100",
      descricao: "Mostre sua habilidade em combates diretos e prove que você é o melhor.",
      imagem: "/images/imageHome5.jpg"
    },
    {
      id: "2",
      titulo: "5v5 Arena Elite",
      tipo: "5v5",
      status: "andamento",
      jogadores: "8/10",
      premio: "R$300",
      descricao: "Monte sua equipe e lute pela vitória na arena competitiva.",
      imagem: "/images/imageHome5.jpg"
    }
  ];

  const campeonato = campeonatos.find(c => c.id === id);

  if (!campeonato) {
    return (
      <div className="flex-1 flex items-center justify-center text-white">
        Campeonato não encontrado
      </div>
    );
  }

  return (
    <section className="flex-1 w-full">

      {/* HERO */}
      <div className="relative w-full h-[350px] md:h-[450px]">

        <img
          src={campeonato.imagem}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t 
                        from-black via-black/80 to-transparent"></div>

        <div className="absolute bottom-6 left-6 z-10">
          <h1 className="text-white text-3xl md:text-5xl font-bold">
            {campeonato.titulo}
          </h1>
          <p className="text-gray-300 mt-2">{campeonato.tipo}</p>
        </div>
      </div>

      {/* CONTEÚDO */}
      <div className="max-w-6xl mx-auto px-4 py-10 text-white">

        <div className="grid md:grid-cols-2 gap-10">

          {/* Info */}
          <div className="flex flex-col gap-4">
            <p><strong>Status:</strong> {campeonato.status}</p>
            <p><strong>Jogadores:</strong> {campeonato.jogadores}</p>
            <p><strong>Prêmio:</strong> {campeonato.premio}</p>

            <p className="text-gray-300 mt-4 leading-relaxed">
              {campeonato.descricao}
            </p>

            <button className="mt-6 bg-[#f57c01] text-black font-bold py-3 rounded-md
                               hover:bg-orange-500 hover:text-white transition">
              PARTICIPAR
            </button>
          </div>

          {/* Participantes */}
          <div className="bg-[#181818] border border-[#252525] rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Participantes</h2>

            <ul className="flex flex-col gap-2 text-gray-300">
              <li>Player1</li>
              <li>Player2</li>
              <li>Player3</li>
              <li>Player4</li>
            </ul>
          </div>

        </div>

      </div>
    </section>
  );
}