import { test, expect } from '@playwright/test';

test.describe('TodoMVC React - High Priority Functional Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application before each test
    await page.goto('https://todomvc.com/examples/react/dist');
  });

  test('Add a single task', async ({ page }) => {
    await test.step('Add a task named "Buy groceries"', async () => {
      const input = page.getByPlaceholder('What needs to be done?');
      await input.fill('Buy groceries');
      await input.press('Enter');
    });

    await test.step('Verify the task is added to the list', async () => {
      const task = page.getByText('Buy groceries');
      await expect(task).toBeVisible();
    });
  });

  test('Delete a single task', async ({ page }) => {
    await test.step('Add a task to delete', async () => {
      const input = page.getByPlaceholder('What needs to be done?');
      await input.fill('Task to delete');
      await input.press('Enter');
    });

    await test.step('Delete the task', async () => {
      // hover over to do item to reveal delete button
      const task = page.getByText('Task to delete');
      await task.hover();
      const deleteButton = page.locator('.destroy');
      //await deleteButton.hover();
      await deleteButton.click();
    });

    await test.step('Verify the task is deleted', async () => {
      const task = page.getByText('Task to delete');
      await expect(task).not.toBeVisible();
    });
  });

  test('Mark a task as completed', async ({ page }) => {
    await test.step('Add a task to mark as completed', async () => {
      const input = page.getByPlaceholder('What needs to be done?');
      await input.fill('Complete this task');
      await input.press('Enter');
    });

    await test.step('Mark the task as completed', async () => {
      const toggle = page.locator('.toggle');
      await toggle.click();
    });

    await test.step('Verify the task is marked as completed', async () => {
      const completedTask = page.locator('.todo-list li.completed');
      await expect(completedTask).toBeVisible();
    });
  });

  test('Filter tasks by status', async ({ page }) => {
    await test.step('Add multiple tasks', async () => {
      const input = page.getByPlaceholder('What needs to be done?');
      await input.fill('Task 1');
      await input.press('Enter');
      await input.fill('Task 2');
      await input.press('Enter');
    });

    await test.step('Mark one task as completed', async () => {
      const toggle = page.locator('.toggle').first();
      await toggle.click();
    });

    await test.step('Filter by Active tasks', async () => {
      const activeFilter = page.getByText('Active');
      await activeFilter.click();
      const activeTasks = page.locator('.todo-list li:not(.completed)');
      await expect(activeTasks).toHaveCount(1);
    });

    await test.step('Filter by Completed tasks', async () => {
      const completedFilter = page.getByRole('link', { name: 'Completed' });
      await completedFilter.click();
      const completedTasks = page.locator('.todo-list li.completed');
      await expect(completedTasks).toHaveCount(1);
    });
  });
});