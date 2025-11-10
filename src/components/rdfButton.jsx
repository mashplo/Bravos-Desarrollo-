import { useState } from 'react';

function DescargaRDF() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const descargarRDF = async (formato) => {
    setLoading(true);
    setError(null);
    
try {
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const url = formato === 'xml'
    ? `${baseURL}/api/rdf/xml`
    : `${baseURL}/api/rdf/turtle`;

      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Error al obtener el archivo RDF');
      }
      
      const rdfData = await response.text();
      
      // Crear y descargar archivo
      const extension = formato === 'xml' ? 'rdf' : 'ttl';
      const mimeType = formato === 'xml' 
        ? 'application/rdf+xml' 
        : 'text/turtle';
      
      const blob = new Blob([rdfData], { type: mimeType });
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `bravosRDF.${extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);
      
      console.log('✅ Archivo descargado exitosamente');
      
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

const abrirRDF = (formato) => {
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const url = formato === 'xml'
    ? `${baseURL}/api/rdf/xml/view`
    : `${baseURL}/api/rdf/turtle`;

  window.open(url, '_blank');
};


  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Datos RDF - Bravos</h2>
      
      <div className="space-y-4">
        {/* Botones de descarga */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Descargar archivos:</h3>
          <div className="flex gap-4">
            <button
              onClick={() => descargarRDF('turtle')}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50"
            >
              {loading ? 'Descargando...' : '⬇️ Turtle (.ttl)'}
            </button>
            
            <button
              onClick={() => descargarRDF('xml')}
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded disabled:opacity-50"
            >
              {loading ? 'Descargando...' : '⬇️ RDF/XML (.rdf)'}
            </button>
          </div>
        </div>

        {/* Botones para ver en navegador */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Ver en el navegador:</h3>
          <div className="flex gap-4">
            <button
              onClick={() => abrirRDF('turtle')}
              className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded"
            >
              👁️ Ver Turtle
            </button>
            
            <button
              onClick={() => abrirRDF('xml')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded"
            >
              👁️ Ver RDF/XML
            </button>
          </div>
        </div>
      </div>
      
<button
  onClick={() => {
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    window.open(`${baseURL}/api/grafo`, '_blank');
  }}
  className="bg-purple-100 hover:bg-purple-200 text-purple-800 px-6 py-2 rounded border border-purple-300"
>
  Ver Grafo
</button>


      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          Error: {error}
        </div>
      )}
    </div>
  );
}

export default DescargaRDF;