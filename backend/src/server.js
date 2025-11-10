import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './config/database.js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// Para obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend funcionando' });
});

// imagen de grafo
app.get('/api/grafo', (req, res) => {

  const imagePath = join(__dirname, '../data/grafo.png');
  console.log('📂 Buscando imagen en:', imagePath);
  res.sendFile(imagePath, (err) => {
    if (err) {
      console.error('Error enviando imagen:', err);
      res.status(err.status || 500).json({ error: 'No se pudo cargar la imagen' });
    }
  });
});


// Endpoint para RDF en formato Turtle
app.get('/api/rdf/turtle', (req, res) => {
  try {
    const rdfPath = join(__dirname, '../data/bravosRDF.ttl');
    const rdfContent = readFileSync(rdfPath, 'utf8');
    
    res.set('Content-Type', 'text/turtle; charset=utf-8');
    res.send(rdfContent);
  } catch (error) {
    console.error('Error leyendo archivo Turtle:', error);
    res.status(500).json({ 
      error: 'Error al leer archivo RDF',
      details: error.message 
    });
  }
});

// Endpoint para RDF en formato XML (descarga)
app.get('/api/rdf/xml', (req, res) => {
  try {
    const rdfPath = join(__dirname, '../data/bravosRDF.rdf');
    const rdfContent = readFileSync(rdfPath, 'utf8');
    
    res.set('Content-Type', 'application/rdf+xml; charset=utf-8');
    res.send(rdfContent);
  } catch (error) {
    console.error('Error leyendo archivo RDF/XML:', error);
    res.status(500).json({ 
      error: 'Error al leer archivo RDF/XML',
      details: error.message 
    });
  }
});

// Endpoint para ver RDF/XML en el navegador (como texto)
app.get('/api/rdf/xml/view', (req, res) => {
  try {
    const rdfPath = join(__dirname, '../data/bravosRDF.rdf');
    const rdfContent = readFileSync(rdfPath, 'utf8');
    
    // Forzar que se muestre como texto plano
    res.set('Content-Type', 'text/plain; charset=utf-8');
    res.send(rdfContent);
  } catch (error) {
    console.error('Error leyendo archivo RDF/XML:', error);
    res.status(500).json({ 
      error: 'Error al leer archivo RDF/XML',
      details: error.message 
    });
  }
});

// Endpoint general que acepta formato como parámetro
app.get('/api/rdf', (req, res) => {
  const format = req.query.format || 'turtle'; // Por defecto Turtle
  
  try {
    let rdfPath, contentType, fileContent;
    
    if (format === 'xml') {
      rdfPath = join(__dirname, '../data/bravosRDF.rdf');
      contentType = 'application/rdf+xml; charset=utf-8';
    } else {
      rdfPath = join(__dirname, '../data/bravosRDF.ttl');
      contentType = 'text/turtle; charset=utf-8';
    }
    
    fileContent = readFileSync(rdfPath, 'utf8');
    res.set('Content-Type', contentType);
    res.send(fileContent);
    
  } catch (error) {
    console.error('Error leyendo archivo RDF:', error);
    res.status(500).json({ 
      error: 'Error al leer archivo RDF',
      details: error.message 
    });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a MySQL exitosa');
  } catch (error) {
    console.error('❌ Error conectando a MySQL:', error.message);
  }
});