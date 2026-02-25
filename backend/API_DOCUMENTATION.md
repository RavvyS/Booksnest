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
12. `Comments/Create Comment (Reader)`
13. `Comments/Get Comments By Material`
14. `Comments/Update Comment (Owner Reader)`
15. `Comments/Update Comment (Non-Owner Author, expect 403)`
16. `Comments/Delete Comment (Librarian override)`
17. `Categories/Delete Category (Librarian)`

## Environment Variables Used

- `baseUrl`
- `readerEmail`, `authorEmail`, `librarianEmail`
- `password`
- `readerToken`, `authorToken`, `librarianToken`
- `materialId`
- `commentId`
- `categoryId`

## Endpoint Summary

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile` (Bearer token)

### Comments

- `GET /api/comments` (public)
- `GET /api/comments?materialId=...` (public)
- `POST /api/comments` (reader/author/librarian)
- `PUT /api/comments/:commentId` (owner or librarian)
- `DELETE /api/comments/:commentId` (owner or librarian)

# Categories

- `GET /api/categories` (public)
- `GET /api/categories/:categoryId` (public)
- `POST /api/categories` (librarian only)
- Create Category saves `id` into `categoryId` automatically.
- Non-owner update by author should return `403`.
- Only librarians can create, update, or delete categoriesnly)
- `DELETE /api/categories/:categoryId` (librarian only)

##

## Notes

- Register requests save returned tokens into environment automatically.
- Create Comment saves `_id` into `commentId` automatically.
- Non-owner update by author should return `403`.
