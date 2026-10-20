const express = require("express");
const {
  prepararAreaReservas,
  validarReserva,
} = require("../middleware/reservas");

function crearRouterReservas(controlador) {
  const router = express.Router();

  router.use(prepararAreaReservas);
  router.get("/", controlador.listar);
  router.get("/nueva", controlador.nueva);
  router.post("/", validarReserva, controlador.crear);
  router.get("/:id", controlador.detalle);

  return router;
}

module.exports = { crearRouterReservas };
