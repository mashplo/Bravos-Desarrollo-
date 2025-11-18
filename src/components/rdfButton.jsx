import { useState } from "react"
import { FileText, Download, ExternalLink, Copy } from "lucide-react"

export default function RdfButton() {
    const [open, setOpen] = useState(false)
    const [content, setContent] = useState('')
    const [format, setFormat] = useState('turtle')
    const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

    const fetchRdf = async (fmt) => {
        setFormat(fmt)
        try {
            const res = await fetch(`${backend}/api/rdf?format=${fmt}`)
            const txt = await res.text()
            setContent(txt)
        } catch (e) {
            setContent('Error cargando RDF')
        }
    }

    const handleOpen = async () => {
        await fetchRdf('turtle')
        setOpen(true)
    }

    const handleDownload = (fmt) => {
        const url = `${backend}/api/rdf?format=${fmt}`
        const a = document.createElement('a')
        a.href = url
        a.download = fmt === 'xml' ? 'bravosRDF.rdf' : 'bravosRDF.ttl'
        document.body.appendChild(a)
        a.click()
        a.remove()
    }

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(content)
            alert('RDF copiado al portapapeles')
        } catch (e) {
            alert('No se pudo copiar')
        }
    }

    return (
        <>
            <button onClick={handleOpen} title="RDF" className="p-2 rounded-full hover:bg-gray-200">
                <FileText size={22} />
            </button>

            <dialog id="rdf-modal" className={`modal ${open ? 'modal-open' : ''}`} onClose={() => setOpen(false)}>
                <div className="modal-box max-w-3xl">
                    <h3 className="font-bold text-lg flex items-center gap-2"><FileText /> RDF del sitio</h3>
                    <div className="flex gap-2 mt-3"> 
                        <button className={`btn btn-sm ${format==='turtle' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => fetchRdf('turtle')}>Turtle (.ttl)</button>
                        <button className={`btn btn-sm ${format==='xml' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => fetchRdf('xml')}>RDF/XML (.rdf)</button>
                        <div className="flex-1"></div>
                        <button className="btn btn-sm" onClick={() => handleDownload(format)}><Download size={14} className="mr-2"/>Descargar</button>
                        <a className="btn btn-sm btn-ghost" href={`${backend}/api/rdf?format=${format}`} target="_blank" rel="noreferrer"><ExternalLink size={14} className="mr-2"/>Abrir</a>
                        <button className="btn btn-sm btn-ghost" onClick={handleCopy}><Copy size={14} className="mr-2"/>Copiar</button>
                        <button className="btn btn-sm btn-ghost" onClick={() => window.open(`${backend}/api/grafo`, '_blank')}><ExternalLink size={14} className="mr-2"/>Ver Grafo</button>
                    </div>

                    <div className="mt-4 flex gap-4">
                        <div className="w-1/3 hidden md:block">
                            <div className="text-sm font-semibold mb-2">Grafo (preview)</div>
                            <img src={`${backend}/api/grafo`} alt="Grafo" className="w-full h-48 object-contain rounded shadow" />
                        </div>
                        <div className="flex-1">
                            <pre className="whitespace-pre-wrap max-h-96 overflow-auto bg-base-200 p-3 rounded text-sm">{content}</pre>
                        </div>
                    </div>

                    <div className="modal-action">
                        <button className="btn" onClick={() => setOpen(false)}>Cerrar</button>
                    </div>
                </div>
            </dialog>
        </>
    )
}
