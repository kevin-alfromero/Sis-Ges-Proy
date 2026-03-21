const express = require("express");
const router = express.Router();
const { readDB, writeDB, generateId } = require("../middleware/db");

//Obtenemos la lista de proyectos, con opción de filtrar por managerId
router.get("/", (req, res) => {
  const db = readDB();
  let projects = db.projects;

  if (req.query.managerId) {
    projects = projects.filter((p) => p.managerId === req.query.managerId);
  }

  res.json(projects);
});

//  Obtiene un proyecto por ID //
router.get("/:id", (req, res) => {
  const db = readDB();
  const project = db.projects.find((p) => p.id === req.params.id);

  if (!project) {
    return res.status(404).json({ error: "Proyecto no encontrado." });
  }

  res.json(project);
});

// Crea un nuevo proyecto

router.post("/", (req, res) => {
  const { name, description, managerId } = req.body;

  if (!name || !managerId) {
    return res.status(400).json({ error: "Nombre y managerId son requeridos." });
  }

  const db = readDB();

  // Verificar que el manager existe y tiene rol Gerente
  const manager = db.users.find((u) => u.id === managerId);
  if (!manager) {
    return res.status(404).json({ error: "El usuario (manager) no existe." });
  }
  if (manager.role !== "Gerente") {
    return res.status(403).json({ error: "Solo un Gerente puede crear proyectos." });
  }

  const nuevoProyecto = {
    id: generateId(),
    name,
    description: description || "",
    managerId,
    managerName: manager.name,
    status: "Activo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.projects.push(nuevoProyecto);
  writeDB(db);
  res.status(201).json({ message: "Proyecto creado.", project: nuevoProyecto });
});


// Actualiza un proyecto existente
router.put("/:id", (req, res) => {
  const db = readDB();
  const index = db.projects.findIndex((p) => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: "Proyecto no encontrado." });
  }

  const { name, description, status } = req.body;
  const statusValidos = ["Activo", "En Pausa", "Completado", "Cancelado"];

  if (status && !statusValidos.includes(status)) {
    return res.status(400).json({ error: `Estado inválido. Use: ${statusValidos.join(", ")}` });
  }

  // Actualizamos solo los campos enviados
  db.projects[index] = {
    ...db.projects[index],
    ...(name && { name }),
    ...(description !== undefined && { description }),
    ...(status && { status }),
    updatedAt: new Date().toISOString(),
  };

  writeDB(db);
  res.json({ message: "Proyecto actualizado.", project: db.projects[index] });
});


// Elimina un proyecto y sus tareas asociadas
router.delete("/:id", (req, res) => {
  const db = readDB();
  const index = db.projects.findIndex((p) => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: "Proyecto no encontrado." });
  }

  const projectId = req.params.id;

  // Eliminar tareas asociadas al proyecto
  const tareasEliminadas = db.tasks.filter((t) => t.projectId === projectId).length;
  db.tasks = db.tasks.filter((t) => t.projectId !== projectId);

  db.projects.splice(index, 1);
  writeDB(db);

  res.json({ message: `Proyecto eliminado junto con ${tareasEliminadas} tarea(s) asociada(s).` });
});

module.exports = router;
