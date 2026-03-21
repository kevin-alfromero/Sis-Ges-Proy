const express = require("express");
const router = express.Router();
const { readDB, writeDB, generateId } = require("../middleware/db");


// Obtiene todas las tareas
router.get("/", (req, res) => {
  const db = readDB();
  let tasks = db.tasks;

  if (req.query.projectId) {
    tasks = tasks.filter((t) => t.projectId === req.query.projectId);
  }
  if (req.query.assignedTo) {
    tasks = tasks.filter((t) => t.assignedTo === req.query.assignedTo);
  }

  res.json(tasks);
});


// Obtiene una tarea por ID
router.get("/:id", (req, res) => {
  const db = readDB();
  const task = db.tasks.find((t) => t.id === req.params.id);

  if (!task) {
    return res.status(404).json({ error: "Tarea no encontrada." });
  }

  res.json(task);
});


// Crea una nueva tarea
router.post("/", (req, res) => {
  const { title, description, projectId, assignedTo, priority = "Media" } = req.body;

  if (!title || !projectId) {
    return res.status(400).json({ error: "Título y projectId son requeridos." });
  }

  const prioridadesValidas = ["Baja", "Media", "Alta"];
  if (!prioridadesValidas.includes(priority)) {
    return res.status(400).json({ error: `Prioridad inválida. Use: ${prioridadesValidas.join(", ")}` });
  }

  const db = readDB();

  // Verificar que el proyecto existe
  const project = db.projects.find((p) => p.id === projectId);
  if (!project) {
    return res.status(404).json({ error: "El proyecto no existe." });
  }

  // Verificar que el usuario asignado existe (si se envió)
  let assignedUserName = null;
  if (assignedTo) {
    const user = db.users.find((u) => u.id === assignedTo);
    if (!user) {
      return res.status(404).json({ error: "El usuario asignado no existe." });
    }
    assignedUserName = user.name;
  }

  const nuevaTarea = {
    id: generateId(),
    title,
    description: description || "",
    projectId,
    projectName: project.name,
    assignedTo: assignedTo || null,
    assignedUserName,
    priority,
    status: "Pendiente",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.tasks.push(nuevaTarea);
  writeDB(db);
  res.status(201).json({ message: "Tarea creada.", task: nuevaTarea });
});


// Actualiza una tarea existente
router.put("/:id", (req, res) => {
  const db = readDB();
  const index = db.tasks.findIndex((t) => t.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: "Tarea no encontrada." });
  }

  const { title, description, status, priority, assignedTo } = req.body;

  const statusValidos = ["Pendiente", "En Progreso", "Completada", "Cancelada"];
  const prioridadesValidas = ["Baja", "Media", "Alta"];

  if (status && !statusValidos.includes(status)) {
    return res.status(400).json({ error: `Estado inválido. Use: ${statusValidos.join(", ")}` });
  }
  if (priority && !prioridadesValidas.includes(priority)) {
    return res.status(400).json({ error: `Prioridad inválida. Use: ${prioridadesValidas.join(", ")}` });
  }

  // Verificar usuario asignado si se cambió
  let assignedUserName = db.tasks[index].assignedUserName;
  if (assignedTo !== undefined) {
    if (assignedTo === null) {
      assignedUserName = null;
    } else {
      const user = db.users.find((u) => u.id === assignedTo);
      if (!user) {
        return res.status(404).json({ error: "El usuario asignado no existe." });
      }
      assignedUserName = user.name;
    }
  }

  db.tasks[index] = {
    ...db.tasks[index],
    ...(title && { title }),
    ...(description !== undefined && { description }),
    ...(status && { status }),
    ...(priority && { priority }),
    ...(assignedTo !== undefined && { assignedTo, assignedUserName }),
    updatedAt: new Date().toISOString(),
  };

  writeDB(db);
  res.json({ message: "Tarea actualizada.", task: db.tasks[index] });
});


// Elimina una tarea
router.delete("/:id", (req, res) => {
  const db = readDB();
  const index = db.tasks.findIndex((t) => t.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: "Tarea no encontrada." });
  }

  db.tasks.splice(index, 1);
  writeDB(db);
  res.json({ message: "Tarea eliminada." });
});

module.exports = router;
