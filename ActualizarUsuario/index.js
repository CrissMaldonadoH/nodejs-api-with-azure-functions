const connect = require("../BaseDatos/db-conexion");
const queries = require("../BaseDatos/db-queries");
const { ValidadorUsuarioActualizar } = require("../Validadores/Validadores");

module.exports = async function (context, req) {
  context.log("Ejecutando llamado a ActualizarUsuario");

  const { error } = ValidadorUsuarioActualizar.validate(req.body);
  if (error) {
    context.res = {
      status: 400,
      body: `Validación falló: ${error.details[0].message}`,
    };
    return;
  }

  let db;
  try {
    db = await connect();

    const user = req.body;
    user.Accesos = JSON.stringify(user.Accesos);
    const rowsAffected = await queries.updateUser(db, req.body);

    if (rowsAffected > 0) {
      context.res = {
        body: "Entidad actualizada con éxito",
      };
    } else {
      context.res = {
        status: 404, // Not Found
        body: "Entidad no encontrada con el ID proporcionado.",
      };
    }
  } catch (error) {
    context.log(`Error: ${error}`);
    context.res = {
      status: 500,
      body: `Error al actualizar en la base de datos: ${error.message}`,
    };
  } finally {
    await db.close();
  }
};
