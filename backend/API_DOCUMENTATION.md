# Booksnest Backend API (Postman)

## Files
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
7. `Comments/Create Comment (Reader)`
8. `Comments/Get Comments By Material`
9. `Comments/Update Comment (Owner Reader)`
10. `Comments/Update Comment (Non-Owner Author, expect 403)`
11. `Comments/Delete Comment (Librarian override)`

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
- Create Comment saves `_id` into `commentId` automatically.
- Non-owner update by author should return `403`.
- All protected routes require `Authorization: Bearer <token>` header.
- Materials are only publicly visible after a librarian sets `status: "approved"`.

