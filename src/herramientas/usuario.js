export async function add_item_carrito({ id }) {
  const carrito = localStorage.getItem("carrito")
    ? JSON.parse(localStorage.getItem("carrito"))
    : [];
  const index = carrito.findIndex((i) => String(i.id) === String(id));
  if (index === -1) {
    carrito.push({ id: id, cantidad: 1 });
  } else {
    carrito[index].cantidad = (carrito[index].cantidad || 0) + 1;
  }
  localStorage.setItem("carrito", JSON.stringify(carrito));
  return carrito;
}

export async function change_item_cantidad({ id, delta }) {
  // delta puede ser positivo o negativo
  const carrito = localStorage.getItem("carrito")
    ? JSON.parse(localStorage.getItem("carrito"))
    : [];
  const index = carrito.findIndex((i) => String(i.id) === String(id));
  if (index === -1) return carrito;

  carrito[index].cantidad = (carrito[index].cantidad || 0) + delta;
  if (carrito[index].cantidad <= 0) {
    // eliminar
    carrito.splice(index, 1);
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
  return carrito;
}

export async function set_item_cantidad({ id, cantidad }) {
  const carrito = localStorage.getItem("carrito")
    ? JSON.parse(localStorage.getItem("carrito"))
    : [];
  const index = carrito.findIndex((i) => String(i.id) === String(id));
  if (index === -1) {
    if (cantidad > 0) carrito.push({ id, cantidad });
  } else {
    if (cantidad <= 0) carrito.splice(index, 1);
    else carrito[index].cantidad = cantidad;
  }
  localStorage.setItem("carrito", JSON.stringify(carrito));
  return carrito;
}

export async function remove_item_carrito({ id }) {
  const carrito = localStorage.getItem("carrito")
    ? JSON.parse(localStorage.getItem("carrito"))
    : [];
  const nuevo = carrito.filter((i) => String(i.id) !== String(id));
  localStorage.setItem("carrito", JSON.stringify(nuevo));
  return nuevo;
}

export async function get_carrito() {
  const carrito = localStorage.getItem("carrito")
    ? JSON.parse(localStorage.getItem("carrito"))
    : [];
  return carrito;
}

export async function crear_pedido({ items, total, metodo_pago }) {
  // Requiere token JWT: primero comprobar si el usuario está autenticado
  const token = localStorage.getItem("token");
  if (!token) {
    return {
      success: false,
      message: "Debes iniciar sesión para realizar el pago",
    };
  }

  try {
    const backend = import.meta.env.VITE_API_URL;
    const resp = await fetch(`${backend}/api/pedidos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ items, total, metodo_pago }),
    });

    const data = await resp.json();

    if (!resp.ok) {
      return {
        success: false,
        message: data.message || "No se pudo crear el pedido",
        details: data,
      };
    }

    // Si se creó el pedido en el backend, limpiar carrito local y guardar el pedido localmente también
    localStorage.removeItem("carrito");
    const pedidos = localStorage.getItem("pedidos")
      ? JSON.parse(localStorage.getItem("pedidos"))
      : [];
    pedidos.push(data.pedido);
    localStorage.setItem("pedidos", JSON.stringify(pedidos));

    return {
      success: true,
      message: data.message || "Pedido creado",
      pedido: data.pedido,
    };
  } catch (error) {
    console.error("Error al crear pedido:", error);
    return { success: false, message: "Error de red al crear el pedido" };
  }
}

export async function get_pedidos() {
  // Si hay token, intentar obtener pedidos desde el backend (producción)
  const token = localStorage.getItem("token");
  const backend = import.meta.env.VITE_API_URL;
  if (token && backend) {
    try {
      const resp = await fetch(`${backend}/api/pedidos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!resp.ok) {
        // si falla, caer a los pedidos guardados localmente
        const pedidosLocal = localStorage.getItem("pedidos")
          ? JSON.parse(localStorage.getItem("pedidos"))
          : [];
        return pedidosLocal;
      }
      const data = await resp.json().catch(() => []);
      // si el backend devuelve un array de pedidos, sincronizar localStorage
      if (Array.isArray(data)) {
        localStorage.setItem("pedidos", JSON.stringify(data));
        return data;
      }
      // si la respuesta tiene forma { pedidos: [...] }
      if (data.pedidos && Array.isArray(data.pedidos)) {
        localStorage.setItem("pedidos", JSON.stringify(data.pedidos));
        return data.pedidos;
      }
      return [];
    } catch (error) {
      console.error("Error obteniendo pedidos desde backend:", error);
      const pedidosLocal = localStorage.getItem("pedidos")
        ? JSON.parse(localStorage.getItem("pedidos"))
        : [];
      return pedidosLocal;
    }
  }

  // fallback: pedidos locales
  const pedidos = localStorage.getItem("pedidos")
    ? JSON.parse(localStorage.getItem("pedidos"))
    : [];
  return pedidos;
}

