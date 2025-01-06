"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2, Edit2, X, Check } from 'lucide-react'
import { TaskService } from "@/services/task-service"
import { Task } from "@/modules/tasks/domain/entities/task"
import { createClient } from '@/utils/supabase/client'
import { CreateTaskDto } from "@/modules/tasks/domain/dto/create-task.dto"
import { UpdateTaskDto } from "@/modules/tasks/domain/dto/update-task.dto"

const taskService = new TaskService()

export default function TodoList() {
  const [todos, setTodos] = useState<Task[]>([])
  const [newTask, setNewTask] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const tasks = await taskService.getTasks()
        setTodos(tasks)
      }
    } catch (error) {
      setError('Error al cargar las tareas')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const addTask = async () => {
    if (newTask.trim() === "") return

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const createTaskDto = new CreateTaskDto({
          title: newTask,
          userId: user.id,
        })
        const task = await taskService.createTask(createTaskDto)
        setTodos([...todos, task])
        setNewTask("")
      }
    } catch (error) {
      setError('Error al crear la tarea')
      console.error(error)
    }
  }

  const toggleTask = async (id: string) => {
    try {
      const task = todos.find(t => t.id === id)
      if (task) {
        const updateTaskDto = new UpdateTaskDto({
          completed: !task.completed
        })
        const updatedTask = await taskService.updateTask(id, updateTaskDto)
        setTodos(todos.map((todo) => todo.id === id ? updatedTask : todo))
      }
    } catch (error) {
      setError('Error al actualizar la tarea')
      console.error(error)
    }
  }

  const deleteTask = async (id: string) => {
    try {
      await taskService.deleteTask(id)
      setTodos(todos.filter((todo) => todo.id !== id))
    } catch (error) {
      setError('Error al eliminar la tarea')
      console.error(error)
    }
  }

  const saveEdit = async () => {
    if (editingId === null) return

    try {
      const updateTaskDto = new UpdateTaskDto({
        title: editingText
      })
      const updatedTask = await taskService.updateTask(editingId, updateTaskDto)
      setTodos(todos.map((todo) => todo.id === editingId ? updatedTask : todo))
      setEditingId(null)
      setEditingText("")
    } catch (error) {
      setError('Error al guardar los cambios')
      console.error(error)
    }
  }

  if (isLoading) return <div>Cargando...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md min-h-[500px] flex flex-col">
      <h1 className="text-2xl font-bold mb-4 text-center">Todo List</h1>
      <div className="flex mb-4">
        <Input
          type="text"
          placeholder="New task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          className="flex-grow mr-2"
        />
        <Button onClick={addTask}>Add</Button>
      </div>
      <ul className="space-y-2 flex-grow">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center justify-between p-2 bg-gray-100 rounded"
          >
            {editingId === todo.id ? (
              <div className="flex items-center flex-grow mr-2">
                <Input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  className="flex-grow mr-2"
                  autoFocus
                />
                <Button size="icon" onClick={saveEdit} className="mr-1">
                  <Check className="h-4 w-4" />
                </Button>
                <Button size="icon" onClick={() => setEditingId(null)} variant="outline">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <div className="flex items-center">
                  <Checkbox
                    id={`todo-${todo.id}`}
                    checked={todo.completed ?? false}
                    onCheckedChange={() => toggleTask(todo.id)}
                    className="mr-2"
                  />
                  <label
                    htmlFor={`todo-${todo.id}`}
                    className={`${
                      todo.completed ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {todo.title}
                  </label>
                </div>
                <div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingId(todo.id)}
                    className="mr-1"
                    aria-label="Edit task"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteTask(todo.id)}
                    aria-label="Delete task"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

