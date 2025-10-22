# Test Plan for TodoMVC React Example

## **1. Introduction**

This test plan outlines the testing strategy for the TodoMVC React example located at `https://todomvc.com/examples/react/dist`. The goal is to ensure the application functions as expected, covering both functional and non-functional aspects.

---

## **2. Scope**

The scope of this test plan includes:

- Functional testing of core features (e.g., adding, editing, deleting tasks).
- Non-functional testing (e.g., performance, accessibility).
- Cross-browser compatibility testing.

---

## **3. Test Objectives**

- Verify that users can add, edit, and delete tasks.
- Ensure tasks persist across page reloads.
- Validate filtering functionality (All, Active, Completed).
- Test edge cases (e.g., empty input, long task names).
- Check for accessibility compliance.

---

## **4. Test Scenarios**

### **4.1 Functional Tests**

#### **High Priority (Critical User Flows)**

- [x] **Add Task**:
  - [x] Add a single task.
  - [x] Add multiple tasks.
  - [x] Add a task with special characters.
- [ ] **Delete Task**:
  - [x] Delete a single task.
  - [x] Delete all tasks.
- [x] **Mark Task as Completed**:
  - [x] Mark a single task as completed.
  - [x] Mark all tasks as completed.
- [x] **Filter Tasks**:
  - [x] Verify "All" filter shows all tasks.
  - [x] Verify "Active" filter shows only active tasks.
  - [x] Verify "Completed" filter shows only completed tasks.

#### **Medium Priority (Edge Cases)**

- [ ] **Edit Task**:
  - [ ] Edit an existing task.
  - [ ] Cancel editing without saving.
- [ ] **Edge Cases for Adding Tasks**:
  - [ ] Add an empty task (should not be allowed).
  - [ ] Add an extremely long task name (e.g., 500 characters).

#### **Low Priority (Non-Critical Features)**

- [ ] **Task Persistence**:
  - [ ] Ensure tasks persist across page reloads.

### **4.2 Non-Functional Tests**

#### **High Priority**

- [ ] **Accessibility**:
  - [x] Validate ARIA roles and attributes.
  - [x] Test keyboard navigation.

#### **Medium Priority**

- [x] **Performance**:
  - [x] Measure page load time.
  - [x] Test responsiveness with 100+ tasks.

#### **Low Priority**

- [ ] **Cross-Browser Compatibility**:
  - [ ] Test on Chrome, Firefox, Edge, and Safari.

---

## **5. Test Data**

- Task names: "Buy groceries", "Call mom", "Complete project", "Task with special characters !@#$%^&\*()".
- Edge cases: Empty task name, extremely long task name (e.g., 500 characters).

---

## **6. Test Environment**

- **URL**: `https://todomvc.com/examples/react/dist`
- **Browsers**: Chrome, Firefox, Edge, Safari.
- **Devices**: Desktop, Mobile (using responsive design tools).

---

## **7. Test Execution**

- **Tools**: Playwright for automation, Lighthouse for performance and accessibility.
- **Execution Steps**:
  1. Set up Playwright tests for functional scenarios.
  2. Use Lighthouse to generate performance and accessibility reports.
  3. Execute tests on all supported browsers.

---

## **8. Reporting**

- Document test results in a shared report.
- Log any bugs or issues in the tracking system.

---

## **9. Conclusion**

This test plan ensures comprehensive coverage of the TodoMVC React example, focusing on both functional and non-functional aspects. Successful execution will validate the app’s reliability, usability, and performance.
