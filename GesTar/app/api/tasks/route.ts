export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET: Obtener tareas (filtradas por rol)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const isManager = session.user.role === 'manager';

    // El gerente ve todas las tareas, el usuario solo las suyas
    const tasks = await prisma.task.findMany({
      where: isManager ? {} : { assignedToId: session.user.id },
      include: { assignedTo: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Error al obtener tareas' }, { status: 500 });
  }
}

// POST: Crear tarea (solo gerente)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    if (session.user.role !== 'manager') {
      return NextResponse.json({ error: 'Solo los gerentes pueden crear tareas' }, { status: 403 });
    }

    const { title, description, status, sector, assignedToId } = await request.json();

    if (!title) {
      return NextResponse.json({ error: 'El título es requerido' }, { status: 400 });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description: description || '',
        status: status || 'por_comenzar',
        sector: sector || '',
        assignedToId: assignedToId || null,
      },
      include: { assignedTo: { select: { id: true, name: true, email: true } } },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Error al crear tarea' }, { status: 500 });
  }
}
