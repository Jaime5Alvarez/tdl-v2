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
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

const taskService = new TaskService()

export default function TodoList() {
  const [todos, setTodos] = useState<Task[]>([])
  const [newTask, setNewTask] = useState("")
  const [newTaskDescription, setNewTaskDescription] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState("")
  const [editingDescription, setEditingDescription] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()
  const [newTaskDueDate, setNewTaskDueDate] = useState<string>("")
  const [editingDueDate, setEditingDueDate] = useState<string>("")

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
    
    const tempId = crypto.randomUUID()
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Optimistic update
        const optimisticTask: Task = {
          id: tempId,
          title: newTask,
          description: newTaskDescription || null,
          userId: user.id,
          completed: false,
          createdAt: new Date().toISOString(),
          dueDate: newTaskDueDate ? new Date(newTaskDueDate).toISOString() : null,
          isRecurring: null
        }
        
        setTodos(prev => [...prev, optimisticTask])
        setNewTask("")
        setNewTaskDescription("")
        setNewTaskDueDate("")

        // Realizar la petición real
        const createTaskDto = new CreateTaskDto({
          title: newTask,
          description: newTaskDescription || undefined,
          userId: user.id,
          dueDate: newTaskDueDate ? new Date(newTaskDueDate) : undefined,
        })
        
        const actualTask = await taskService.createTask(createTaskDto)
        
        // Actualizar con la respuesta real
        setTodos(prev => prev.map(task => 
          task.id === tempId ? actualTask : task
        ))
      }
    } catch (error) {
      // Revertir en caso de error
      setTodos(prev => prev.filter(task => task.id !== tempId))
      setError('Error al crear la tarea')
      console.error(error)
    }
  }

  const toggleTask = async (id: string) => {
    try {
      const task = todos.find(t => t.id === id)
      if (task) {
        // Optimistic update
        setTodos(prev => prev.map(todo => 
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ))

        const updateTaskDto = new UpdateTaskDto({
          completed: !task.completed
        })
        
        const updatedTask = await taskService.updateTask(id, updateTaskDto)
        
        // Actualizar con la respuesta real
        setTodos(prev => prev.map(todo => 
          todo.id === id ? updatedTask : todo
        ))
      }
    } catch (error) {
      // Revertir en caso de error
      setTodos(prev => prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ))
      setError('Error al actualizar la tarea')
      console.error(error)
    }
  }

  const deleteTask = async (id: string) => {
    // Declarar la variable antes del try
    const deletedTask = todos.find(t => t.id === id)
    try {
      // Optimistic update
      setTodos(prev => prev.filter(todo => todo.id !== id))
      await taskService.deleteTask(id)
    } catch (error) {
      // Revertir en caso de error
      if (deletedTask) {
        setTodos(prev => [...prev, deletedTask])
      }
      setError('Error al eliminar la tarea')
      console.error(error)
    }
  }

  const saveEdit = async () => {
    if (editingId === null) return
    
    const originalTask = todos.find(t => t.id === editingId)
    try {
      // Optimistic update
      setTodos(prev => prev.map(todo =>
        todo.id === editingId ? { 
          ...todo, 
          title: editingText,
          description: editingDescription,
          dueDate: editingDueDate ? new Date(editingDueDate).toISOString() : null
        } : todo
      ))
      setEditingId(null)
      setEditingText("")
      setEditingDescription("")
      setEditingDueDate("")

      const updateTaskDto = new UpdateTaskDto({
        title: editingText,
        description: editingDescription || undefined,
        dueDate: editingDueDate ? new Date(editingDueDate) : undefined
      })
      
      const updatedTask = await taskService.updateTask(editingId, updateTaskDto)
      
      // Actualizar con la respuesta real
      setTodos(prev => prev.map(todo => 
        todo.id === editingId ? updatedTask : todo
      ))
    } catch (error) {
      // Revertir en caso de error
      if (originalTask) {
        setTodos(prev => prev.map(todo =>
          todo.id === editingId ? originalTask : todo
        ))
      }
      setError('Error al guardar los cambios')
      console.error(error)
    }
  }

  if (isLoading) return <div>Cargando...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <Card className="max-w-md mx-auto mt-10 min-h-[500px] flex flex-col bg-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Todo List</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Input
            type="text"
            placeholder="Task title"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
          />
          <Input
            type="text"
            placeholder="Task description (optional)"
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
          />
          <Input
            type="date"
            value={newTaskDueDate}
            onChange={(e) => setNewTaskDueDate(e.target.value)}
          />
          <Button variant={"default"} onClick={addTask} className="w-full">Add Task</Button>
        </div>
        <ul className="space-y-2 flex-grow">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex flex-col p-2 bg-muted rounded"
            >
              {editingId === todo.id ? (
                <div className="flex flex-col gap-2">
                  <Input
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className="flex-grow"
                    autoFocus
                    placeholder="Task title"
                  />
                  <Input
                    type="text"
                    value={editingDescription}
                    onChange={(e) => setEditingDescription(e.target.value)}
                    className="flex-grow"
                    placeholder="Task description (optional)"
                  />
                  <Input
                    type="date"
                    value={editingDueDate}
                    onChange={(e) => setEditingDueDate(e.target.value)}
                    className="flex-grow"
                  />
                  <div className="flex justify-end gap-2">
                    <Button size="sm" onClick={saveEdit} className="mr-1">
                      <Check className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                    <Button size="sm" onClick={() => {
                      setEditingId(null)
                      setEditingText("")
                      setEditingDescription("")
                      setEditingDueDate("")
                    }} variant="outline">
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Checkbox
                        id={`todo-${todo.id}`}
                        checked={todo.completed ?? false}
                        onCheckedChange={() => toggleTask(todo.id)}
                        className="mr-2"
                      />
                      <div className="flex flex-col">
                        <label
                          htmlFor={`todo-${todo.id}`}
                          className={`${
                            todo.completed ? "line-through text-gray-500" : ""
                          }`}
                        >
                          {todo.title}
                        </label>
                        {todo.description && (
                          <span className="text-sm text-gray-500">
                            {todo.description}
                          </span>
                        )}
                        {todo.dueDate && (
                          <span className="text-sm text-gray-500">
                            Due: {new Date(todo.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingId(todo.id)
                          setEditingText(todo.title)
                          setEditingDescription(todo.description || "")
                          setEditingDueDate(todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : "")
                        }}
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
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

