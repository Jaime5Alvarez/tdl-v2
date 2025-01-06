import { CreateTaskDto } from "@/modules/tasks/domain/dto/create-task.dto";
import { UpdateTaskDto } from "@/modules/tasks/domain/dto/update-task.dto";
import { Task } from "@/modules/tasks/domain/entities/task";

export class TaskService {
  private baseUrl = '/api/tasks';

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(createTaskDto),
    });

    if (!response.ok) {
      throw new Error('Error al crear la tarea');
    }

    return response.json();
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateTaskDto),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar la tarea');
    }

    return response.json();
  }

  async deleteTask(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Error al eliminar la tarea');
    }
  }

  async getTasks(): Promise<Task[]> {
    const response = await fetch(`${this.baseUrl}`);

    if (!response.ok) {
      throw new Error('Error al obtener las tareas');
    }

    return response.json();
  }
} 