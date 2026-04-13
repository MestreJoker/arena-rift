'use client'

export default function FiltrosCampeonato() {
  return (
    <div className="w-full bg-[#181818] border border-[#252525] rounded-lg p-5 mb-10 flex flex-col sm:flex-row gap-4 sm:justify-center">

      {/* Tipo */}
      <select className="bg-[#141414] text-white border border-[#252525] 
                         rounded-md p-3 focus:outline-none 
                         focus:border-[#f57c01] focus:ring-1 focus:ring-[#f57c01]">
        <option>Todos</option>
        <option>1v1</option>
        <option>5v5</option>
      </select>

      {/* Status */}
      <select className="bg-[#141414] text-white border border-[#252525] 
                         rounded-md p-3 focus:outline-none 
                         focus:border-[#f57c01] focus:ring-1 focus:ring-[#f57c01]">
        <option>Todos</option>
        <option>Aberto</option>
        <option>Em andamento</option>
      </select>

    </div>
  );
}