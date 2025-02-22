import { TaskRepositoryFactory } from "src/modules/tasks/infrastructure/task-repository.factory";
import { test, describe, expect } from "vitest";
import { userInfoTesting } from "src/__tests__/setUpTests";
import { randomUUID } from "crypto";

describe("DrizzleTaskRepository", () => {
  const taskId = randomUUID();
  test("Create a task by calling the create method", async () => {
    const TaskRepository = TaskRepositoryFactory();

    const result = await TaskRepository.create(
      {
        id: taskId,
        title: "Task test",
        description: "Description of task test",
        date: new Date().toISOString(),
      },
      userInfoTesting.id
    );
    expect(result).toBeDefined();
  }),
    test("Should a list of tasks", async () => {
      const TaskRepository = TaskRepositoryFactory();
      const result = await TaskRepository.findByUserIdAndDate(
        userInfoTesting.id,
        new Date()
      );
      expect(result).toBeInstanceOf(Array);
      expect(result).toBeDefined();
    });
  test("Should return a task by user id", async () => {
    const TaskRepository = TaskRepositoryFactory();
    const result = await TaskRepository.findById(userInfoTesting.id);
    expect(result).toBeDefined();
  });
  test("Should update a task", async () => {
    const TaskRepository = TaskRepositoryFactory();
    const title = "Task test updated";
    const description = "Description of task test updated";
    const completed = true;
    const date = new Date().toISOString();
    const result = await TaskRepository.update(taskId, {
      title,
      description,
      date,
      completed: completed,
    });
    expect(result.title).toBe(title);
    expect(result.description).toBe("Description of task test updated");
    expect(result.completed).toBeTruthy();
    expect(result).toBeDefined();
  });
  test("Should delete a task", async () => {
    const TaskRepository = TaskRepositoryFactory();
    await TaskRepository.delete(taskId);
    const result = await TaskRepository.findById(taskId);
    expect(result).toBeNull();
  });
});
