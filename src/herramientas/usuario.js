export async function add_item_carrito({id}) {
    const carrito = localStorage.getItem("carrito") ? JSON.parse(localStorage.getItem("carrito")) : []
    carrito.push({id: id, cantidad: 1})
    localStorage.setItem("carrito", JSON.stringify(carrito))
} 

export async function get_carrito() {
    const carrito = localStorage.getItem("carrito") ? JSON.parse(localStorage.getItem("carrito")) : []
    return carrito;
}

export async function crear_pedido({items, total, metodo_pago}) {
    const pedidos = localStorage.getItem("pedidos") ? JSON.parse(localStorage.getItem("pedidos")) : []
    const nuevo_pedido = {
        id: Date.now(),
        items: items,
        total: total,
        metodo_pago: metodo_pago,
        estado: "en_preparacion",
        fecha: new Date().toISOString()
    }
    pedidos.push(nuevo_pedido)
    localStorage.setItem("pedidos", JSON.stringify(pedidos))
    return nuevo_pedido
}

export async function get_pedidos() {
    const pedidos = localStorage.getItem("pedidos") ? JSON.parse(localStorage.getItem("pedidos")) : []
    return pedidos
}

export async function actualizar_estado_pedido({id, nuevo_estado}) {
    const pedidos = localStorage.getItem("pedidos") ? JSON.parse(localStorage.getItem("pedidos")) : []
    const pedido_index = pedidos.findIndex(p => p.id === id)
    if (pedido_index !== -1) {
        pedidos[pedido_index].estado = nuevo_estado
        localStorage.setItem("pedidos", JSON.stringify(pedidos))
    }
    return pedidos
}

// Funciones de autenticación
export async function registrar_usuario({nombre, email, password, direccion}) {
    const usuarios = localStorage.getItem("usuarios") ? JSON.parse(localStorage.getItem("usuarios")) : []
    
    // Verificar si el email ya existe
    const usuario_existente = usuarios.find(u => u.email === email)
    if (usuario_existente) {
        return { success: false, message: "El email ya está registrado" }
    }
    
    const nuevo_usuario = {
        id: Date.now(),
        nombre: nombre,
        email: email,
        password: password, // En producción esto debería estar hasheado
        direccion: direccion,
        fecha_registro: new Date().toISOString()
    }
    
    usuarios.push(nuevo_usuario)
    localStorage.setItem("usuarios", JSON.stringify(usuarios))
    
    return { success: true, message: "Usuario registrado exitosamente", usuario: nuevo_usuario }
}

export async function iniciar_sesion({email, password}) {
    const usuarios = localStorage.getItem("usuarios") ? JSON.parse(localStorage.getItem("usuarios")) : []
    
    console.log("Usuarios en localStorage:", usuarios)
    console.log("Intentando login con:", { email, password })
    
    // Verificar si es el administrador
    const es_admin = email === "esaul@gmail.com" && password === "contra123"
    
    let usuario = null
    
    if (es_admin) {
        // Crear usuario admin si no existe en la lista
        usuario = {
            id: 0,
            nombre: "Administrador",
            email: "esaul@gmail.com",
            password: "contra123",
            es_admin: true
        }
    } else {
        // Buscar en usuarios registrados
        usuario = usuarios.find(u => u.email === email && u.password === password)
    }
    
    console.log("Usuario encontrado:", usuario)
    
    if (!usuario) {
        return { success: false, message: "Email o contraseña incorrectos" }
    }
    
    // Guardar sesión actual
    localStorage.setItem("usuario_actual", JSON.stringify(usuario))
    
    return { 
        success: true, 
        message: "Sesión iniciada exitosamente", 
        usuario: usuario,
        es_admin: es_admin 
    }
}

export async function cerrar_sesion() {
    localStorage.removeItem("usuario_actual")
    return { success: true, message: "Sesión cerrada" }
}

export async function obtener_usuario_actual() {
    const usuario = localStorage.getItem("usuario_actual")
    return usuario ? JSON.parse(usuario) : null
}

// Funciones de reseñas
export async function crear_resena({comentario, calificacion}) {
    const usuario_actual = await obtener_usuario_actual()
    
    if (!usuario_actual) {
        return { success: false, message: "Debes iniciar sesión para dejar una reseña" }
    }
    
    const resenas = localStorage.getItem("resenas") ? JSON.parse(localStorage.getItem("resenas")) : []
    
    const nueva_resena = {
        id: Date.now(),
        usuario_id: usuario_actual.id,
        nombre: usuario_actual.nombre,
        comentario: comentario,
        calificacion: calificacion,
        fecha: new Date().toISOString()
    }
    
    resenas.push(nueva_resena)
    localStorage.setItem("resenas", JSON.stringify(resenas))
    
    return { success: true, message: "Reseña publicada exitosamente", resena: nueva_resena }
}

export async function get_resenas() {
    const resenas = localStorage.getItem("resenas") ? JSON.parse(localStorage.getItem("resenas")) : []
    return resenas
}