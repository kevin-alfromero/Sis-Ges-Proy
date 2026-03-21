const express = require("express");
const router = express.Router();
const { readDB, writeDB, generateId } = require("../middleware/db");


// Inicia sesión con email y contraseña
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email y contraseña son requeridos." });
  }

  const db = readDB();
  const user = db.users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: "Correo o contraseña incorrectos." });
  }

  // No devolvemos la contraseña
  const { password: _, ...userSinPassword } = user;
  res.json({ message: "Login exitoso.", user: userSinPassword });
});


// Registra un nuevo usuario
router.post("/register", (req, res) => {
  const { name, email, password, role = "Usuario" } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Nombre, email y contraseña son requeridos." });
  }

  const rolesValidos = ["Usuario", "Gerente"];
  if (!rolesValidos.includes(role)) {
    return res.status(400).json({ error: "Rol inválido. Use 'Usuario' o 'Gerente'." });
  }

  const db = readDB();

  // Verificar que el email no exista
  const emailExiste = db.users.find((u) => u.email === email);
  if (emailExiste) {
    return res.status(409).json({ error: "Este correo ya está registrado." });
  }

  const nuevoUsuario = {
    id: generateId(),
    name,
    email,
    password,
    role,
    createdAt: new Date().toISOString(),
  };

  db.users.push(nuevoUsuario);
  writeDB(db);

  const { password: _, ...usuarioSinPassword } = nuevoUsuario;
  res.status(201).json({ message: "Usuario registrado exitosamente.", user: usuarioSinPassword });
});


// Obtiene todos los usuarios (sin contraseñas)
router.get("/", (req, res) => {
  const db = readDB();
  const usuarios = db.users.map(({ password, ...u }) => u);
  res.json(usuarios);
});

// Obtiene un usuario por ID
router.get("/:id", (req, res) => {
  const db = readDB();
  const user = db.users.find((u) => u.id === req.params.id);

  if (!user) {
    return res.status(404).json({ error: "Usuario no encontrado." });
  }

  const { password, ...userSinPassword } = user;
  res.json(userSinPassword);
});


// Elimina un usuario
router.delete("/:id", (req, res) => {
  const db = readDB();
  const index = db.users.findIndex((u) => u.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: "Usuario no encontrado." });
  }

  db.users.splice(index, 1);
  writeDB(db);
  res.json({ message: "Usuario eliminado." });
});

module.exports = router;
