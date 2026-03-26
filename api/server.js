const express = require("express");
const cors = require("cors");

const usersRouter = require("./routes/users");
const projectsRouter = require("./routes/projects");
const tasksRouter = require("./routes/tasks");

const app = express();
const PORT = 3001;

// Permite peticiones desde el frontend (Next.js en puerto 3000)
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
}));

// Permite leer JSON en el body de las peticiones
app.use(express.json());

// RUTAS // cada router maneja un conjunto de endpoints relacionados (usuarios, proyectos, tareas) 
app.use("/api/users", usersRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/tasks", tasksRouter);

// muestra todos los endpoints disponibles
app.get("/", (req, res) => {
  res.json({
    message: "API - Sistema de Gestión de Proyectos",
    version: "1.0.0",
    endpoints: {
      usuarios: {
        "POST /api/users/login":    "Iniciar sesión",
        "POST /api/users/register": "Registrar nuevo usuario",
        "GET  /api/users":          "Listar todos los usuarios",
        "GET  /api/users/:id":      "Obtener usuario por ID",
        "DELETE /api/users/:id":    "Eliminar usuario",
      },
      proyectos: {
        "GET    /api/projects":           "Listar proyectos (filtro: ?managerId=)",
        "GET    /api/projects/:id":       "Obtener proyecto por ID",
        "POST   /api/projects":           "Crear proyecto { name, description, managerId }",
        "PUT    /api/projects/:id":       "Actualizar proyecto { name, description, status }",
        "DELETE /api/projects/:id":       "Eliminar proyecto y sus tareas",
      },
      tareas: {
        "GET    /api/tasks":         "Listar tareas (filtros: ?projectId= ?assignedTo=)",
        "GET    /api/tasks/:id":     "Obtener tarea por ID",
        "POST   /api/tasks":         "Crear tarea { title, description, projectId, assignedTo, priority }",
        "PUT    /api/tasks/:id":     "Actualizar tarea { title, description, status, priority, assignedTo }",
        "DELETE /api/tasks/:id":     "Eliminar tarea",
      },
    },
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: `Ruta '${req.path}' no encontrada.` });
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`\n🚀 API corriendo en http://localhost:${PORT}`);
  console.log(`📋 Ver endpoints en http://localhost:${PORT}/\n`);
});
