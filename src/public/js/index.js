console.log('index.js cargado'); //Verifica la Ruta

document.addEventListener('DOMContentLoaded', () => {

    const socket = io(); 

// Listar los productos
       
    socket.on('updateProducts', (products) => {
    const productList = document.getElementById('productList');
    productList.innerHTML = ''; // Limpia la lista antes de actualizar

    products.forEach(product => {
        const li = document.createElement('li');
        li.innerHTML = `
            <h2>${product.title}</h2>
            <p>${product.description}</p>
            <p>Código: ${product.code}</p>
            <p>Precio: $${product.price}</p>
            <p>Status: ${product.status}</p>
            <p>Stock: ${product.stock}</p>
            <p>Categoría: ${product.category}</p>
            <p>Thumbnails: ${product.thumbnails}</p>
            <button class="deleteBtn" data-id="${product.pid}">Eliminar</button>
        `;
        productList.appendChild(li);
    });

//Evento para los botones de eliminar

    document.querySelectorAll('.deleteBtn').forEach(button => {
        button.addEventListener('click', () => {
            const pid = button.getAttribute('data-id');
            socket.emit('deleteProduct', pid);
        });
    });
});

// Manejo del formulario para agregar un nuevo producto

    document.getElementById('productForm').addEventListener('submit', (event) => {
    event.preventDefault(); 
    
    const formData = new FormData(event.target);
    const product = Object.fromEntries(formData.entries());

    // Convierte price y stock a números
    product.price = Number(product.price);
    product.stock = Number(product.stock);

    // Envia el nuevo producto a través del socket
    socket.emit('newProduct', product);

    // Limpia el formulario después de enviar
    event.target.reset();
    })
})
