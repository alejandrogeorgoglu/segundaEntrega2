import express from "express";

//Importamos los routers
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";

const app = express();

//Inicializar el servidor
app.listen(8080, () => {
  console.log("El servido se encuentra escuchando");
});

// Middleware para analizar el cuerpo de las solicitudes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Middleware para registrar todas las peticiones
// ES DEL TIPO NIVEL DE APLICACIÓN
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date()}`);
  next();
});

//Implementar los routers que creamos
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
