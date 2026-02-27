# Backend Testing Guide

This project now supports backend-only testing in three categories:

## 1) Unit Testing
- Scope: isolated behavior of use cases/functions (no DB/network).
- Location: `tests/unit/`.
- Includes:
  - auth use-cases (`RegisterUser`, `LoginUser`)
  - middleware behavior (`RoleMiddleware`)
- Run:

```bash
npm run test:unit
```

## 2) Integration Testing
- Scope: Express controllers/routes + middleware + MongoDB interaction.
- Stack: Jest + Supertest + MongoDB Memory Server.
- Location: `tests/integration/`.
- Includes:
  - auth endpoints (`register`, `login`, `profile`)
  - comments endpoints (`create/update/delete`, ownership checks, role checks)
  - queue role-based authorization (`reader` allowed, non-reader blocked)
  - error scenarios (`401`, `403`, `404`, invalid credentials)
- Run:

```bash
npm run test:integration
```

## 3) Performance Testing
- Scope: API behavior under concurrent request load.
- Tool: Artillery.
- Config files:
  - `artillery/api-mixed-load.yml` (recommended: mixed public/protected/error traffic)
  - `artillery/auth-load.yml` (focused auth registration load)
- Run:

```bash
npm run test:performance
npm run test:performance:auth
```

## All test commands

```bash
npm test
npm run test:all
```

## Notes
- Ensure `JWT_SECRET` is configured for non-test runtime.
- Performance test target defaults to `http://localhost:8070` and expects backend to be running.
- Integration tests run against an in-memory MongoDB instance (no external DB required).
