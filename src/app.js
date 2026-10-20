const express = require("express");
const path = require("node:path");
const expressLayouts = require("express-ejs-layouts");
const morgan = require("morgan");
const { crearControladorReservas } = require("./controladores/reservas");
const { crearRouterReservas } = require("./rutas/reservas");
const {
  identificarSolicitud,
  medirDuracion,
} = require("./middleware/solicitudes");

function crearAplicacion(servicio, configuracion) {
  const app = express();
  const controlador = crearControladorReservas(servicio);

  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "..", "views"));
  app.set("layout", "layouts/main");

  app.use(morgan(configuracion.nodeEnv === "production" ? "combined" : "dev"));
  app.use(identificarSolicitud);
  app.use(medirDuracion);
  app.use(expressLayouts);
  app.use(express.static(path.join(__dirname, "..", "public")));
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.get("/", controlador.inicio);
  app.get("/estado", controlador.estado);
  app.use("/reservas", crearRouterReservas(controlador));
  app.use(controlador.noEncontrado);

  return app;
}

module.exports = { crearAplicacion };
