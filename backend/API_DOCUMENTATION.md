## Additional Testing Requirements (Backend Only)

### 1. Unit Testing
- Implement unit tests for individual components and functions to validate behavior in isolation.
- Recommended scope in this codebase:
  - Application use cases in `src/application/usecases/*`
  - Pure utility/service logic without DB/network dependencies
- Test location: `tests/unit/`
- Command: `npm run test:unit`

### 2. Integration Testing
- Conduct integration tests to ensure different parts of the backend work together seamlessly.
- Must include interactions between:
  - Routes/controllers
  - Services/middleware
  - MongoDB (using in-memory Mongo for automated test runs)
- Test API endpoints for success and error scenarios (invalid payloads, auth failures, not found, invalid credentials).
- Test location: `tests/integration/`
- Command: `npm run test:integration`

### 3. Performance Testing
- Evaluate API performance under varying load to ensure concurrent requests are handled with acceptable latency.
- Use Artillery for Express API load testing.
- Config location: `artillery/auth-load.yml`
- Command: `npm run test:performance`

### Quick Run Summary
- `npm test` → run full Jest test suite
- `npm run test:all` → run unit + integration tests

# Booksnest Backend API (Postman)

## Files

- Collection: `backend/postman/Booksnest-Backend.postman_collection.json`
- Collection (Auth + Comments): `backend/postman/Booksnest-Backend.postman_collection.json`
- Collection (Learning Materials): `backend/postman/learning-materials.json`
- Environment: `backend/postman/Booksnest-Backend.postman_environment.json`

## Import Into Postman

1. Open Postman.
2. Click **Import**.
3. Import both JSON files above.
4. Select environment **Booksnest Backend Local**.

## Start Backend

```bash
cd backend
npm start
```

Base URL in env is `http://localhost:8070`.

## Recommended Run Order (Collection)

### Auth & Comments
1. `Auth/Register Reader`
2. `Auth/Register Author`
3. `Auth/Register Librarian`
4. `Auth/Login Reader`
5. `Auth/Login Librarian`
6. `Auth/Get Profile (Reader)`
7. `Categories/Get All Categories (Public)`
8. `Categories/Create Category (Librarian)`
9. `Categories/Get Category By ID (Public)`
10. `Categories/Update Category (Librarian)`
11. `Categories/Create Category (Reader, expect 403)`
12. `Books/Create Book with PDF (Librarian)` — uses form-data, attach a PDF file, saves `bookId`
13. `Books/Get All Books (Public)`
14. `Books/Get Book By ID (Public)`
15. `Books/Create Book (Reader, expect 403)`
16. `Borrows/Borrow Book (Reader)` — creates borrow, decrements stock
17. `Books/Read Book PDF (Reader, valid borrow)` — streams PDF ✅
18. `Borrows/Borrow Same Book Again (Reader, expect 400)` — duplicate prevention
19. `Borrows/Get My Borrows (Reader)`
20. `Borrows/Return Book (Reader)` — marks returned, increments stock
21. `Books/Read Book PDF (Reader, after return)` — should return 403 ❌
22. `Books/Read Book PDF (No borrow, expect 403)` — author has no borrow
23. `Borrows/Return Book Again (Reader, expect 400)` — no active borrow
24. `Comments/Create Comment (Reader)`
25. `Comments/Get Comments By Material`
26. `Comments/Update Comment (Owner Reader)`
27. `Comments/Update Comment (Non-Owner Author, expect 403)`
28. `Comments/Delete Comment (Librarian override)`
29. `Categories/Delete Category (Librarian)`

### Learning Materials (use `learning-materials.json` collection)
12. `Auth/Register Author` *(skip if already done)*
13. `Auth/Register Librarian` *(skip if already done)*
14. `Auth/Login Author` → saves `authorToken` automatically
15. `Auth/Login Librarian` → saves `librarianToken` automatically
16. `Learning Materials/POST - Create Material (Author)` → saves `materialId` automatically
17. `Learning Materials/GET - Pending Materials (Librarian only)` → confirms pending status
18. `Learning Materials/PATCH - Approve Material (Librarian only)` → status becomes `"approved"`
19. `Learning Materials/GET - All Approved Materials (Public)` → material now appears
20. `Learning Materials/GET - Filter by Category (Public)` → `?category=Education`
21. `Learning Materials/GET - Material by ID (Public)`
22. `Learning Materials/PATCH - Approve as Author (expect 403)` → role protection test
23. `Learning Materials/PUT - Update Material (Author)`
24. `Learning Materials/DELETE - Delete Material (Author)`

