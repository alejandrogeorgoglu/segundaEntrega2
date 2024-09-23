import express from "express";
import { createServer } from "http"; // Importar el servidor HTTP
import { Server as SocketIOServer } from "socket.io"; // Importar socket.io
import handlebars from "express-handlebars";
import __dirname from "./utils.js";

//Importamos los routers
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import { ProductManager } from "./ProductManager.js";

const app = express();
const httpServer = createServer(app); // Crear servidor HTTP
const io = new SocketIOServer(httpServer);
const productManager = new ProductManager("productos.json");

// Middleware para analizar el cuerpo de las solicitudes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para registrar todas las peticiones
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date()}`);
  next();
});

// Configuramos todo lo referente a las plantillas
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// Cargamos la carpeta 'public' como nuestra carpeta de archivos estáticos
app.use(express.static(__dirname + "/public"));

// Configuración de rutas
app.use("/api/products", productsRouter(io, productManager)); // Ruta para los productos
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter(io, productManager)); // Ruta para las vistas

// Inicializa WebSocket
io.on("connection", (socket) => {
  console.log("Cliente conectado");

  // Enviar la lista actual de productos al cliente
  socket.emit("updateProducts", productManager.getAllProducts());

  // Crear nuevo producto
  socket.on("newProduct", (product) => {
    productManager.addProduct(product);
    io.emit("updateProducts", productManager.getAllProducts());
  });

  // Eliminar producto
  socket.on("deleteProduct", (pid) => {
    productManager.deleteProduct(pid);
    io.emit("updateProducts", productManager.getAllProducts());
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});

// Arranca el servidor
const PORT = 8080;
httpServer.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
