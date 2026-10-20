const { configurarEntorno } = require("./configuracion");
const { crearAplicacion } = require("./app");
const { crearServicioReservas } = require("./servicios/reservas");

const reservasIniciales = [
  {
    id: 1,
    estudiante: "Lucía Fernández",
    email: "lucia.fernandez@example.com",
    sala: "Sala Norte",
    fecha: "2026-10-02",
    turno: "Mañana",
    personas: 2,
  },
  {
    id: 2,
    estudiante: "Tomás Benítez",
    email: "tomas.benitez@example.com",
    sala: "Sala Multimedia",
    fecha: "2026-10-03",
    turno: "Tarde",
    personas: 4,
  },
  {
    id: 3,
    estudiante: "Camila Rojas",
    email: "camila.rojas@example.com",
    sala: "Sala Sur",
    fecha: "2026-10-04",
    turno: "Noche",
    personas: 1,
  },
  {
    id: 4,
    estudiante: "Mateo Silva",
    email: "mateo.silva@example.com",
    sala: "Sala Norte",
    fecha: "2026-10-05",
    turno: "Tarde",
    personas: 6,
  },
];

const configuracion = configurarEntorno();
const servicioReservas = crearServicioReservas(reservasIniciales);
const app = crearAplicacion(servicioReservas, configuracion);

app.listen(configuracion.port, () => {
  console.log(`Servidor iniciado en http://localhost:${configuracion.port}`);
});
