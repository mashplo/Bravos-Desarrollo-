export async function getHamburguesas() {
    const lista_hamburguesas = [
        { 
            name: "Smash Burguer", 
            price: 5.99, 
            image_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80" 
        },
        { 
            name: "Bacon Burguer", 
            price: 6.99, 
            image_url: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800&auto=format&fit=crop&q=80" 
        },
        { 
            name: "Doble Carne", 
            price: 7.99, 
            image_url: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=800&auto=format&fit=crop&q=80" 
        },
        { 
            name: "Americana", 
            price: 6.49, 
            image_url: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80" 
        },
        { 
            name: "Carnívora", 
            price: 8.99, 
            image_url: "https://images.unsplash.com/photo-1551782450-17144efb9c50?w=800&auto=format&fit=crop&q=80" 
        },
        { 
            name: "Cheese Burguer", 
            price: 8.99, 
            image_url: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&auto=format&fit=crop&q=80" 
        },
    ]
    return lista_hamburguesas;
}


export async function getBebidas() {
    const lista_bebidas = [
            { 
                name: "Coca cola", 
                price: 1.99, 
                image_url: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=800&auto=format&fit=crop&q=80" 
            },
            { 
                name: "Inka cola", 
                price: 0.99, 
                image_url: "https://mir-s3-cdn-cf.behance.net/projects/404/069e01209605969.Y3JvcCw0MjI1LDMzMDUsOTYyLDA.gif" 
            },
            { 
                name: "Pepsi", 
                price: 2.49, 
                image_url: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=800&auto=format&fit=crop&q=80" 
            },
            { 
                name: "Jugo de Fresa", 
                price: 3.99, 
                image_url: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800&auto=format&fit=crop&q=80" 
            },
            { 
                name: "Jugo de Mango", 
                price: 3.99, 
                image_url: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&auto=format&fit=crop&q=80" 
            },
            { 
                name: "Jugo de Piña", 
                price: 3.99, 
                image_url: "https://media.istockphoto.com/id/178035953/es/foto/preparados-jugo-de-pi%C3%B1a.jpg?s=612x612&w=0&k=20&c=Ugq7N5exScyAuCLm_Sc0FvSOJlpZlV7n_Y_eby2Iark=" 
            },
        ]
        
    return lista_bebidas;
}

export async function getHamburguesa({id}) {
    const hamburguesas = await getHamburguesas();
    return hamburguesas[id] || null;
}