import Hero from "../components/landing/hero"
import Conceptos from "../components/landing/conceptos"
import Footer from "../components/footer"
import Navbar from "../components/navbar"

export default function Home() {
    return (
        <main>
            <Navbar />
            <Hero />
            <Conceptos />
            <Footer />
        </main>
    )
}