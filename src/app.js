import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";

//Importamos los routers
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";

const app = express();

//Inicializar el servidor
app.listen(8080, () => {
  console.log("El servido se encuentra escuchando");
});

//Configuramos todo lo referente a las plantillas
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
// Cargamos la carpeta 'public' como nuestra carpeta de archivos estáticos
app.use(express.static(__dirname + "/public"));
//Usamos el enrutador para las vistas
app.use("/", viewsRouter);

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
