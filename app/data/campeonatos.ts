export interface Campeonato {
  id: string;
  titulo: string;
  tipo: string; // '1v1' ou '5v5'
  status: string; // 'Aberto' ou 'Em andamento' ou 'Finalizado'
  jogadores: string;
  premio: string;
  descricao: string;
  imagem: string;
  participantes: string[];
}

export const campeonatos: Campeonato[] = [
  {
    id: "0",
    titulo: "1v1 Desafio Supremo",
    tipo: "1v1",
    status: "Aberto",
    jogadores: "12/16",
    premio: "R$100",
    descricao: "Mostre sua habilidade em combates diretos e prove que você é o melhor no Wild Rift.",
    imagem: "/images/imageHome5.jpg",
    participantes: ["Victor", "Gabriel", "Marcos", "Lucas", "Rafael", "Bruno", "Thiago", "Felipe", "Diego", "Enzo", "Valentina", "Arthur"]
  },
  {
    id: "1",
    titulo: "5v5 Arena Elite",
    tipo: "5v5",
    status: "Em andamento",
    jogadores: "8/10",
    premio: "R$300",
    descricao: "Monte sua equipe e lute pela vitória na arena competitiva mais disputada do servidor.",
    imagem: "/images/imageHome5.jpg",
    participantes: ["Time Alpha", "Time Bravo", "Time Charlie", "Time Delta", "Time Echo", "Time Foxtrot", "Time Golf", "Time Hotel"]
  },
  {
    id: "2",
    titulo: "1v1 Rápido",
    tipo: "1v1",
    status: "Aberto",
    jogadores: "6/16",
    premio: "R$50",
    descricao: "Duelos rápidos focados em mecânica pura. Vença e suba no ranking rapidamente.",
    imagem: "/images/imageHome5.jpg",
    participantes: ["Katarina Main", "Yasuo007", "ZedGod", "LuxSupp", "JinxCarry", "ViEnforcer"]
  },
  {
    id: "3",
    titulo: "Copa Wild Rift #1",
    tipo: "5v5",
    status: "Aberto",
    jogadores: "4/16",
    premio: "R$500",
    descricao: "A primeira grande copa da Arena Rift. Grandes prêmios e reconhecimento garantido.",
    imagem: "/images/imageHome5.jpg",
    participantes: ["Time Mid", "Time Jungle", "Time Top", "Time Support"]
  },
  {
    id: "4",
    titulo: "Duelo de Titãs",
    tipo: "1v1",
    status: "Em andamento",
    jogadores: "14/16",
    premio: "R$200",
    descricao: "Apenas para os melhores. Inscrições restritas a elos altos (Diamante+).",
    imagem: "/images/imageHome5.jpg",
    participantes: ["MestreJoker", "Victor", "PlayerOne", "TheBeast"]
  },
  {
    id: "5",
    titulo: "Liga Semanal",
    tipo: "5v5",
    status: "Aberto",
    jogadores: "2/8",
    premio: "R$150",
    descricao: "Toda semana um novo desafio. Acumule pontos na liga e ganhe prêmios mensais.",
    imagem: "/images/imageHome5.jpg",
    participantes: ["Iniciantes WR", "Pro Players"]
  }
];