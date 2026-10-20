function crearServicioReservas(datosIniciales = []) {
  const reservas = datosIniciales.map((reserva) => ({ ...reserva }));

  return {
    listar() {
      return reservas;
    },
    buscarPorId(id) {
      const idNumerico = Number(id);
      return reservas.find((reserva) => reserva.id === idNumerico) || null;
    },
    contar() {
      return reservas.length;
    },
    crear(datos) {
      const id = Math.max(0, ...reservas.map((reserva) => reserva.id)) + 1;
      const reserva = { id, ...datos };
      reservas.push(reserva);
      return reserva;
    },
  };
}

module.exports = { crearServicioReservas };
