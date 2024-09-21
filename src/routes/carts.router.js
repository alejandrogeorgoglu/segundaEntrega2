import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url"; // Importar fileURLToPath para obtener __dirname

const router = Router();

// Obtener __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths to JSON files

const carritoFilePath = path.join(__dirname, "./data/carrito.json");

// Helper functions to read and write JSON files
const readJSONFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
  }
  return [];
};

const writeJSONFile = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

//====================================================================

// Obtener todos los carritos
router.get("/", (req, res) => {
  const carts = readJSONFile(carritoFilePath);
  res.json(carts);
});

//====================================================================

// Crear nuevo carrito con id autogenerado y sus campos solicitados
router.post("/", (req, res) => {
  const { products } = req.body;

  // Validación del campo 'products', si se proporciona, debe ser un array de objetos
  if (
    products &&
    (!Array.isArray(products) ||
      !products.every((item) => typeof item === "object" && item !== null))
  ) {
    return res.status(400).json({
      error:
        "El campo 'products' debe ser un array de objetos que representen cada producto",
    });
  }

  const carts = readJSONFile(carritoFilePath);
  const nuevoCart = {
    id: uuidv4(), // ID autogenerado
    products: products || [], // Usa un array vacío si no se proporciona `products`
  };

  carts.push(nuevoCart);
  writeJSONFile(carritoFilePath, carts);

  res
    .status(201)
    .json({ message: "Carrito creado exitosamente", cart: nuevoCart });
});

//====================================================================

// Obtener los productos de un carrito específico por 'cid'
router.get("/:cid", (req, res) => {
  const carritoIdBuscado = req.params.cid;
  const carts = readJSONFile(carritoFilePath);
  const carrito = carts.find((cart) => cart.id === carritoIdBuscado);

  if (!carrito) {
    return res.status(404).json({ error: "Carrito no encontrado" });
  }

  res.json(carrito.products);
});

//====================================================================

// Dentro de un carrito especifico, agregar cantidades a un producto existente, sino agregar el producto.
router.post("/:cid/product/:pid", (req, res) => {
  const carritoIdBuscado = req.params.cid;
  const productoId = req.params.pid;
  const cantidad = req.body.quantity;

  // Validar cantidad
  if (typeof cantidad !== "number" || cantidad <= 0) {
    return res
      .status(400)
      .json({ error: "La cantidad debe ser un número positivo" });
  }

  const carts = readJSONFile(carritoFilePath);
  const carrito = carts.find((cart) => cart.id === carritoIdBuscado);

  if (!carrito) {
    return res.status(404).json({ error: "Carrito no encontrado" });
  }

  // Buscar si el producto ya está en el carrito
  const productoExistente = carrito.products.find(
    (product) => product.product === productoId
  );

  if (productoExistente) {
    // Si el producto ya existe, actualizar la cantidad
    productoExistente.quantity += cantidad;
  } else {
    // Si el producto no existe, agregarlo al carrito
    carrito.products.push({
      product: productoId,
      quantity: cantidad,
    });
  }

  writeJSONFile(carritoFilePath, carts);

  res
    .status(200)
    .json({ message: "Producto agregado al carrito", cart: carrito });
});

export default router;
