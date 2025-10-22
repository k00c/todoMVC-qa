import { test, expect } from "@playwright/test";

/**
 * Performance Tests for TodoMVC React Application
 * Tests page load time and responsiveness with large datasets
 */

test.describe("TodoMVC Performance Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/examples/react/dist/");
  });

  test("Measure page load time", async ({ page }) => {
    await test.step("Navigate and measure performance", async () => {
      // Use Performance API to measure page load metrics
      const performanceMetrics = await page.evaluate(() => {
        const perfData = performance.getEntriesByType(
          "navigation",
        )[0] as PerformanceNavigationTiming;
        return {
          domContentLoaded:
            perfData.domContentLoadedEventEnd - perfData.fetchStart,
          loadComplete: perfData.loadEventEnd - perfData.fetchStart,
          domInteractive: perfData.domInteractive - perfData.fetchStart,
          responseTime: perfData.responseEnd - perfData.requestStart,
        };
      });

      console.log("Performance Metrics:", performanceMetrics);

      // Verify page loads within reasonable time (adjusted for network variability)
      expect(performanceMetrics.domContentLoaded).toBeLessThan(5000); // 5 seconds
      expect(performanceMetrics.loadComplete).toBeLessThan(10000); // 10 seconds
    });

    await test.step("Verify page is interactive", async () => {
      // Verify main interactive elements are present
      await expect(
        page.getByPlaceholder("What needs to be done?"),
      ).toBeVisible();
      await expect(page.getByRole("heading", { name: "todos" })).toBeVisible();
    });
  });

  test("Responsiveness with 100+ tasks", async ({ page }) => {
    const taskCount = 100;
    const tasks: string[] = [];

    await test.step("Generate task list", async () => {
      for (let i = 1; i <= taskCount; i++) {
        tasks.push(`Task ${i}: Performance test item`);
      }
    });

    await test.step("Add 100 tasks and measure time", async () => {
      const startTime = performance.now();

      for (const task of tasks) {
        const input = page.getByPlaceholder("What needs to be done?");
        await input.fill(task);
        await input.press("Enter");
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      console.log(`Time to add ${taskCount} tasks: ${totalTime}ms`);
      console.log(`Average time per task: ${totalTime / taskCount}ms`);

      // Verify all tasks were added
      await expect(page.locator(".todo-list li")).toHaveCount(taskCount);

      // Should complete within 30 seconds
      expect(totalTime).toBeLessThan(30000);
    });

    await test.step("Verify task count accuracy", async () => {
      const itemsLeftText = await page.locator(".todo-count").textContent();
      expect(itemsLeftText).toContain(`${taskCount} items left`);
    });

    await test.step("Test filtering performance with large dataset", async () => {
      // Mark some tasks as completed
      const checkboxes = page.locator(".toggle");
      for (let i = 0; i < 20; i++) {
        await checkboxes.nth(i).click();
      }

      // Test "Active" filter
      const startActiveFilter = Date.now();
      await page.getByRole("link", { name: "Active" }).click();
      await expect(page.locator(".todo-list li")).toHaveCount(80);
      const activeFilterTime = Date.now() - startActiveFilter;
      console.log(`Active filter response time: ${activeFilterTime}ms`);
      expect(activeFilterTime).toBeLessThan(2000);

      // Test "Completed" filter
      const startCompletedFilter = Date.now();
      await page.getByRole("link", { name: "Completed" }).click();
      await expect(page.locator(".todo-list li")).toHaveCount(20);
      const completedFilterTime = Date.now() - startCompletedFilter;
      console.log(`Completed filter response time: ${completedFilterTime}ms`);
      expect(completedFilterTime).toBeLessThan(2000);

      // Test "All" filter
      const startAllFilter = Date.now();
      await page.getByRole("link", { name: "All" }).click();
      await expect(page.locator(".todo-list li")).toHaveCount(100);
      const allFilterTime = Date.now() - startAllFilter;
      console.log(`All filter response time: ${allFilterTime}ms`);
      expect(allFilterTime).toBeLessThan(2000);
    });

    await test.step("Test scrolling performance with 100 tasks", async () => {
      // Verify page can handle scrolling through all tasks
      const todoList = page.locator(".todo-list");
      await todoList.scrollIntoViewIfNeeded();

      // Scroll to bottom
      await page.evaluate(() => {
        const list = document.querySelector(".todo-list");
        if (list) {
          list.scrollTop = list.scrollHeight;
        }
      });

      // Verify last task is visible
      await expect(page.locator(".todo-list li").last()).toBeVisible();
    });

    await test.step("Test clear completed performance", async () => {
      // Navigate to completed view
      await page.getByRole("link", { name: "Completed" }).click();
      await expect(page.locator(".todo-list li")).toHaveCount(20);

      // Clear completed tasks
      const startClearTime = Date.now();
      await page.getByRole("button", { name: "Clear completed" }).click();
      await expect(page.locator(".todo-list li")).toHaveCount(0);
      const clearTime = Date.now() - startClearTime;

      console.log(`Clear completed response time: ${clearTime}ms`);
      expect(clearTime).toBeLessThan(2000);

      // Verify remaining tasks
      await page.getByRole("link", { name: "All" }).click();
      await expect(page.locator(".todo-list li")).toHaveCount(80);
    });
  });
});
