const connect = require("../BaseDatos/db-conexion");
const queries = require("../BaseDatos/db-queries");

module.exports = async function (context, req) {
  context.log("Ejecutando llamado a EliminarUsuario");

  const userId = req.query.id || (req.body && req.body.id);

  if (!userId) {
    context.res = {
      status: 400,
      body: "Por favor proporciona un ID de usuario.",
    };
    return;
  }

  let db;
  try {
    db = await connect();

    await queries.eliminarUsuarioLogicamente(db, userId);

    context.res = {
      status: 200,
      body: "Usuario eliminado lógicamente con éxito.",
    };
  } catch (error) {
    context.log(`Error: ${error}`);
    context.res = {
      status: 500,
      body: `Error al eliminar lógicamente el usuario en la base de datos: ${error.message}`,
    };
  } finally {
    await db.close();
  }
};
