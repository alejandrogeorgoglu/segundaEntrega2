import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.render("home", {}); // De momento solo renderizamos la vista, no pasamos objetos
});

export default router;
