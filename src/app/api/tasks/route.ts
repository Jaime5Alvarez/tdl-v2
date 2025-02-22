import { NextRequest, NextResponse } from 'next/server'
import { TaskRepositoryFactory } from 'src/modules/tasks/infrastructure/task-repository.factory'
import { CreateTaskUseCase } from 'src/modules/tasks/application/create-task.use-case'
import { FindTasksByUserIdAndDateUseCase } from 'src/modules/tasks/application/find-tasks-by-user-id-and-date.use-case'
import { createClient } from "src/utils/supabase/server";
import { CreateTaskDto } from 'src/modules/tasks/domain/dto/create-task.dto';

const taskRepository = TaskRepositoryFactory()
const createTaskUseCase = new CreateTaskUseCase(taskRepository)
const findTasksByUserIdAndDateUseCase = new FindTasksByUserIdAndDateUseCase(taskRepository)

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const date = searchParams.get('date')

  if (!date) {
    return NextResponse.json({
      message: "field date was not provided",
    }, { status: 400 })
  }

  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser();

  if (!data.user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }
  const tasks = await findTasksByUserIdAndDateUseCase.execute(data.user.id, new Date(date))
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
