const API_URL = import.meta.env.VITE_API_URL || "https://bravos-backend-production.up.railway.app";

// Cache de productos para evitar llamadas repetidas
let productosCache = null;

async function fetchProductos() {
    if (productosCache) return productosCache;
    
    try {
        const response = await fetch(`${API_URL}/api/productos`);
        const data = await response.json();
        if (data.success) {
            productosCache = data.productos;
            return productosCache;
        }
    } catch (error) {
        console.error("Error obteniendo productos:", error);
    }
    
    // Fallback a datos locales si la API falla
    return getFallbackProductos();
}

function getFallbackProductos() {
    return [
        { id: 0, name: "Smash Burguer", price: 25.99, image_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80", category: "hamburguesas" },
        { id: 1, name: "Bacon Burguer", price: 26.99, image_url: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800&auto=format&fit=crop&q=80", category: "hamburguesas" },
        { id: 2, name: "Doble Carne", price: 27.99, image_url: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=800&auto=format&fit=crop&q=80", category: "hamburguesas" },
        { id: 3, name: "Americana", price: 26.49, image_url: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80", category: "hamburguesas" },
        { id: 4, name: "Carnívora", price: 28.99, image_url: "https://images.unsplash.com/photo-1551782450-17144efb9c50?w=800&auto=format&fit=crop&q=80", category: "hamburguesas" },
        { id: 5, name: "Cheese Burguer", price: 28.99, image_url: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&auto=format&fit=crop&q=80", category: "hamburguesas" },
        { id: 6, name: "Coca cola", price: 5.99, image_url: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=800&auto=format&fit=crop&q=80", category: "bebidas" },
        { id: 7, name: "Inka cola", price: 5.99, image_url: "https://mir-s3-cdn-cf.behance.net/projects/404/069e01209605969.Y3JvcCw0MjI1LDMzMDUsOTYyLDA.gif", category: "bebidas" },
        { id: 8, name: "Pepsi", price: 5.49, image_url: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=800&auto=format&fit=crop&q=80", category: "bebidas" },
        { id: 9, name: "Jugo de Fresa", price: 7.99, image_url: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800&auto=format&fit=crop&q=80", category: "bebidas" },
        { id: 10, name: "Limonada", price: 6.99, image_url: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=800&auto=format&fit=crop&q=80", category: "bebidas" },
        { id: 11, name: "Agua Mineral", price: 3.99, image_url: "https://images.unsplash.com/photo-1560023907-5f339617ea30?w=800&auto=format&fit=crop&q=80", category: "bebidas" },
    ];
}

export async function getHamburguesas() {
    const productos = await fetchProductos();
    return productos.filter(p => p.category === "hamburguesas");
}

export async function getBebidas() {
    const productos = await fetchProductos();
    return productos.filter(p => p.category === "bebidas");
}

export async function getHamburguesa({ id }) {
    const hamburguesas = await getHamburguesas();
    return hamburguesas[id] || null;
}

export async function getProducto({ id }) {
    const productos = await fetchProductos();
    const numericId = Number(id);
    return productos.find(p => p.id === numericId) || null;
}

// Limpiar cache (útil para forzar actualización)
export function clearProductosCache() {
    productosCache = null;
}