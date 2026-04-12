# Testing Instruction Report 🧪

This report outlines the procedures for executing unit, integration, performance, and end-to-end tests for the Booksnest project.

---

## 1️⃣ Unit Testing

Unit tests focus on individual functions and logic within the backend, particularly use cases.

- **Tools:** Jest
- **How to Run:**
  1. Navigate to the `backend` directory.
  2. Run the command:
     ```bash
     npm run test:unit
     ```
- **Scope:** Validates business logic in `src/application/usecases`.

---

## 2️⃣ Integration Testing

Integration tests verify the interaction between components, including routes, middleware, and the repository layer.

- **Tools:** Jest, Supertest, MongoDB Memory Server
- **How to Run:**
  1. Navigate to the `backend` directory.
  2. Run the command:
     ```bash
     npm run test:integration
     ```
- **Setup:** These tests use `mongodb-memory-server` to spin up a temporary, isolated database. No manual database setup is required for these tests.

---

## 3️⃣ Performance Testing

Performance and load testing are conducted to ensure the system can handle concurrent users and high traffic.

- **Tools:** Artillery
- **How to Run:**
  1. Navigate to the `backend` directory.
  2. Run the command for general load testing:
     ```bash
     npm run test:performance
     ```
  3. For specific modules:
     - Categories: `npm run test:performance:categories`
     - Borrows: `npm run test:performance:borrows`
- **Scope:** Tests API latency, throughput, and stability under load.

---

## 4️⃣ End-to-End (E2E) Testing

E2E tests simulate real user interactions across the entire stack (Frontend + Backend).

- **Tools:** Playwright
- **How to Run:**
  1. Navigate to the `frontend` directory.
  2. Ensure the backend server is running in a separate terminal.
  3. Run the command:
     ```bash
     npm run test:e2e
     ```
- **Scope:** Validates critical user journeys like registration, material browsing, and borrowing flows.

---

## 5️⃣ Testing Environment Configuration

To ensure consistent results, the following configurations are used:

- **Database:** Integration tests use an in-memory database to avoid side effects on production or development data.
- **Mocking:** External services (like Cloudinary or Email) are mocked during unit testing to prevent external dependencies.
- **Environment Variables:** Ensure a `.env` file exists with valid keys, as some tests may require a `JWT_SECRET` for token generation.
