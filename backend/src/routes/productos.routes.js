import { Router } from "express";

const router = Router();

// Lista centralizada de productos
const productos = [
  // Hamburguesas
  {
    id: 0,
    name: "Smash Burguer",
    price: 25.99,
    image_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80",
    category: "hamburguesas",
  },
  {
    id: 1,
    name: "Bacon Burguer",
    price: 26.99,
    image_url: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800&auto=format&fit=crop&q=80",
    category: "hamburguesas",
  },
  {
    id: 2,
    name: "Doble Carne",
    price: 27.99,
    image_url: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=800&auto=format&fit=crop&q=80",
    category: "hamburguesas",
  },
  {
    id: 3,
    name: "Americana",
    price: 26.49,
    image_url: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80",
    category: "hamburguesas",
  },
  {
    id: 4,
    name: "Carnívora",
    price: 28.99,
    image_url: "https://images.unsplash.com/photo-1551782450-17144efb9c50?w=800&auto=format&fit=crop&q=80",
    category: "hamburguesas",
  },
  {
    id: 5,
    name: "Cheese Burguer",
    price: 28.99,
    image_url: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&auto=format&fit=crop&q=80",
    category: "hamburguesas",
  },
  // Bebidas
  {
    id: 6,
    name: "Coca cola",
    price: 5.99,
    image_url: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=800&auto=format&fit=crop&q=80",
    category: "bebidas",
  },
  {
    id: 7,
    name: "Inka cola",
    price: 5.99,
    image_url: "https://mir-s3-cdn-cf.behance.net/projects/404/069e01209605969.Y3JvcCw0MjI1LDMzMDUsOTYyLDA.gif",
    category: "bebidas",
  },
  {
    id: 8,
    name: "Pepsi",
    price: 5.49,
    image_url: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=800&auto=format&fit=crop&q=80",
    category: "bebidas",
  },
  {
    id: 9,
    name: "Jugo de Fresa",
    price: 7.99,
    image_url: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800&auto=format&fit=crop&q=80",
    category: "bebidas",
  },
  {
    id: 10,
    name: "Limonada",
    price: 6.99,
    image_url: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=800&auto=format&fit=crop&q=80",
    category: "bebidas",
  },
  {
    id: 11,
    name: "Agua Mineral",
    price: 3.99,
    image_url: "https://images.unsplash.com/photo-1560023907-5f339617ea30?w=800&auto=format&fit=crop&q=80",
    category: "bebidas",
  },
];

// GET /api/productos - Obtener todos los productos
router.get("/", (req, res) => {
  const { category } = req.query;
  
  if (category) {
    const filtered = productos.filter(p => p.category === category);
    return res.json({ success: true, productos: filtered });
  }
  
  res.json({ success: true, productos });
});

// GET /api/productos/hamburguesas
router.get("/hamburguesas", (req, res) => {
  const hamburguesas = productos.filter(p => p.category === "hamburguesas");
  res.json({ success: true, productos: hamburguesas });
});

// GET /api/productos/bebidas
router.get("/bebidas", (req, res) => {
  const bebidas = productos.filter(p => p.category === "bebidas");
  res.json({ success: true, productos: bebidas });
});

// GET /api/productos/:id
router.get("/:id", (req, res) => {
  const producto = productos.find(p => p.id === parseInt(req.params.id));
  if (!producto) {
    return res.status(404).json({ success: false, message: "Producto no encontrado" });
  }
  res.json({ success: true, producto });
});

export default router;
