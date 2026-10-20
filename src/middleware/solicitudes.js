let siguienteSolicitud = 0;

function identificarSolicitud(req, res, next) {
  siguienteSolicitud += 1;
  res.locals.solicitudId = `BIB-${String(siguienteSolicitud).padStart(4, "0")}`;
  next();
}

function medirDuracion(req, res, next) {
  const inicio = process.hrtime.bigint();

  res.on("finish", () => {
    const duracionMs = Number(process.hrtime.bigint() - inicio) / 1_000_000;
    console.log(
      `${res.locals.solicitudId} ${req.method} ${req.originalUrl} ${res.statusCode} ${duracionMs.toFixed(2)} ms`,
    );
  });

  next();
}

module.exports = { identificarSolicitud, medirDuracion };
