'use client'
import Image from "next/image";
import Header from "./Components/Header/page";
import Botao from "./Components/Botao/page";
import InfosHome from "./Components/InfosHome/page";
import Footer from "./Components/Footer/page";
import CardsHome from "./Widgets/CardsHome";
import AuthModal from "./Components/Modal/page";
import { useState } from "react";

export default function Home() {
  return (
    <main>
      <Header />
      <section id="content" className="max-w-[3480px] ml-auto mr-auto">
        <div
          id="topo"
          className="relative bg-[url('/images/imageHome5.jpg')] bg-cover bg-center h-screen max-h-[900px] pt-25
             before:absolute before:inset-0 before:bg-gradient-to-t before:from-black before:via-black/70 before:to-transparent
             before:pointer-events-none"
        >
          {/* Conteúdo com z-index maior para ficar acima do degradê */}
          <div className="relative z-10">
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
        </div>
        <CardsHome />
      </section>

      <div id="bgFooter" className="bottom-0 mt-220 sm:mt-100">
        <Footer />
      </div>

      <style>
        {`
          @media(max-width: 585px){
            #bgFooter{
              margin-top: 930px
            }
          }

          @media(max-width: 555px){
            #bgFooter{
              margin-top: 990px
            }
          }

          @media(max-width: 535px){
            #bgFooter{
              margin-top: 1030px
            }
          }

          @media(max-width: 528px){
            #bgFooter{
              margin-top: 1050px
            }
          }

          @media(max-width: 493px){
            #bgFooter{
              margin-top: 1110px
            }
          }

          @media(max-width: 415px){
            #bgFooter{
              margin-top: 1140px
            }
          }

          @media(max-width: 401px){
            #bgFooter{
              margin-top: 1170px
            }
          }

          @media(max-width: 399px){
            #bgFooter{
              margin-top: 1250px
            }
          }

          @media(max-width: 392px){
            #bgFooter{
              margin-top: 1270px
            }
          }
        `}
      </style>
    </main>
  );
}
