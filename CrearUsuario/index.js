const connect = require("../BaseDatos/db-conexion");
const queries = require("../BaseDatos/db-queries");
const { ValidadorUsuario } = require("../Validadores/Validadores");

module.exports = async function (context, req) {
  context.log("Ejecutando llamado a CrearUsuario");

  const { error } = ValidadorUsuario.validate(req.body);
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

    // Verificar si ya existe un usuario con el correo especificado
    const existe = await queries.verificarUsuarioPorCorreo(db, req.body.Correo);

    if (existe) {
      context.res = {
        status: 409, // 409 Conflict
        body: "Ya existe un usuario con ese correo electrónico.",
      };
      return;
    }

    await queries.crearUsuario(db, req.body);

    context.res = {
      status: 201, // 201 Created
      body: "Usuario creado con éxito",
    };
  } catch (error) {
    context.log(`Error: ${error}`);
    context.res = {
      status: 500,
      body: `Error al crear el usuario en la base de datos: ${error.message}`,
    };
  } finally {
    await db.close();
  }
};
