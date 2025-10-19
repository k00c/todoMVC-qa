import { test, expect } from "@playwright/test";

// Helper functions for reusability
async function addTasks(
  page: import("@playwright/test").Page,
  tasks: string[],
) {
  const input = page.getByPlaceholder("What needs to be done?");
  for (const task of tasks) {
    await input.fill(task);
    await input.press("Enter");
  }
}

async function completeAllTasks(page: import("@playwright/test").Page) {
  const toggleAll = page.getByRole("checkbox", { name: /toggle all/i });
  await toggleAll.click();
}

async function clearCompletedTasks(page: import("@playwright/test").Page) {
  const clearCompleted = page.getByRole("button", { name: "Clear completed" });
  await clearCompleted.click();
}

test.describe("TodoMVC React - High Priority Functional Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application before each test
    await page.goto("/examples/react/dist");
  });

  test("Verify 'All' filter shows all tasks", async ({ page }) => {
    await test.step("Add multiple tasks", async () => {
      await addTasks(page, ["Task 1", "Task 2", "Task 3"]);
    });

    await test.step("Click 'All' filter", async () => {
      const allFilter = page.getByRole("link", { name: "All" });
      await allFilter.click();
    });

    await test.step("Verify all tasks are visible", async () => {
      const tasks = page.locator(".todo-list li");
      await expect(tasks).toHaveCount(3);
    });
  });

  test("Verify 'Active' filter shows only active tasks", async ({ page }) => {
    await test.step("Add multiple tasks", async () => {
      await addTasks(page, ["Task 1", "Task 2", "Task 3"]);
    });

    await test.step("Mark one task as completed", async () => {
      const toggle = page.locator(".toggle").first();
      await toggle.click();
    });

    await test.step("Click 'Active' filter", async () => {
      const activeFilter = page.getByRole("link", { name: "Active" });
      await activeFilter.click();
    });

    await test.step("Verify only active tasks are visible", async () => {
      const activeTasks = page.locator(".todo-list li:not(.completed)");
      await expect(activeTasks).toHaveCount(2);
    });
  });

  test("Verify 'Completed' filter shows only completed tasks", async ({
    page,
  }) => {
    await test.step("Add multiple tasks", async () => {
      await addTasks(page, ["Task 1", "Task 2", "Task 3"]);
    });

    await test.step("Mark one task as completed", async () => {
      const toggle = page.locator(".toggle").first();
      await toggle.click();
    });

    await test.step("Click 'Completed' filter", async () => {
      const completedFilter = page.getByRole("link", { name: "Completed" });
      await completedFilter.click();
    });

    await test.step("Verify only completed tasks are visible", async () => {
      const completedTasks = page.locator(".todo-list li.completed");
      await expect(completedTasks).toHaveCount(1);
    });
  });

  test("Mark all tasks as completed", async ({ page }) => {
    await test.step("Add multiple tasks", async () => {
      await addTasks(page, ["Task 1", "Task 2", "Task 3"]);
    });

    await test.step("Mark all tasks as completed", async () => {
      await completeAllTasks(page);
    });

    await test.step("Verify all tasks are marked as completed", async () => {
      const completedTasks = page.locator(".todo-list li.completed");
      await expect(completedTasks).toHaveCount(3);
    });
  });

  test("Add a single task", async ({ page }) => {
    await test.step('Add a task named "Buy groceries"', async () => {
      await addTasks(page, ["Buy groceries"]);
    });

    await test.step("Verify the task is added to the list", async () => {
      const task = page.getByText("Buy groceries");
      await expect(task).toBeVisible();
    });
  });

  test("Delete a single task", async ({ page }) => {
    await test.step("Add a task to delete", async () => {
      await addTasks(page, ["Task to delete"]);
    });

    await test.step("Delete the task", async () => {
      // hover over to do item to reveal delete button
      const task = page.getByText("Task to delete");
      await task.hover();
      const deleteButton = page.locator(".destroy");
      await deleteButton.click();
    });

    await test.step("Verify the task is deleted", async () => {
      const task = page.getByText("Task to delete");
      await expect(task).toBeHidden();
    });
  });

  test("Mark a task as completed", async ({ page }) => {
    await test.step("Add a task to mark as completed", async () => {
      await addTasks(page, ["Complete this task"]);
    });

    await test.step("Mark the task as completed", async () => {
      const toggle = page.locator(".toggle");
      await toggle.click();
    });

    await test.step("Verify the task is marked as completed", async () => {
      const completedTask = page.locator(".todo-list li.completed");
      await expect(completedTask).toBeVisible();
    });
  });

  test("Filter tasks by status", async ({ page }) => {
    await test.step("Add multiple tasks", async () => {
      await addTasks(page, ["Task 1", "Task 2"]);
    });

    await test.step("Mark one task as completed", async () => {
      const toggle = page.locator(".toggle").first();
      await toggle.click();
    });

    await test.step("Filter by Active tasks", async () => {
      const activeFilter = page.getByText("Active");
      await activeFilter.click();
      const activeTasks = page.locator(".todo-list li:not(.completed)");
      await expect(activeTasks).toHaveCount(1);
    });

    await test.step("Filter by Completed tasks", async () => {
      const completedFilter = page.getByRole("link", { name: "Completed" });
      await completedFilter.click();
      const completedTasks = page.locator(".todo-list li.completed");
      await expect(completedTasks).toHaveCount(1);
    });
  });

  test("Add multiple tasks", async ({ page }) => {
    await test.step("Add three tasks", async () => {
      await addTasks(page, ["Task 1", "Task 2", "Task 3"]);
    });

    await test.step("Verify all tasks are added", async () => {
      const tasks = page.locator(".todo-list li");
      await expect(tasks).toHaveCount(3);
      await expect(page.getByText("Task 1")).toBeVisible();
      await expect(page.getByText("Task 2")).toBeVisible();
      await expect(page.getByText("Task 3")).toBeVisible();
    });
  });

  test("Add a task with special characters", async ({ page }) => {
    await test.step("Add a task with special characters", async () => {
      await addTasks(page, ["Special !@#$%^*()"]);
    });

    await test.step("Verify the special character task is added", async () => {
      const task = page.getByText("Special !@#$%^*()");
      await expect(task).toBeVisible();
    });
  });

  test("Add a task with ampersand character (known bug)", async ({ page }) => {
    test.fail(
      true,
      "Known bug: & is rendered as &amp; (see bug register, bug #1)",
    );
    await addTasks(page, ["A & B"]);
    const task = page.getByText("A & B");
    await expect(task).toBeVisible();
  });

  test("Delete all tasks", async ({ page }) => {
    await test.step("Add multiple tasks", async () => {
      await addTasks(page, ["Task 1", "Task 2", "Task 3"]);
    });

    await test.step("Mark all tasks as completed", async () => {
      await completeAllTasks(page);
    });

    await test.step("Clear all completed tasks", async () => {
      await clearCompletedTasks(page);
    });

    await test.step("Verify all tasks are deleted", async () => {
      const tasks = page.locator(".todo-list li");
      await expect(tasks).toHaveCount(0);
    });
  });
});
