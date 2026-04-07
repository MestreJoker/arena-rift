import Image from "next/image";
import Header from "./Components/Header/page";
import Botao from "./Components/Botao/page";
import InfosHome from "./Components/InfosHome/page";

export default function Home() {
  return (
    <main>
      <Header />
      <div className="bg-[url('/images/imageHome5.jpg')] bg-cover bg-center h-screen pt-25">
        <h1 id="tituloPrincipal" className="text-white text-[2rem] md:text-[3rem] pt-15 text-center leading-7 sm:leading-10 md:leading-15">
          Faça parte de campeonatos <br /> de <span
            className="text-orange-400 font-bold">
            wild rift
          </span>
        </h1>
        <p id="subtituloPrincipal" className="text-center sm:text-[0.4rem] md:text-[0.9rem] text-[white] mt-3 max-w-[70%] ml-auto mr-auto">
          TESTE SUAS HABILIDADES E AVANÇE ATÉ O FINAL
        </p>
        <div className="flex justify-center mt-10">
          <Botao texto={"PARTICIPAR AGORA"}></Botao>
        </div>

        <InfosHome />

      </div>
    </main>
  );
}
