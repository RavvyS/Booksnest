# Booksnest Backend API (Postman)

## Files

- Collection: `backend/postman/Booksnest-Backend.postman_collection.json`
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

## Notes

- Register requests save returned tokens into environment automatically.
- Create Book saves `id` into `bookId` automatically.
- Create Comment saves `_id` into `commentId` automatically.
- Create Category saves `id` into `categoryId` automatically.
- Non-owner update by author should return `403`.
- Borrow/Return operations use MongoDB transactions for atomicity.
- Only one active borrow per user per book is allowed.
