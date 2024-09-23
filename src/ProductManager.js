//ACLARACIÓN: ProductManager.js es el componente central que maneja la lógica relacionada con los productos en mi aplicación, 
//asegurando que las operaciones de CRUD (Crear, Leer, Actualizar, Eliminar) se realicen de manera efectiva y que los datos 
//se mantengan persistentes en el sistema de archivos.


import fs from "fs";
import path from "path";
import __dirname from "./utils.js"; 

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
    product.pid = Date.now().toString(); 
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