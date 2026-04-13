'use client'

export default function FiltrosCampeonato() {
  return (
    <div className="w-full bg-[#181818] border border-[#252525] rounded-lg p-5 mb-10 flex flex-col sm:flex-row gap-10 sm:justify-center">

      {/* Tipo */}
      <div className="flex flex-col">
        <label htmlFor="selectModoCompeticao" className="text-white text-[0.8rem] px-1.5">
          Modo
        </label>
        <select id="selectModoCompeticao" className="bg-[#141414] text-white border border-[#252525] 
                         rounded-md p-3 focus:outline-none 
                         focus:border-[#f57c01] focus:ring-1 focus:ring-[#f57c01]
                         hover:cursor-pointer hover:bg-[#0a0a0a]">
          <option>Todos</option>
          <option>1v1</option>
          <option>5v5</option>
        </select>
      </div>


      {/* Status */}
      <div className="flex flex-col">
        <label htmlFor="selectStatusCompeticao" className="text-white text-[0.8rem] px-1.5">
          Status
        </label>
        <select id="selectStatusCompeticao" className="bg-[#141414] text-white border border-[#252525] 
                         rounded-md p-3 focus:outline-none 
                         focus:border-[#f57c01] focus:ring-1 focus:ring-[#f57c01]
                         hover:cursor-pointer hover:bg-[#0a0a0a]">
          <option>Todos</option>
          <option>Aberto</option>
          <option>Em andamento</option>
        </select>
      </div>


    </div>
  );
}