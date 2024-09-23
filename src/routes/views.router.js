import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.render("home", {}); // De momento solo renderizamos la vista, no pasamos objetos
});

export default (io, productManager) => {
  // Ruta para la vista de productos en tiempo real
  router.get("/realtimeproducts", (req, res) => {
    const products = productManager.getAllProducts();
    res.render("realTimeProducts", { products });
  });

  return router;
};
