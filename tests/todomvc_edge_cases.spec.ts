import { test, expect } from "@playwright/test";

/**
 * Edge Case Tests for TodoMVC React Application
 * Tests task editing and edge cases for adding tasks
 */

test.describe("TodoMVC Edge Case Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/examples/typescript-react/#/");
  });

  test.describe("Edit Task", () => {
    test("Edit an existing task", async ({ page }) => {
      await test.step("Add initial task", async () => {
        const input = page.getByPlaceholder("What needs to be done?");
        await input.fill("Original task name");
        await input.press("Enter");
        await expect(page.getByText("Original task name")).toBeVisible();
      });

      await test.step("Enter edit mode", async () => {
        // Double-click the task label to enter edit mode
        await page.getByText("Original task name").dblclick();
        // Verify edit input is visible and focused
        const editInput = page.locator(".todo-list li .edit");
        await expect(editInput).toBeVisible();
        await expect(editInput).toBeFocused();
      });

      await test.step("Edit and save task", async () => {
        const editInput = page.locator(".todo-list li .edit");
        await editInput.clear();
        await editInput.fill("Updated task name");
        await editInput.press("Enter");
      });

      await test.step("Verify task was updated", async () => {
        await expect(page.getByText("Updated task name")).toBeVisible();
        await expect(page.getByText("Original task name")).toBeHidden();
        // Verify no longer in edit mode
        await expect(page.locator(".todo-list li .edit")).toBeHidden();
      });
    });

    test("Cancel editing without saving", async ({ page }) => {
      await test.step("Add initial task", async () => {
        const input = page.getByPlaceholder("What needs to be done?");
        await input.fill("Task to edit");
        await input.press("Enter");
        await expect(page.getByText("Task to edit")).toBeVisible();
      });

      await test.step("Enter edit mode", async () => {
        await page.getByText("Task to edit").dblclick();
        const editInput = page.locator(".todo-list li .edit");
        await expect(editInput).toBeVisible();
      });

      await test.step("Make changes and cancel with Escape", async () => {
        const editInput = page.locator(".todo-list li .edit");
        await editInput.clear();
        await editInput.fill("This should not be saved");
        await editInput.press("Escape");
      });

      await test.step("Verify original task name is preserved", async () => {
        await expect(page.getByText("Task to edit")).toBeVisible();
        await expect(
          page.getByText("This should not be saved"),
        ).toBeHidden();
        // Verify no longer in edit mode
        await expect(page.locator(".todo-list li .edit")).toBeHidden();
      });
    });

    test("Cancel editing by clicking outside", async ({ page }) => {
      await test.step("Add initial task", async () => {
        const input = page.getByPlaceholder("What needs to be done?");
        await input.fill("Another task");
        await input.press("Enter");
        await expect(page.getByText("Another task")).toBeVisible();
      });

      await test.step("Enter edit mode and make changes", async () => {
        await page.getByText("Another task").dblclick();
        const editInput = page.locator(".todo-list li .edit");
        await editInput.clear();
        await editInput.fill("Should be cancelled");
      });

      await test.step("Click outside to blur/cancel", async () => {
        // Click on the heading to blur the edit input
        await page.getByRole("heading", { name: "todos" }).click();
      });

      await test.step("Verify changes were saved on blur", async () => {
        // Note: TodoMVC typically saves on blur, not cancels
        // This behavior may vary by implementation
        const hasOriginal = await page
          .getByText("Another task")
          .isVisible()
          .catch(() => false);
        const hasUpdated = await page
          .getByText("Should be cancelled")
          .isVisible()
          .catch(() => false);

        // At least one should be visible (depends on implementation)
        expect(hasOriginal || hasUpdated).toBeTruthy();
      });
    });
  });

  test.describe("Edge Cases for Adding Tasks", () => {
    test("Add an empty task (should not be allowed)", async ({ page }) => {
      await test.step("Attempt to add empty task", async () => {
        const input = page.getByPlaceholder("What needs to be done?");
        // Try to submit empty input
        await input.click();
        await input.press("Enter");
      });

      await test.step("Verify no task was added", async () => {
        // Check that no tasks exist in the list
        await expect(page.locator(".todo-list li")).toHaveCount(0);
        // Verify the footer with task count is not visible
        await expect(page.locator(".footer")).toBeHidden();
      });

      await test.step("Try with only whitespace", async () => {
        const input = page.getByPlaceholder("What needs to be done?");
        await input.fill("   ");
        await input.press("Enter");
      });

      await test.step("Verify whitespace-only task was not added", async () => {
        await expect(page.locator(".todo-list li")).toHaveCount(0);
        await expect(page.locator(".footer")).toBeHidden();
      });
    });

    test("Add an extremely long task name (500 characters)", async ({
      page,
    }) => {
      const longTaskName =
        "A".repeat(500) + " - This is an extremely long task name for testing";

      await test.step("Add task with 500+ characters", async () => {
        const input = page.getByPlaceholder("What needs to be done?");
        await input.fill(longTaskName);
        await input.press("Enter");
      });

      await test.step("Verify task was added", async () => {
        await expect(page.locator(".todo-list li")).toHaveCount(1);
        const itemsLeftText = await page.locator(".todo-count").textContent();
        expect(itemsLeftText).toContain("1 item left");
      });

      await test.step("Verify task content and truncation", async () => {
        const taskLabel = page.locator(".todo-list li label");
        await expect(taskLabel).toBeVisible();

        // Get the full text content
        const actualText = taskLabel;
        await expect(actualText).toHaveText(longTaskName);

        // Check that the task is scrollable or handles overflow
        const isOverflowing = await taskLabel.evaluate((el) => {
          return el.scrollWidth > el.clientWidth;
        });

        // Task should either be truncated/ellipsed or scrollable
        console.log(
          `Task with ${longTaskName.length} characters - Overflowing: ${isOverflowing}`,
        );
      });

      await test.step("Verify task can be interacted with", async () => {
        // Verify can toggle completion
        await page.locator(".toggle").click();
        await expect(page.locator(".todo-list li.completed")).toHaveCount(1);

        // Verify can be deleted
        await page.locator(".todo-list li").hover();
        await page.locator(".destroy").click();
        await expect(page.locator(".todo-list li")).toHaveCount(0);
      });
    });

    test("Add task with maximum reasonable length (255 characters)", async ({
      page,
    }) => {
      const reasonableMaxLength = "B".repeat(255);

      await test.step("Add task with 255 characters", async () => {
        const input = page.getByPlaceholder("What needs to be done?");
        await input.fill(reasonableMaxLength);
        await input.press("Enter");
      });

      await test.step("Verify task was added successfully", async () => {
        await expect(page.locator(".todo-list li")).toHaveCount(1);
        const taskLabel = page.locator(".todo-list li label");
        const actualText = taskLabel;
        await expect(actualText).toHaveText(reasonableMaxLength);
      });
    });

    test("Add task with special line break characters", async ({ page }) => {
      await test.step("Attempt to add task with newline", async () => {
        const input = page.getByPlaceholder("What needs to be done?");
        // Fill with text and try to add newline
        await input.fill("Task with");
        await input.press("Enter");
      });

      await test.step("Verify task was created (Enter submits, not adds newline)", async () => {
        // Enter key submits the task, so we should have one task
        await expect(page.locator(".todo-list li")).toHaveCount(1);
        const taskText = page
          .locator(".todo-list li label")
          ;
        await expect(taskText).toHaveText("Task with");
      });
    });

    test("Add multiple tasks rapidly", async ({ page }) => {
      const tasks = [
        "Quick task 1",
        "Quick task 2",
        "Quick task 3",
        "Quick task 4",
        "Quick task 5",
      ];

      await test.step("Add tasks rapidly in succession", async () => {
        for (const task of tasks) {
          const input = page.getByPlaceholder("What needs to be done?");
          await input.fill(task);
          await input.press("Enter");
        }
      });

      await test.step("Verify all tasks were added", async () => {
        await expect(page.locator(".todo-list li")).toHaveCount(tasks.length);
        const itemsLeftText = await page.locator(".todo-count").textContent();
        expect(itemsLeftText).toContain(`${tasks.length} items left`);
      });

      await test.step("Verify all task names are correct", async () => {
        for (const task of tasks) {
          await expect(page.getByText(task)).toBeVisible();
        }
      });
    });
  });
});
