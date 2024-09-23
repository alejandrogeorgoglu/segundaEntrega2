import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Obtener __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta del archivo productos.json
const productsFilePath = path.join(__dirname, "./data/productos.json");

// Función para leer el archivo JSON
const readProductsFile = () => {
  if (fs.existsSync(productsFilePath)) {
    const data = fs.readFileSync(productsFilePath, "utf-8");
    return JSON.parse(data);
  }
  return [];
};

// Función para escribir en el archivo JSON
const writeProductsFile = (data) => {
  fs.writeFileSync(productsFilePath, JSON.stringify(data, null, 2));
};

const router = Router();

//====================================================================

// Obtener todos los productos

// En lugar de res.json, renderizamos la vista
router.get("/", (req, res) => {
  const products = readProductsFile();

  // Renderizamos la vista 'home' y pasamos los productos
  res.render("home", { products });
});

// Obtener /products/:pid : Devolver un producto con ID especificado
router.get("/:pid", (req, res) => {
  const products = readProductsFile();
  const productoIdBuscada = req.params.pid;
  const producto = products.find(
    (producto) => producto.pid === productoIdBuscada
  );

  if (!producto) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  res.json(producto);
});

//====================================================================

// Crear nuevo producto con id autogenerado
router.post("/", (req, res) => {
  const {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  } = req.body;

  // Validación de campos
  if (
    !title ||
    typeof title !== "string" ||
    !description ||
    typeof description !== "string" ||
    !code ||
    typeof code !== "string" ||
    !price ||
    typeof price !== "number" ||
    !stock ||
    typeof stock !== "number" ||
    !category ||
    typeof category !== "string"
  ) {
    return res.status(400).json({ error: "Datos inválidos" });
  }

  const validStatus = typeof status === "boolean" ? status : true;
  const products = readProductsFile();

  const nuevoProducto = {
    pid: uuidv4(), // ID autogenerado
    title,
    description,
    code,
    price,
    status: validStatus,
    stock,
    category,
    thumbnails: thumbnails || [],
  };

  products.push(nuevoProducto);
  writeProductsFile(products);

  res
    .status(201)
    .json({ message: "Producto creado exitosamente", product: nuevoProducto });
});

//====================================================================

// Actualizar un producto existente
router.put("/:pid", (req, res) => {
  const {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  } = req.body;
  const products = readProductsFile();
  const productoIdBuscada = req.params.pid;
  const productoIndex = products.findIndex(
    (producto) => producto.pid === productoIdBuscada
  );

  if (productoIndex === -1) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  if (
    !title ||
    typeof title !== "string" ||
    !description ||
    typeof description !== "string" ||
    !code ||
    typeof code !== "string" ||
    !price ||
    typeof price !== "number" ||
    !stock ||
    typeof stock !== "number" ||
    !category ||
    typeof category !== "string"
  ) {
    return res.status(400).json({ error: "Datos inválidos" });
  }

  const validStatus = typeof status === "boolean" ? status : true;

  products[productoIndex] = {
    ...products[productoIndex],
    title,
    description,
    code,
    price,
    status: validStatus,
    stock,
    category,
    thumbnails: thumbnails || products[productoIndex].thumbnails,
  };

  writeProductsFile(products);
  res.json(products[productoIndex]);
});

//====================================================================

// Eliminar un producto existente
router.delete("/:pid", (req, res) => {
  const products = readProductsFile();
  const productoIdAEliminar = req.params.pid;
  const productoIndex = products.findIndex(
    (producto) => producto.pid === productoIdAEliminar
  );

  if (productoIndex === -1) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  products.splice(productoIndex, 1);
  writeProductsFile(products);

  res.status(204).json({ message: "Producto eliminado" });
});

export default (io, productManager) => {
  // Ruta para crear un nuevo producto
  router.post("/", (req, res) => {
    const product = req.body;
    const newProduct = productManager.addProduct(product);
    io.emit("updateProducts", productManager.getAllProducts());
    res.status(201).json({ message: "Producto creado", product: newProduct });
  });

  // Ruta para eliminar un producto
  router.delete("/:pid", (req, res) => {
    const { pid } = req.params;
    productManager.deleteProduct(pid);
    io.emit("updateProducts", productManager.getAllProducts());
    res.status(204).json({ message: "Producto eliminado" });
  });

  return router;
};