## Environment Variables Used

- `baseUrl`
- `readerEmail`, `authorEmail`, `librarianEmail`
- `password`
- `readerToken`, `authorToken`, `librarianToken`
- `materialId`
- `commentId`
- `categoryId`
- `bookId`

## Endpoint Summary

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile` (Bearer token)

### Categories

- `GET /api/categories` (public)
- `GET /api/categories/:categoryId` (public)
- `POST /api/categories` (librarian only)
- `PUT /api/categories/:categoryId` (librarian only)
- `DELETE /api/categories/:categoryId` (librarian only)

### Books

- `GET /api/books` (public)
- `GET /api/books/:bookId` (public)
- `POST /api/books` (librarian only, **form-data** with optional PDF `file` field)
- `PUT /api/books/:bookId` (librarian only)
- `DELETE /api/books/:bookId` (librarian only)
- `GET /api/books/:bookId/read` (authenticated, **requires valid borrow**) — streams PDF

### Borrows

- `POST /api/borrows/borrow/:bookId` (any authenticated user)
- `POST /api/borrows/return/:bookId` (any authenticated user)
- `GET /api/borrows/my-borrows` (any authenticated user)
- `POST /api/borrows/queue/:bookId` (reader only, create queue request when no copies remain)
- `GET /api/borrows/queue/my` (reader only, list my queue requests)
- `PUT /api/borrows/queue/:requestId` (reader only, update pending queue request)
- `DELETE /api/borrows/queue/:requestId` (reader only, cancel pending queue request)

### Comments

- `GET /api/comments` (public)
- `GET /api/comments?materialId=...` (public)
- `POST /api/comments` (reader/author/librarian)
- `PUT /api/comments/:commentId` (owner or librarian)
- `DELETE /api/comments/:commentId` (owner or librarian)

## Secure Read Access Control

The `/api/books/:bookId/read` endpoint enforces:
- User must have an **active borrow** (`returned = false`)
- Borrow must **not be expired** (`dueDate > current time`)
- Files are stored privately (not static-served)
- PDF is streamed directly — no file URL is ever exposed

Access automatically expires when `dueDate` passes, with no cron job needed.
### Learning Materials
- `GET /api/materials` — Public. Returns all **approved** materials. Optional: `?category=Education`
- `GET /api/materials/pending` — Librarian only. Returns all **pending** materials awaiting review.
- `GET /api/materials/:id` — Public. Returns a single material by ID. Returns `404` if not found.
- `POST /api/materials` — Author/Librarian only. Creates a new material. Status defaults to `"pending"`.
- `PUT /api/materials/:id` — Author/Librarian only. Updates material fields (status change blocked here).
- `DELETE /api/materials/:id` — Author/Librarian only. Deletes a material by ID.
- `PATCH /api/materials/:id/approve` — Librarian only. Approves or rejects a material.

#### POST /api/materials — Request Body
```json
{
  "title": "Introduction to SDG 4",
  "description": "A learning resource about quality education.",
  "contentUrl": "https://example.com/sdg4-intro",
  "category": "Education",
  "author": "Test Author"
}
```

#### PATCH /api/materials/:id/approve — Request Body
```json
{
  "status": "approved"
}
```
> Valid values: `"approved"` or `"rejected"`

#### Role Summary
| Endpoint | Reader | Author | Librarian |
|---|---|---|---|
| GET /api/materials | ✅ | ✅ | ✅ |
| GET /api/materials/:id | ✅ | ✅ | ✅ |
| GET /api/materials/pending | ❌ | ❌ | ✅ |
| POST /api/materials | ❌ | ✅ | ✅ |
| PUT /api/materials/:id | ❌ | ✅ | ✅ |
| DELETE /api/materials/:id | ❌ | ✅ | ✅ |
| PATCH /api/materials/:id/approve | ❌ | ❌ | ✅ |

## Notes

- Register requests save returned tokens into environment automatically.
- Create Book saves `id` into `bookId` automatically.
- Create Comment saves `_id` into `commentId` automatically.
- Create Category saves `id` into `categoryId` automatically.
- Non-owner update by author should return `403`.
- Borrow/Return operations use MongoDB transactions for atomicity.
- Only one active borrow per user per book is allowed.
- Queue requests are FIFO by creation time; when a book is returned and a queue exists, the next reader is auto-assigned.
- All protected routes require `Authorization: Bearer <token>` header.
- Materials are only publicly visible after a librarian sets `status: "approved"`.
