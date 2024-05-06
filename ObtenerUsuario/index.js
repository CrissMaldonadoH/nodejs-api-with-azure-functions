const connect = require("../BaseDatos/db-conexion");
const queries = require("../BaseDatos/db-queries");

module.exports = async function (context, req) {
  context.log("Ejecutando llamado a ObtenerUsuario");

  const correo = req.query.correo;

  if (!correo) {
    context.res = {
      status: 400,
      body: "Parametro correo no valido",
    };
    return;
  }

  let db;
  try {
    db = await connect();

    const result = await queries.getUserByEmail(db, correo);

    if (result.recordset.length === 0) {
      context.res = {
        status: 404,
        body: "Usuario no encontrado",
      };
      return;
    }

    const resultado = result.recordset[0]; // Devolvemos el primer registro ya que el correo debería ser único.
    resultado.Accesos = JSON.parse(resultado.Accesos);

    context.res = {
      body: resultado,
    };
  } catch (error) {
    context.log(`Error: ${error}`);
    context.res = {
      status: 500,
      body: `Error al consultar la base de datos: ${error.message}`,
    };
  } finally {
    await db.close();
  }
};
