function crearControladorReservas(servicio) {
  return {
    inicio(req, res) {
      res.render("inicio", { titulo: "Inicio | Salas de estudio" });
    },
    estado(req, res) {
      res.json({
        servicio: "activo",
        reservas: servicio.contar(),
        solicitudId: res.locals.solicitudId,
      });
    },
    listar(req, res) {
      res.render("reservas/lista", {
        titulo: "Reservas | Salas de estudio",
        reservas: servicio.listar(),
      });
    },
    nueva(req, res) {
      res.render("reservas/nueva", {
        titulo: "Nueva reserva | Salas de estudio",
        error: null,
        valores: {},
      });
    },
    detalle(req, res, next) {
      const reserva = servicio.buscarPorId(req.params.id);
      if (!reserva) return next();

      res.render("reservas/detalle", {
        titulo: `Reserva ${reserva.id} | Salas de estudio`,
        reserva,
      });
    },
    crear(req, res) {
      servicio.crear(req.reservaValidada);
      res.redirect("/reservas");
    },
    noEncontrado(req, res) {
      res.status(404).render("no-encontrado", {
        titulo: "Página no encontrada",
        mensaje: "La dirección solicitada no existe.",
      });
    },
  };
}

module.exports = { crearControladorReservas };
