import fs from "fs";
import path from "path";
import __dirname from "./utils.js"; // Asumiendo que tienes esto implementado para obtener __dirname

export class ProductManager {
  constructor(filePath) {
    this.filePath = path.join(__dirname, "./routes/data/productos.json");
  }

  getAllProducts() {
    try {
      const data = fs.readFileSync(this.filePath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Error al leer el archivo:", error);
      throw error;
    }
  }

  addProduct(product) {
    const products = this.getAllProducts();
    product.pid = Date.now().toString(); // Generar un ID simple
    products.push(product);
    fs.writeFileSync(this.filePath, JSON.stringify(products, null, 2));
    return product;
  }

  deleteProduct(pid) {
    let products = this.getAllProducts();
    products = products.filter((product) => product.pid !== pid);
    fs.writeFileSync(this.filePath, JSON.stringify(products, null, 2));
  }
}
