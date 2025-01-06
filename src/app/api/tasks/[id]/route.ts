import { NextResponse } from 'next/server'
import { TaskRepositoryFactory } from '@/modules/tasks/infrastructure/task-repository.factory'
import { UpdateTaskUseCase } from '@/modules/tasks/application/update-task.use-case'
import { DeleteTaskUseCase } from '@/modules/tasks/application/delete-task.use-case'

const taskRepository = TaskRepositoryFactory()
const updateTaskUseCase = new UpdateTaskUseCase(taskRepository)
const deleteTaskUseCase = new DeleteTaskUseCase(taskRepository)

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const data = await request.json()
  const task = await updateTaskUseCase.execute(id, data)
  return NextResponse.json(task)
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await deleteTaskUseCase.execute(params.id)
  return NextResponse.json({ success: true })
} 