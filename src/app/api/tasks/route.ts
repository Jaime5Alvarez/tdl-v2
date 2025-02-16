import { NextRequest, NextResponse } from 'next/server'
import { TaskRepositoryFactory } from '@/modules/tasks/infrastructure/task-repository.factory'
import { CreateTaskUseCase } from '@/modules/tasks/application/create-task.use-case'
import { FindTasksByUserIdUseCase } from '@/modules/tasks/application/find-tasks-by-user-id.use-case'
import { createClient } from "@/utils/supabase/server";
import { CreateTaskDto } from '@/modules/tasks/domain/dto/create-task.dto';

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
  const data: CreateTaskDto = await request.json()

  if (!data.title) {
    return NextResponse.json({
      message: "field title was not provided",
    }, { status: 400 })
  }

  else if (!data.date) {
    return NextResponse.json({
      message: "field date was not provided",
    }, { status: 400 })
  }

  else if (!data.id) {
    return NextResponse.json({
      message: "field id was not provided",
    }, { status: 400 })
  }

  const task = await createTaskUseCase.execute(data)
  return NextResponse.json(task)
}
