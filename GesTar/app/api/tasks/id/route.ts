export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// PUT: Actualizar tarea
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const isManager = session.user.role === 'manager';

    // Verificar que la tarea existe
    const existingTask = await prisma.task.findUnique({ where: { id } });
    if (!existingTask) {
      return NextResponse.json({ error: 'Tarea no encontrada' }, { status: 404 });
    }

    // Usuario solo puede actualizar el estado de sus propias tareas
    if (!isManager) {
      if (existingTask.assignedToId !== session.user.id) {
        return NextResponse.json({ error: 'No tienes permiso para editar esta tarea' }, { status: 403 });
      }
      // Usuario solo puede cambiar el estado
      const task = await prisma.task.update({
        where: { id },
        data: { status: body.status },
        include: { assignedTo: { select: { id: true, name: true, email: true } } },
      });
      return NextResponse.json(task);
    }

    // Gerente puede actualizar todo
    const task = await prisma.task.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        status: body.status,
        sector: body.sector,
        assignedToId: body.assignedToId || null,
      },
      include: { assignedTo: { select: { id: true, name: true, email: true } } },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Error al actualizar tarea' }, { status: 500 });
  }
}

// DELETE: Eliminar tarea (solo gerente)
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    if (session.user.role !== 'manager') {
      return NextResponse.json({ error: 'Solo los gerentes pueden eliminar tareas' }, { status: 403 });
    }

    const { id } = params;
    await prisma.task.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ error: 'Error al eliminar tarea' }, { status: 500 });
  }
}
