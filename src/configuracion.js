function configurarEntorno(entorno = process.env) {
  const port = entorno.PORT === undefined ? 3000 : Number(entorno.PORT);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT debe ser un número entero entre 1 y 65535.");
  }

  return {
    port,
    nodeEnv: entorno.NODE_ENV || "development",
  };
}

module.exports = { configurarEntorno };
