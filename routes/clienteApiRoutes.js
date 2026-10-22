const express = require("express");
const router = express.Router();

const controller = require("../controllers/clienteApiController");

/* =====================================================
   API REST - CLIENTES
   GET    /api/clientes       -> Listar
   GET    /api/clientes/:id   -> Consultar
   POST   /api/clientes       -> Cadastrar
   PUT    /api/clientes/:id   -> Alterar
   DELETE /api/clientes/:id   -> Excluir
===================================================== */
router.get("/", controller.listar);
router.get("/:id", controller.consultar);
router.post("/", controller.cadastrar);
router.put("/:id", controller.alterar);
router.delete("/:id", controller.excluir);

module.exports = router;
