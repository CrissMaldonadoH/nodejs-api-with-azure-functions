const connect = require("../BaseDatos/db-conexion");
const queries = require("../BaseDatos/db-queries");

module.exports = async function (context, req) {
  context.log("Ejecutando llamado a ObtenerUsuarios");
  let db;
  try {
    db = await connect();

    // Realiza la consulta
    const resultado = await queries.getAllUsers(db);

    const usuarios = resultado.recordset;
    usuarios?.forEach((usuario) => {
      if (usuario.Accesos) {
        usuario.Accesos = JSON.parse(usuario.Accesos);
      }
    });
    0;
    context.res = {
      body: usuarios,
    };
  } catch (error) {
    context.log(`Error: ${error}`);
    context.res = {
      status: 500,
      body: `Error al conectar a la base de datos: ${error.message}`,
    };
  } finally {
    await db.close();
  }
};
