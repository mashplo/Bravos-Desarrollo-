import Hero from "../components/landing/hero"
import Conceptos from "../components/landing/conceptos"
import Footer from "../components/footer"
import Navbar from "../components/navbar"
import RDF from "../components/rdfButton"

export default function Home() {
    return (
        <main>
            <Navbar />
	    <RDF />
            <Hero />
            <Conceptos />
            <Footer />
        </main>
    )
}