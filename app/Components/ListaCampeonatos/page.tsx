import CampeonatoCard from "../CampeonatoCard/page";

export default function ListaCampeonatos() {

  const campeonatos = [
    {
      titulo: "1v1 Desafio Supremo",
      tipo: "1v1",
      status: "aberto",
      jogadores: "12/16",
      premio: "R$100",
      imagem: "/images/imageHome5.jpg"
    },
    {
      titulo: "5v5 Arena Elite",
      tipo: "5v5",
      status: "andamento",
      jogadores: "8/10",
      premio: "R$300",
      imagem: "/images/imageHome5.jpg"
    },
    {
      titulo: "1v1 Rápido",
      tipo: "1v1",
      status: "aberto",
      jogadores: "6/16",
      premio: "R$50",
      imagem: "/images/imageHome5.jpg"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {campeonatos.map((item, index) => (
        <CampeonatoCard
              key={index}
              titulo={item.titulo}
              tipo={item.tipo}
              status={item.status}
              jogadores={item.jogadores}
              premio={item.premio}
              imagem={item.imagem}
              id={index}        />
      ))}
    </div>
  );
}