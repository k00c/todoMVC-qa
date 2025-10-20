# Bug Register

## 2025-10-19

### Bug 1: Special Character Rendering Issue

- **Summary:** The ampersand character (`&`) in a todo task is displayed as `&amp;` instead of `&`.
- **Steps to Reproduce:**
  1. Navigate to https://todomvc.com/examples/react/dist/
  2. Add a new task with the text: `Special !@#$%^&*()`
- **Expected Result:**
  - The task should display as: `Special !@#$%^&*()`
- **Actual Result:**
  - The task displays as: `Special !@#$%^&amp;*()`
- **Locator Info:**
  - Input: textbox with placeholder `What needs to be done?`
  - Task item: `.todo-list li` > text node
- **Screenshot/HTML Evidence:**
  - The rendered text node for the task contains `&amp;` instead of `&`.
- **Environment:**
  - URL: https://todomvc.com/examples/react/dist/
  - Browser: (all major browsers)
  - Date: 2025-10-19
- **Notes:**
  - This may indicate improper HTML escaping or rendering in the React app.
