const NombreTablas = require("./tablas");

const getAllUsers = async (db) => {
  const query = `SELECT * FROM ${NombreTablas.UsuariosCiudadania360}`;
  return await db.query(query);
};

const getUserByEmail = async (db, correo) => {
  const query = `SELECT * FROM ${NombreTablas.UsuariosCiudadania360} WHERE Correo = @correo and Eliminado = 0`;
  const request = new db.Request();
  request.input("correo", db.NVarChar, correo);
  return await request.query(query);
};

const updateUser = async (db, usuario) => {
  const {
    Id,
    Nombre,
    Entidad,
    Correo,
    Perfil,
    TiempoInactividad,
    TyC,
    Accesos,
  } = usuario;

  const query = `
    UPDATE ${NombreTablas.UsuariosCiudadania360}
    SET Nombre = @Nombre, Entidad = @Entidad, Correo = @Correo, Perfil = @Perfil, TiempoInactividad = @TiempoInactividad, TyC = @TyC, Accesos = @Accesos
    WHERE Id = @Id`;

  const request = new db.Request();
  request.input("Id", db.Int, Id);
  request.input("Nombre", db.NVarChar, Nombre);
  request.input("Entidad", db.NVarChar, Entidad);
  request.input("Correo", db.NVarChar, Correo);
  request.input("Perfil", db.NVarChar, Perfil);
  request.input("TiempoInactividad", db.Int, TiempoInactividad);
  request.input("TyC", db.Int, TyC);
  request.input("Accesos", db.NVarChar, Accesos);

  const result = await request.query(query);
  return result.rowsAffected[0];
};

const verificarUsuarioPorCorreo = async (db, correo) => {
  const result = await getUserByEmail(db, correo);
  return result.recordset.length > 0; // Retorna true si ya existe un usuario con ese correo.
};

const crearUsuario = async (db, usuario) => {
  const { Nombre, Entidad, Correo, Perfil, TiempoInactividad, Accesos, TyC } =
    usuario;

  const query = `
    INSERT INTO ${NombreTablas.UsuariosCiudadania360} (Nombre, Entidad, Correo, Perfil, TiempoInactividad, Accesos, TyC)
    VALUES (@Nombre, @Entidad, @Correo, @Perfil, @TiempoInactividad, @Accesos, @TyC)
  `;

  const request = new db.Request();
  request.input("Nombre", db.NVarChar, Nombre);
  request.input("Entidad", db.NVarChar, Entidad);
  request.input("Correo", db.NVarChar, Correo);
  request.input("Perfil", db.NVarChar, Perfil);
  request.input("TiempoInactividad", db.Int, TiempoInactividad);
  if (!TyC) request.input("TyC", db.Int, 0);
  else request.input("TyC", db.Int, TyC);

  let accesos = null;
  if (Accesos) {
    accesos = JSON.stringify(Accesos);
  }
  request.input("Accesos", db.NVarChar, accesos);

  await request.query(query);
};

const eliminarUsuarioLogicamente = async (db, userId) => {
  const query = `UPDATE ${NombreTablas.UsuariosCiudadania360} SET eliminado = 1 WHERE Id = @userId`;
  const request = new db.Request();
  request.input("userId", db.Int, userId);
  return await request.query(query);
};

module.exports = {
  getAllUsers,
  getUserByEmail,
  updateUser,
  crearUsuario,
  verificarUsuarioPorCorreo,
  eliminarUsuarioLogicamente,
};
