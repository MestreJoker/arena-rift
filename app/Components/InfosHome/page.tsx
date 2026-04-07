export default function InfosHome() {
    return (
        <section className="w-full flex justify-center [&>div>h3]:text-orange-500
        [&_>div>h3]:text-4xl [&_>div>h3]:font-bold md:[&_>div]:border-r-2 [&_>div:last-child]:border-r-0
      [&>div]:border-gray-400 flex-col gap-y-5 [&_>div]:border-b-2 md:[&_>div]:border-b-0 md:flex-row
        md:[&_>div]:px-6 mt-15  [&>div>p]:text-white [&>div>p]:text-[0.8rem] [&_>div]:w-fit items-center md:items-baseline">
            <div className="flex flex-col items-center">
                <h3>2.4K+</h3>
                <p className="text-center">Jogadores ativos</p>
            </div>

            <div className="flex flex-col items-center">
                <h3>48</h3>
                <p className="text-center">Campeonatos realizados</p>
            </div>

            <div className="flex flex-col items-center">
                <h3>2.4K+</h3>
                <p className="text-center">Jogadores ativos</p>
            </div>

        </section>
    )
}