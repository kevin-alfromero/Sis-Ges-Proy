import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

/**
 * Script de seed para poblar la base de datos inicial
 * IMPORTANTE: No usar delete en producción para evitar pérdida de datos
 * Se usa upsert para evitar duplicados
 */
async function main() {
  console.log('Iniciando seed de la base de datos...');

  // Crear usuario gerente
  const managerPassword = await bcrypt.hash('johndoe123', 10);
  const manager = await prisma.user.upsert({
    where: { email: 'john@doe.com' },
    update: {},
    create: {
      email: 'john@doe.com',
      name: 'Juan Gerente',
      password: managerPassword,
      role: 'manager',
    },
  });
  console.log('Gerente creado:', manager.email);

  // Crear usuario regular
  const userPassword = await bcrypt.hash('maria123', 10);
  const regularUser = await prisma.user.upsert({
    where: { email: 'maria@empresa.com' },
    update: {},
    create: {
      email: 'maria@empresa.com',
      name: 'María López',
      password: userPassword,
      role: 'user',
    },
  });
  console.log('Usuario creado:', regularUser.email);

  // Crear tareas de ejemplo
  const tasks = [
    {
      title: 'Revisar reportes mensuales',
      description: 'Analizar y consolidar los reportes de ventas del mes anterior',
      status: 'pendiente_finalizacion',
      sector: 'Administración',
      assignedToId: regularUser.id,
    },
    {
      title: 'Actualizar documentación del proyecto',
      description: 'Completar la documentación técnica del sistema actual',
      status: 'por_comenzar',
      sector: 'Desarrollo',
      assignedToId: regularUser.id,
    },
    {
      title: 'Preparar presentación trimestral',
      description: 'Crear slides con resultados del Q1',
      status: 'completa',
      sector: 'Ventas',
      assignedToId: manager.id,
    },
  ];

  for (const task of tasks) {
    const existing = await prisma.task.findFirst({
      where: { title: task.title },
    });
    if (!existing) {
      await prisma.task.create({ data: task });
      console.log('Tarea creada:', task.title);
    }
  }

  console.log('Seed completado exitosamente!');
}

main()
  .catch((e) => {
    console.error('Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
