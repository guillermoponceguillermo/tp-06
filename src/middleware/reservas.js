const salasPermitidas = ["Sala Norte", "Sala Sur", "Sala Multimedia"];
const turnosPermitidos = ["Mañana", "Tarde", "Noche"];

function prepararAreaReservas(req, res, next) {
  res.locals.seccion = "Reservas de salas";
  next();
}

function validarReserva(req, res, next) {
  const campoOriginal = (nombre) =>
    typeof req.body?.[nombre] === "string" ? req.body[nombre] : "";
  const valores = {
    estudiante: campoOriginal("estudiante"),
    email: campoOriginal("email"),
    sala: campoOriginal("sala"),
    fecha: campoOriginal("fecha"),
    turno: campoOriginal("turno"),
    personas: campoOriginal("personas"),
  };
  const estudiante = valores.estudiante.trim();
  const email = valores.email.trim();
  const sala = valores.sala.trim();
  const fecha = valores.fecha.trim();
  const turno = valores.turno.trim();
  const personas = Number(valores.personas);
  let error = null;

  if (
    !estudiante ||
    !email ||
    !sala ||
    !fecha ||
    !turno ||
    !valores.personas.trim()
  ) {
    error = "Completa todos los campos para registrar la reserva.";
  } else if (!email.includes("@")) {
    error = "Ingresa un email válido que incluya @.";
  } else if (!salasPermitidas.includes(sala)) {
    error = "La sala seleccionada no está permitida.";
  } else if (!turnosPermitidos.includes(turno)) {
    error = "El turno seleccionado no está permitido.";
  } else if (!Number.isInteger(personas) || personas < 1 || personas > 6) {
    error = "La cantidad de personas debe ser un entero entre 1 y 6.";
  }

  if (error) {
    return res.status(400).render("reservas/nueva", {
      titulo: "Nueva reserva | Salas de estudio",
      error,
      valores,
    });
  }

  req.reservaValidada = { estudiante, email, sala, fecha, turno, personas };
  next();
}

module.exports = { prepararAreaReservas, validarReserva };
