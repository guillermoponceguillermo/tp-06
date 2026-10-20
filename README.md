# Trabajo práctico 06 - Refactorización modular de reservas

## Proyecto de partida y cambios

La copia parte de `tp-05-pipeline`, la aplicación funcional disponible en el workspace. TP05 y esta copia permanecen separadas; no se copiaron `.git`, `node_modules` ni `.env`. Se reorganizó el mismo sitio de reservas en módulos, sin agregar persistencia ni rutas nuevas. Se conservan los cuatro datos ficticios iniciales, vistas, layout, CSS, Morgan, validación y respuestas HTTP.

## Instalación y ejecución

Requiere Node.js 18 o superior y npm.

```bash
npm install
npm start
```

Sin variables de entorno, el sitio usa el puerto `3000` y `NODE_ENV=development`. Para configurar un puerto alternativo o producción, asignar variables al proceso antes de ejecutar. En PowerShell:

```powershell
$env:PORT='3116'
$env:NODE_ENV='development'
npm start
```

`.env.example` documenta los nombres admitidos, pero `npm start` no necesita ni carga `.env`. Para formato y análisis estático:

```bash
npm run format
npm run check
```

## Configuración del entorno

`src/configuracion.js` convierte `PORT` a número, usa 3000 si no está definido y rechaza valores vacíos, no numéricos, fraccionarios o fuera del rango 1-65535 con un mensaje claro. También devuelve `NODE_ENV`, que selecciona Morgan `dev` en desarrollo y `combined` en producción. Esto solo cambia el formato del registro, no el comportamiento de las rutas.

Se probó el puerto alternativo 3116 y respondió. `PORT=70000 npm start` no inicia el servidor y muestra `PORT debe ser un número entero entre 1 y 65535.`. No se necesita secreto ni conexión de base de datos.

## Mapa de módulos y dependencias

| Módulo | Responsabilidad |
| --- | --- |
| `src/index.js` | Declara los cuatro datos iniciales, crea una sola instancia del servicio y el app, lee configuración e inicia el puerto. |
| `src/configuracion.js` | Procesa `PORT` y `NODE_ENV`; no crea Express ni escribe registros. |
| `src/app.js` | Configura vistas y pipeline, monta rutas de aplicación y 404 final. |
| `src/rutas/reservas.js` | Declara caminos relativos al montaje `/reservas` y conecta middleware/controlador. |
| `src/controladores/reservas.js` | Obtiene datos del servicio, renderiza vistas, responde JSON, redirige y pasa al 404. |
| `src/servicios/reservas.js` | Encapsula el único arreglo; lista, busca, cuenta y crea sin depender de HTTP o EJS. |
| `src/middleware/solicitudes.js` | Asigna ID `BIB-` y mide hasta `finish`. |
| `src/middleware/reservas.js` | Define sección y valida/normaliza el POST. |
| `views/`, `public/` | Vistas EJS y recursos originales de la aplicación. |

El servicio no usa `res`: su responsabilidad es operar con datos y devolver resultados, por lo que puede reutilizarse desde distintos controladores. El controlador conoce HTTP y traduce esos resultados a render, JSON, redirección o `next()`. El router declara `/`, `/nueva` y `/:id` porque se monta en `/reservas`; así no repite ese prefijo y registra `/nueva` antes de `/:id`.

La semilla vive en el arranque, pero el arreglo mutable queda encapsulado dentro de la única instancia de `crearServicioReservas`. `/estado`, el listado, detalle y POST reciben el mismo servicio. Al reiniciar Node, se vuelve a crear el servicio desde los cuatro datos iniciales y desaparecen las reservas agregadas durante la ejecución.

## Pipeline y contrato de rutas

```text
Morgan -> identificarSolicitud -> medirDuracion -> layouts -> static
       -> urlencoded -> json -> rutas / y /estado -> router /reservas -> 404
```

Morgan y la medición propia registran solicitudes HTTP, incluidas respuestas estáticas, 200, 302, 400 y 404. El ID queda en `res.locals.solicitudId`; `/estado` incluye ese ID y el conteo del mismo servicio que modifica el POST. El parser `express.urlencoded` aparece antes de la validación. En entradas inválidas, el middleware responde `400` y no llama a `next()`; en entradas válidas, guarda los campos normalizados en `req.reservaValidada` y continúa al controlador.

| Método y ruta | Respuesta |
| --- | --- |
| GET `/` | `200`, inicio. |
| GET `/estado` | `200`, JSON con estado, cantidad e ID `BIB-`. |
| GET `/reservas` | `200`, listado. |
| GET `/reservas/nueva` | `200`, formulario. |
| GET `/reservas/:id` | `200` si existe; `404` HTML si no. |
| POST `/reservas` | `302` al listado si es válido; `400` con valores conservados si es inválido. |
| GET `/css/estilos.css` | `200`, CSS estático. |
| Cualquier otra URL | `404` HTML. |

## Matriz antes/después

Se ejecutó la matriz con la app de TP05 original en el puerto 3105 y con TP06 refactorizado en 3116. Ambos servidores se iniciaron sin `.env`; cada proceso comenzó con cuatro reservas. La creación válida fue ficticia y solo modificó la memoria de ese proceso.

| Caso | Antes: TP05 | Después: TP06 |
| --- | --- | --- |
| GET `/` | `200`, inicio | `200`, inicio |
| GET `/estado` | `200`, 4 reservas e ID BIB- | `200`, 4 reservas e ID BIB- |
| GET `/reservas` | `200`, listado de 4 | `200`, listado de 4 |
| GET `/reservas/nueva` | `200`, formulario | `200`, formulario |
| GET `/reservas/1` | `200`, detalle | `200`, detalle |
| GET `/reservas/999` | `404`, vista HTML | `404`, vista HTML |
| GET `/css/estilos.css` | `200` | `200` |
| GET `/url-inexistente` | `404`, vista HTML | `404`, vista HTML |
| POST inválido (estudiante vacío) | `400`, sin alta | `400`, sin alta; conteo permaneció en 4 |
| POST válido | `302` a `/reservas` | `302` a `/reservas`; GET de listado `200` |
| Conteo tras POST válido | `/estado`: 5 | `/estado`: 5 |
| Reinicio | Aplicación inicia con semilla de 4 | Después de detener el proceso y reiniciar, `/estado` respondió 200 con 4 reservas |
| Puerto alternativo | No probado en esta matriz | Puerto 3116 respondió correctamente |
| Puerto inválido | No configurado | `70000`: no inicia; muestra error explícito |

Las terminales registraron Morgan y medición `BIB-` para `200`, `302`, `400` y `404`. La matriz fue un smoke test reproducible desde esta copia; no se adjuntaron capturas. Reiniciar el servidor restablece la semilla porque el servicio es en memoria, no porque exista persistencia.

## Formato y análisis estático

Ejecutado en este proyecto:

```text
npm install       correcto; 0 vulnerabilidades informadas
npm run format    correcto
npm run check     correcto (Prettier y ESLint)
```

ESLint se aplica a CommonJS en `src`. `package-lock.json` está actualizado; `.gitignore` excluye `.env` y `node_modules/`.

## Persistencia temporal y límites

No hay MongoDB ni otra persistencia en TP06. El arreglo existe en memoria en la instancia única del servicio y se reinicializa al reiniciar el proceso. La unidad 7 incorporará modelos y scripts Mongoose separados mientras el sitio sigue en memoria; la unidad 8 migrará el servicio HTTP para que la web y la API usen MongoDB.