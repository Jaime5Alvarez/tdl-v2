"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Edit2, X, Check } from "lucide-react";
import { TaskService } from "@/services/task-service";
import { Task } from "@/modules/tasks/domain/entities/task";
import { createClient } from "@/utils/supabase/client";
import { CreateTaskDto } from "@/modules/tasks/domain/dto/create-task.dto";
import { UpdateTaskDto } from "@/modules/tasks/domain/dto/update-task.dto";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const taskService = new TaskService();

export default function TodoList() {
  const [todos, setTodos] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();
  const [newTaskDate, setNewTaskDate] = useState<Date>();
  const [editingDate, setEditingDate] = useState<Date>();

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const tasks = await taskService.getTasks();
        setTodos(tasks);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  const resetFields = () => {
    setNewTask("");
    setNewTaskDescription("");
    setNewTaskDate(undefined);
    setEditingId(null);
    setEditingText("");
    setEditingDescription("");
    setEditingDate(undefined);
  };
  
  const addTask = async () => {
    if (newTask.trim() === "") return;

    const tempId = crypto.randomUUID();
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const optimisticTask: Task = {
          id: tempId,
          title: newTask,
          description: newTaskDescription,
          dueDate: newTaskDate?.toISOString() || null,
          isRecurring: false,
          userId: user.id,
          completed: false,
          createdAt: new Date().toISOString(),
        };

        setTodos((prev) => [...prev, optimisticTask]);
        resetFields();

        const createTaskDto = new CreateTaskDto({
          title: optimisticTask.title,
          description: optimisticTask.description || undefined,
          dueDate: optimisticTask.dueDate,
          isRecurring: optimisticTask.isRecurring,
        });

        await taskService.createTask(createTaskDto);
      }
    } catch (error) {
      setTodos((prev) => prev.filter((task) => task.id !== tempId));
      console.error(error);
    }
  };

  const toggleTask = async (id: string) => {
    try {
      const task = todos.find((t) => t.id === id);
      if (task) {
        // Optimistic update
        setTodos((prev) =>
          prev.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
          )
        );

        const updateTaskDto = new UpdateTaskDto({
          completed: !task.completed,
        });

        const updatedTask = await taskService.updateTask(id, updateTaskDto);

        // Actualizar con la respuesta real
        setTodos((prev) =>
          prev.map((todo) => (todo.id === id ? updatedTask : todo))
        );
      }
    } catch (error) {
      // Revertir en caso de error
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
      console.error(error);
    }
  };

  const deleteTask = async (id: string) => {
    // Declarar la variable antes del try
    const deletedTask = todos.find((t) => t.id === id);
    try {
      // Optimistic update
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
      await taskService.deleteTask(id);
    } catch (error) {
      // Revertir en caso de error
      if (deletedTask) {
        setTodos((prev) => [...prev, deletedTask]);
      }
      console.error(error);
    }
  };

  const saveEdit = async () => {
    if (editingId === null) return;

    const originalTask = todos.find((t) => t.id === editingId);
    if (!originalTask) return;
    const optimisticTask: Task = {
      id: editingId,
      title: editingText,
      description: editingDescription,
      dueDate: editingDate?.toISOString() || null,
      completed: originalTask.completed,
      createdAt: originalTask.createdAt,
      userId: originalTask.userId,
      isRecurring: originalTask.isRecurring,
    };
    try {
      setTodos((prev) =>
        prev.map((todo) => (todo.id === editingId ? optimisticTask : todo))
      );
      resetFields();

      const updateTaskDto = new UpdateTaskDto({
        title: optimisticTask.title,
        description: optimisticTask.description || undefined,
        dueDate: optimisticTask.dueDate,
      });

      const updatedTask = await taskService.updateTask(
        editingId,
        updateTaskDto
      );
    } catch (error) {
      if (originalTask) {
        setTodos((prev) =>
          prev.map((todo) => (todo.id === editingId ? originalTask : todo))
        );
      }
      console.error(error);
    }
  };

  if (isLoading) return <div>Cargando...</div>;

  return (
    <Card className="max-w-md mx-auto mt-10 min-h-[500px] flex flex-col bg-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle></CardTitle>
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
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !newTaskDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {newTaskDate ? (
                  format(newTaskDate, "PPP")
                ) : (
                  <span>Pick a due date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={newTaskDate}
                onSelect={setNewTaskDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button variant={"default"} onClick={addTask} className="w-full">
            Add Task
          </Button>
        </div>
        <ul className="space-y-2 flex-grow">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex flex-col p-2 bg-background/95 border rounded-md"
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
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !editingDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {editingDate ? (
                          format(editingDate, "PPP")
                        ) : (
                          <span>Pick a due date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={editingDate}
                        onSelect={setEditingDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <div className="flex justify-end gap-2">
                    <Button size="sm" onClick={saveEdit} className="mr-1">
                      <Check className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        setEditingId(null);
                        setEditingText("");
                        setEditingDescription("");
                        setEditingDate(undefined);
                      }}
                      variant="outline"
                    >
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
                          setEditingId(todo.id);
                          setEditingText(todo.title);
                          setEditingDescription(todo.description || "");
                          setEditingDate(
                            todo.dueDate ? new Date(todo.dueDate) : undefined
                          );
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
  );
}
