import express from "express";
import cors from "cors";
import { sequelize } from "./config/database.js";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// =====================================================
// VERIFICACIÓN DE VARIABLES DE ENTORNO
// =====================================================
const isProduction = process.env.NODE_ENV === "production";

if (!process.env.JWT_SECRET) {
  if (isProduction) {
    console.error("❌ FATAL: JWT_SECRET no está configurado en producción");
    process.exit(1);
  } else {
    console.warn("⚠️ ADVERTENCIA: JWT_SECRET no configurado. Usando valor de desarrollo.");
    process.env.JWT_SECRET = "dev_secret_only_for_local_development";
  }
}

// =====================================================
// IMPORTS DE RUTAS
// =====================================================
import authRoutes from "./routes/auth.routes.js";
import pedidosRoutes from "./routes/pedido.routes.js";
import resenaRoutes from "./routes/resena.routes.js";
import productosRoutes from "./routes/productos.routes.js";
import profileRoutes from "./routes/profile.routes.js";

// Para obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// =====================================================
// MIDDLEWARES
// =====================================================
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// =====================================================
// RUTAS DE LA API
// =====================================================
app.use("/api", profileRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/pedidos", pedidosRoutes);
app.use("/api/resenas", resenaRoutes);
app.use("/api/productos", productosRoutes);

// Sincronizar modelos (solo al inicio) con manejo de errores
sequelize
  .sync()
  .then(() => {
    console.log("✅ DB lista");
  })
  .catch((error) => {
    console.error("❌ Error sincronizando DB:", error.message);
  });

// Ruta de prueba
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Backend funcionando" });
});

app.get("/", (req, res) => {
  res.send("✅ Servidor desplegado correctamente en Railway!");
});

// imagen de grafo
app.get("/api/grafo", (req, res) => {
  const imagePath = join(__dirname, "../data/grafo.png");
  console.log("📂 Buscando imagen en:", imagePath);
  res.sendFile(imagePath, (err) => {
    if (err) {
      console.error("Error enviando imagen:", err);
      res
        .status(err.status || 500)
        .json({ error: "No se pudo cargar la imagen" });
    }
  });
});

// Endpoint para RDF en formato Turtle
app.get("/api/rdf/turtle", (req, res) => {
  try {
    const rdfPath = join(__dirname, "../data/bravosRDF.ttl");
    const rdfContent = readFileSync(rdfPath, "utf8");

    res.set("Content-Type", "text/turtle; charset=utf-8");
    res.send(rdfContent);
  } catch (error) {
    console.error("Error leyendo archivo Turtle:", error);
    res.status(500).json({
      error: "Error al leer archivo RDF",
      details: error.message,
    });
  }
});

// Endpoint para RDF en formato XML (descarga)
app.get("/api/rdf/xml", (req, res) => {
  try {
    const rdfPath = join(__dirname, "../data/bravosRDF.rdf");
    const rdfContent = readFileSync(rdfPath, "utf8");

    res.set("Content-Type", "application/rdf+xml; charset=utf-8");
    res.send(rdfContent);
  } catch (error) {
    console.error("Error leyendo archivo RDF/XML:", error);
    res.status(500).json({
      error: "Error al leer archivo RDF/XML",
      details: error.message,
    });
  }
});

// Endpoint para ver RDF/XML en el navegador (como texto)
app.get("/api/rdf/xml/view", (req, res) => {
  try {
    const rdfPath = join(__dirname, "../data/bravosRDF.rdf");
    const rdfContent = readFileSync(rdfPath, "utf8");

    // Forzar que se muestre como texto plano
    res.set("Content-Type", "text/plain; charset=utf-8");
    res.send(rdfContent);
  } catch (error) {
    console.error("Error leyendo archivo RDF/XML:", error);
    res.status(500).json({
      error: "Error al leer archivo RDF/XML",
      details: error.message,
    });
  }
});

// Endpoint general que acepta formato como parámetro
app.get("/api/rdf", (req, res) => {
  const format = req.query.format || "turtle"; // Por defecto Turtle

  try {
    let rdfPath, contentType, fileContent;

    if (format === "xml") {
      rdfPath = join(__dirname, "../data/bravosRDF.rdf");
      contentType = "application/rdf+xml; charset=utf-8";
    } else {
      rdfPath = join(__dirname, "../data/bravosRDF.ttl");
      contentType = "text/turtle; charset=utf-8";
    }

    fileContent = readFileSync(rdfPath, "utf8");
    res.set("Content-Type", contentType);
    res.send(fileContent);
  } catch (error) {
    console.error("Error leyendo archivo RDF:", error);
    res.status(500).json({
      error: "Error al leer archivo RDF",
      details: error.message,
    });
  }
});

// =====================================================
// MIDDLEWARE DE MANEJO DE ERRORES GLOBAL
// =====================================================
// Ruta no encontrada (404)
app.use((req, res, next) => {
  res.status(404).json({
    error: "Recurso no encontrado",
    path: req.originalUrl,
    method: req.method
  });
});

// Manejador de errores global
app.use((err, req, res, next) => {
  console.error("❌ Error no manejado:", err);
  
  // No exponer detalles del error en producción
  const errorResponse = {
    error: "Error interno del servidor"
  };
  
  if (!isProduction) {
    errorResponse.message = err.message;
    errorResponse.stack = err.stack;
  }
  
  res.status(err.status || 500).json(errorResponse);
});

// =====================================================
// INICIAR SERVIDOR
// =====================================================
const PORT = process.env.PORT || 3000;

app.set("trust proxy", true);
app.listen(PORT, async () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📍 Entorno: ${isProduction ? "PRODUCCIÓN" : "DESARROLLO"}`);

  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a MySQL exitosa");
  } catch (error) {
    console.error("❌ Error conectando a MySQL:", error.message);
  }
});
