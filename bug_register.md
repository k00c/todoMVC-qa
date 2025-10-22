# Bug Register

## 2025-10-19

### Bug 1: Special Character Rendering Issue (React Version Only)

- **Summary:** The ampersand character (`&`) in a todo task is displayed as `&amp;` instead of `&`.
- **Affected Version:** Plain React (`/examples/react/dist/`) - **BUG EXISTS**
- **Not Affected:** TypeScript React (`/examples/typescript-react/#/`) - **BUG FIXED**
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
  - This bug only exists in the plain React version.
  - The TypeScript React version correctly renders the ampersand character.
  - Our tests now use the TypeScript React version, so this bug does not affect our test suite.
