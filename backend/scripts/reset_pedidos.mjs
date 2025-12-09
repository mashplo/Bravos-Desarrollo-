import fetch from "node-fetch";

async function resetPedidos() {
  try {
    console.log("Conectando a la API de producción...");
    
    const backend = "https://bravos-backend-production.up.railway.app";
    
    // Necesitas un token de admin para borrar pedidos
    const adminToken = ""; // Poner token de admin aquí
    
    if (!adminToken) {
      console.log("⚠️  Necesitas hacer login como admin y obtener el token");
      console.log("Por ahora, solo puedo mostrar los pedidos actuales");
      
      const response = await fetch(`${backend}/api/pedidos`, {
        headers: {
          "Authorization": `Bearer ${adminToken || "token-temporal"}`
        }
      });
      
      if (response.ok) {
        const pedidos = await response.json();
        console.log(`📦 Pedidos actuales: ${pedidos.length}`);
        console.log("El próximo pedido será #" + (pedidos.length + 1));
      }
    } else {
      // Con token de admin, borrar todos los pedidos
      const response = await fetch(`${backend}/api/pedidos/entregados`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${adminToken}`
        }
      });
      
      const result = await response.json();
      console.log("✅ Resultado:", result);
    }
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

resetPedidos();
