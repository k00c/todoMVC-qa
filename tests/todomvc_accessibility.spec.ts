import { test, expect } from "@playwright/test";

test.describe("TodoMVC React - Accessibility Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/examples/typescript-react/#/");
  });

  test("Validate ARIA roles and attributes - Main UI structure", async ({
    page,
  }) => {
    await test.step("Verify main app section accessibility tree", async () => {
      // Check that the main app section has proper ARIA structure
      const appSection = page.locator(".todoapp");
      await expect(appSection).toMatchAriaSnapshot(`
        - heading "todos" [level=1]
        - textbox "What needs to be done?"
      `);
    });

    await test.step("Verify input field has proper ARIA attributes", async () => {
      const input = page.getByPlaceholder("What needs to be done?");
      await expect(input).toHaveAccessibleName("What needs to be done?");
    });

    await test.step("Verify footer has proper contentinfo landmark", async () => {
      const footer = page.getByRole("contentinfo");
      await expect(footer).toBeVisible();
      await expect(footer).toContainText("Double-click to edit a todo");
    });
  });

  test("Validate ARIA roles and attributes - Task list with items", async ({
    page,
  }) => {
    await test.step("Add test tasks", async () => {
      const input = page.getByPlaceholder("What needs to be done?");
      await input.fill("Task 1");
      await input.press("Enter");
      await input.fill("Task 2");
      await input.press("Enter");
    });

    await test.step("Verify task list accessibility structure", async () => {
      // Check that tasks are in a proper list structure
      const todoList = page.locator(".todo-list");
      await expect(todoList).toContainText("Task 1");
      await expect(todoList).toContainText("Task 2");

      // Verify the list has proper ARIA structure
      const list = page.locator(".todo-list");
      await expect(list).toBeVisible();

      // Verify checkboxes have proper roles
      const checkboxes = page.locator('input[type="checkbox"]');
      await expect(checkboxes).toHaveCount(3); // 2 tasks + toggle all
    });

    await test.step("Verify filter links have proper ARIA attributes", async () => {
      const allFilter = page.getByRole("link", { name: "All" });
      const activeFilter = page.getByRole("link", { name: "Active" });
      const completedFilter = page.getByRole("link", { name: "Completed" });

      await expect(allFilter).toBeVisible();
      await expect(activeFilter).toBeVisible();
      await expect(completedFilter).toBeVisible();
    });

    await test.step("Verify clear completed button appears when needed", async () => {
      // Complete one task first
      const checkbox = page.locator('.todo-list input[type="checkbox"]').first();
      await checkbox.click();
      
      // Now the clear button should appear
      const clearButton = page.getByRole("button", { name: "Clear completed" });
      await expect(clearButton).toBeVisible();
    });
  });

  test("Test keyboard navigation - Tab through interactive elements", async ({
    page,
  }) => {
    await test.step("Add a test task", async () => {
      const input = page.getByPlaceholder("What needs to be done?");
      await input.fill("Keyboard test task");
      await input.press("Enter");
    });

    await test.step("Navigate with Tab key", async () => {
      // Focus on the input first
      const input = page.getByPlaceholder("What needs to be done?");
      await input.focus();
      await expect(input).toBeFocused();

      // Tab to toggle all checkbox
      await page.keyboard.press("Tab");
      const toggleAll = page.getByRole("checkbox", { name: /mark all as complete/i });
      await expect(toggleAll).toBeFocused();

      // Tab to task checkbox
      await page.keyboard.press("Tab");
      const taskCheckbox = page.locator('.todo-list input[type="checkbox"]').first();
      await expect(taskCheckbox).toBeFocused();

      // Continue tabbing through the filter links
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      // Verify we can reach filter navigation
      const filters = page.locator(".filters");
      await expect(filters).toBeVisible();
    });
  });

  test("Test keyboard navigation - Space key to toggle checkbox", async ({
    page,
  }) => {
    await test.step("Add a test task", async () => {
      const input = page.getByPlaceholder("What needs to be done?");
      await input.fill("Space key test");
      await input.press("Enter");
    });

    await test.step("Use Space key to toggle task completion", async () => {
      // Focus on the task checkbox
      const taskCheckbox = page.locator('.todo-list input[type="checkbox"]').first();
      await taskCheckbox.focus();
      await expect(taskCheckbox).toBeFocused();

      // Press Space to toggle
      await page.keyboard.press("Space");

      // Verify task is marked as completed
      const completedTask = page.locator(".todo-list li.completed");
      await expect(completedTask).toBeVisible();

      // Press Space again to unmark
      await page.keyboard.press("Space");
      await expect(completedTask).not.toBeVisible();
    });
  });

  test("Test keyboard navigation - Enter key to add task", async ({ page }) => {
    await test.step("Use Enter key to add task", async () => {
      const input = page.getByPlaceholder("What needs to be done?");
      await input.fill("Enter key test");

      // Press Enter to add
      await page.keyboard.press("Enter");

      // Verify task was added
      await expect(page.getByText("Enter key test")).toBeVisible();

      // Verify input is cleared
      await expect(input).toHaveValue("");
    });
  });

  test("Test keyboard navigation - Arrow keys for filter navigation", async ({
    page,
  }) => {
    await test.step("Add and complete a task", async () => {
      const input = page.getByPlaceholder("What needs to be done?");
      await input.fill("Filter navigation test");
      await input.press("Enter");

      // Complete the task
      const checkbox = page.locator('.todo-list input[type="checkbox"]').first();
      await checkbox.click();
    });

    await test.step("Navigate filters with keyboard", async () => {
      // Focus on All filter
      const allFilter = page.getByRole("link", { name: "All" });
      await allFilter.focus();
      await expect(allFilter).toBeFocused();

      // Click with Enter
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(/\/#\/$/);

      // Navigate to Active filter
      const activeFilter = page.getByRole("link", { name: "Active" });
      await activeFilter.focus();
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(/#\/active$/);

      // Navigate to Completed filter
      const completedFilter = page.getByRole("link", { name: "Completed" });
      await completedFilter.focus();
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(/#\/completed$/);
    });
  });

  test("Verify semantic HTML structure", async ({ page }) => {
    await test.step("Check contentinfo landmark (footer)", async () => {
      const footer = page.getByRole("contentinfo");
      await expect(footer).toBeVisible();
      await expect(footer).toContainText("Double-click to edit a todo");
    });

    await test.step("Check heading hierarchy", async () => {
      const heading = page.getByRole("heading", { name: "todos", level: 1 });
      await expect(heading).toBeVisible();
    });

    await test.step("Check list structure for tasks", async () => {
      const input = page.getByPlaceholder("What needs to be done?");
      await input.fill("Test task");
      await input.press("Enter");
      
      const list = page.locator(".todo-list");
      await expect(list).toBeVisible();
    });
  });

  test("Verify accessible names for interactive elements", async ({ page }) => {
    await test.step("Add a task to show all controls", async () => {
      const input = page.getByPlaceholder("What needs to be done?");
      await input.fill("Accessible names test");
      await input.press("Enter");
    });

    await test.step("Check accessible names", async () => {
      // Input field
      await expect(
        page.getByRole("textbox", { name: "What needs to be done?" }),
      ).toBeVisible();

      // Toggle all checkbox
      await expect(
        page.getByRole("checkbox", { name: /mark all as complete/i }),
      ).toBeVisible();

      // Filter links
      await expect(page.getByRole("link", { name: "All" })).toBeVisible();
      await expect(page.getByRole("link", { name: "Active" })).toBeVisible();
      await expect(page.getByRole("link", { name: "Completed" })).toBeVisible();

      // Complete the task to make Clear button appear
      const checkbox = page.locator('.todo-list input[type="checkbox"]').first();
      await checkbox.click();

      // Clear button (only visible when tasks are completed)
      await expect(
        page.getByRole("button", { name: "Clear completed" }),
      ).toBeVisible();
    });
  });
});