export async function actualizar_estado_pedido({ id, nuevo_estado }) {
  const token = localStorage.getItem("token");
  const backend = import.meta.env.VITE_API_URL;

  // Si hay token, pedir al backend que actualice el estado
  if (token && backend) {
    try {
      const resp = await fetch(`${backend}/api/pedidos/${id}/estado`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nuevo_estado }),
      });
      if (!resp.ok) {
        console.error("Error actualizando estado en backend", resp.status);
      }
    } catch (error) {
      console.error("Error actualizando estado en backend:", error);
    }
  }

  // Actualizar localStorage para mantener UI responsiva
  const pedidos = localStorage.getItem("pedidos")
    ? JSON.parse(localStorage.getItem("pedidos"))
    : [];
  const pedido_index = pedidos.findIndex((p) => p.id === id);
  if (pedido_index !== -1) {
    pedidos[pedido_index].estado = nuevo_estado;
    localStorage.setItem("pedidos", JSON.stringify(pedidos));
  }
  return pedidos;
}

// =====================================================
// FUNCIONES DE SESIÓN
// =====================================================

export async function cerrar_sesion() {
  // Primero limpiar localStorage para garantizar cierre local
  const token = localStorage.getItem("token");
  const deviceId = localStorage.getItem("deviceId");
  
  // Limpiar inmediatamente el storage local
  localStorage.removeItem("usuario_actual");
  localStorage.removeItem("token");
  localStorage.removeItem("carrito");
  localStorage.removeItem("pedidos");
  
  // Luego intentar notificar al backend (sin bloquear)
  if (token) {
    try {
      const backend = import.meta.env.VITE_API_URL;
      await fetch(`${backend}/api/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ deviceId }),
      }).catch(() => {});
    } catch {
      // Ignorar errores del backend - la sesión ya está cerrada localmente
    }
  }
  
  return { success: true, message: "Sesión cerrada" };
}

export async function obtener_usuario_actual() {
  const usuario = localStorage.getItem("usuario_actual");
  return usuario ? JSON.parse(usuario) : null;
}

// =====================================================
// FUNCIONES DE RESEÑAS
// =====================================================
export async function crear_resena({ comentario, calificacion }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return {
      success: false,
      message: "Debes iniciar sesión para dejar una reseña",
    };
  }

  try {
    const backend = import.meta.env.VITE_API_URL;
    const resp = await fetch(`${backend}/api/resenas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ comentario, calificacion }),
    });

    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      return {
        success: false,
        message: data.message || "No se pudo publicar la reseña",
        details: data,
      };
    }

    return {
      success: true,
      message: data.message || "Reseña publicada exitosamente",
      resena: data.resena,
    };
  } catch (error) {
    console.error("Error creando reseña:", error);
    return { success: false, message: "Error de red al crear la reseña" };
  }
}

export async function get_resenas() {
  try {
    const backend = import.meta.env.VITE_API_URL;
    const resp = await fetch(`${backend}/api/resenas`);
    if (!resp.ok) return [];
    const data = await resp.json().catch(() => []);
    return data;
  } catch (error) {
    console.error("Error obteniendo reseñas:", error);
    return [];
  }
}

/**
 * Valida que los items del carrito tengan IDs válidos
 * Usa la API de productos para validar
 */
export async function validate_carrito_items() {
  const carrito = localStorage.getItem("carrito")
    ? JSON.parse(localStorage.getItem("carrito"))
    : [];

  // Obtener productos válidos desde la API
  try {
    const backend = import.meta.env.VITE_API_URL;
    const resp = await fetch(`${backend}/api/productos`);
    if (resp.ok) {
      const data = await resp.json();
      const productIds = data.productos?.map((p) => p.id) || [];

      const validItems = carrito.filter((item) =>
        productIds.includes(Number(item.id))
      );

      localStorage.setItem("carrito", JSON.stringify(validItems));
      return validItems;
    }
  } catch (error) {
    console.error("Error validando carrito:", error);
  }

  // Fallback: devolver carrito sin validar
  return carrito;
}
