export default function Hero() {
    return (
        <section 
            className="relative min-h-screen flex items-center justify-center px-4"
            style={{
                backgroundImage: 'url(https://img.freepik.com/vector-premium/hamburguesa-frita-francesa-64k-alta-calidad-foto-real-cinematografica_1160030-4088.jpg?semt=ais_hybrid&w=740&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            <div className="absolute inset-0 bg-black/50"></div>
            
            <div className="relative z-10 text-center text-white max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                    Bravos Burger
                </h1>
                <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
                    Las mejores hamburguesas de la ciudad con ingredientes frescos y sabores únicos
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href="/menu" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-lg text-lg transition-colors">
                        Ver Menú
                    </a>
                    <a 
                        href="/login"
                        className="bg-transparent border-2 border-white hover:bg-white hover:text-black font-bold py-3 px-6 rounded-lg text-lg transition-colors inline-block"
                    >
                        Ordenar Ahora
                    </a>
                </div>
            </div>
        </section>
    )
}