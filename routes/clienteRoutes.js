const express = require("express");
const router = express.Router();

const controller = require("../controllers/clienteController");

// Telas (EJS)
router.get("/", controller.index);
router.post("/salvar", controller.salvar);
router.get("/editar/:id", controller.formEditar);
router.post("/editar/:id", controller.editar);
router.post("/excluir/:id", controller.excluir);

// API simples para React Native (padrão do tutorial)
router.get("/api", controller.api);

module.exports = router;
