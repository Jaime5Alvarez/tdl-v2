import { NextRequest, NextResponse } from 'next/server'
import { TaskRepositoryFactory } from '@/modules/tasks/infrastructure/task-repository.factory'
import { CreateTaskUseCase } from '@/modules/tasks/application/create-task.use-case'
import { FindTasksByUserIdUseCase } from '@/modules/tasks/application/find-tasks-by-user-id.use-case'
import { createClient } from "@/utils/supabase/server";

const taskRepository = TaskRepositoryFactory()
const createTaskUseCase = new CreateTaskUseCase(taskRepository)
const findTasksByUserIdUseCase = new FindTasksByUserIdUseCase(taskRepository)

export async function GET(request: NextRequest) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser();
  
  if (!data.user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }
  const tasks = await findTasksByUserIdUseCase.execute(data.user.id)
  return NextResponse.json(tasks)
}

// POST /api/tasks
export async function POST(request: Request) {
  const data = await request.json()
  const task = await createTaskUseCase.execute(data)
  return NextResponse.json(task)
}
