interface CampeonatoProps {
  titulo: string;
  tipo: string;
  status: string;
  jogadores: string;
  premio: string;
  imagem: string;
}

export default function CampeonatoCard(props: CampeonatoProps) {
  return (
    <div className="group bg-[#181818] rounded-lg overflow-hidden 
                    border border-transparent hover:border-[#f57c01]/40 
                    transition-all duration-300 hover:scale-[1.02] cursor-pointer">

      {/* Imagem */}
      <div className="relative h-40 w-full">
        <div className="absolute inset-0 bg-gradient-to-t 
                        from-black via-black/60 to-transparent z-10"></div>

        <img
          src={props.imagem}
          alt={props.titulo}
          className="w-full h-full object-cover"
        />

        {/* Badge */}
        <span className={`absolute top-2 left-2 z-20 text-xs px-3 py-1 rounded-full font-bold
          ${props.status === 'aberto' ? 'bg-green-500' : 'bg-orange-500'}`}>
          {props.status.toUpperCase()}
        </span>
      </div>

      {/* Conteúdo */}
      <div className="p-5 flex flex-col gap-2">
        <h3 className="text-white font-bold text-lg group-hover:text-orange-400">
          {props.titulo}
        </h3>

        <p className="text-gray-400 text-sm">Tipo: {props.tipo}</p>
        <p className="text-gray-400 text-sm">Jogadores: {props.jogadores}</p>
        <p className="text-gray-400 text-sm">Prêmio: {props.premio}</p>

        <button className="mt-4 w-full bg-[#f57c01] text-black font-bold py-2 rounded-md
                           hover:bg-orange-500 hover:text-white transition-all">
          PARTICIPAR
        </button>
      </div>
    </div>
  );
}