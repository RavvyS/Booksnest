# Booksnest Backend API Documentation

This document provides a full reference for the Booksnest backend API.

## Base URL
`http://localhost:8070`

## Authentication
Most protected routes require a Bearer Token in the `Authorization` header:
`Authorization: Bearer <your_jwt_token>`

---

## 🔐 Authentication & User Profile
| Endpoint | Method | Role | Description |
|---|---|---|---|
| `/api/auth/register` | POST | Public | Register a new user (reader, author, librarian) |
| `/api/auth/login` | POST | Public | Login and receive JWT token |
| `/api/auth/profile` | GET | Auth | Get current user's profile |
| `/api/auth/forgot-password` | POST | Public | Request a password reset |
| `/api/auth/change-password` | PUT | Auth | Change password while logged in |

### Registration Roles
- **Reader/Author:** Requires Librarian approval before login.
- **Librarian:** Auto-approved for administrative access.

---

## 🛠️ User Management (Librarian Only)
| Endpoint | Method | Description |
|---|---|---|
| `/api/users/pending` | GET | List users awaiting approval |
| `/api/users/approve/:id` | POST | Approve a pending user account |
| `/api/users/:id` | DELETE | Delete a user account |

---

## 📚 Books
| Endpoint | Method | Role | Description |
|---|---|---|---|
| `/api/books` | GET | Public | List all approved books |
| `/api/books/:bookId` | GET | Public | Get book details by ID |
| `/api/books` | POST | Librarian | Create a new book (form-data) |
| `/api/books/:bookId` | PUT | Librarian | Update book details |
| `/api/books/:bookId` | DELETE | Librarian | Delete a book |
| `/api/books/:bookId/read` | GET | Auth | Securely stream book PDF (requires active borrow) |
| `/api/books/search/external` | GET | Public | Search external books (Google Books API) |
| `/api/books/free-books` | GET | Public | Fetch free external books |

---

## 🔄 Borrowing & Queue
| Endpoint | Method | Role | Description |
|---|---|---|---|
| `/api/borrows/borrow/:bookId` | POST | Auth | Borrow a book |
| `/api/borrows/return/:bookId` | POST | Auth | Return a borrowed book |
| `/api/borrows/my-borrows` | GET | Auth | Get my borrowing history |
| `/api/borrows/queue/:bookId` | POST | Reader/Author | Join waitlist for a book |
| `/api/borrows/queue/my` | GET | Reader/Author | List my waitlist requests |
| `/api/borrows/queue/book/:bookId/status` | GET | Reader/Author | Get my position in queue |
| `/api/borrows/queue/:requestId` | PUT | Reader/Author | Update queue request |
| `/api/borrows/queue/:requestId` | DELETE | Reader/Author | Cancel queue request |

---

## 🎓 Learning Materials (SDG 4)
| Endpoint | Method | Role | Description |
|---|---|---|---|
| `/api/materials` | GET | Public | List all approved materials |
| `/api/materials/pending` | GET | Librarian | List materials awaiting approval |
| `/api/materials/my` | GET | Author | List my submitted materials |
| `/api/materials/:id` | GET | Public | Get material details |
| `/api/materials` | POST | Author/Librarian | Create new material |
| `/api/materials/:id` | PUT | Author/Librarian | Update material |
| `/api/materials/:id` | DELETE | Author/Librarian | Delete material |
| `/api/materials/:id/approve` | PATCH | Librarian | Approve or reject material |

---

## 💬 Comments
| Endpoint | Method | Role | Description |
|---|---|---|---|
| `/api/comments` | GET | Public | Get comments (use `?bookId=` or `?materialId=`) |
| `/api/comments` | POST | Auth | Post a new comment |
| `/api/comments/:commentId` | PUT | Owner/Librarian | Update a comment |
| `/api/comments/:commentId` | DELETE | Owner/Librarian | Delete a comment |

---

## 🔖 Bookmarks
| Endpoint | Method | Role | Description |
|---|---|---|---|
| `/api/bookmarks` | GET | Auth | List all my bookmarks |
| `/api/bookmarks` | POST | Reader | Create a new bookmark |
| `/api/bookmarks/:id` | PUT | Reader | Update a bookmark |
| `/api/bookmarks/:id` | DELETE | Reader | Delete a bookmark |

---

## 📁 Categories
| Endpoint | Method | Role | Description |
|---|---|---|---|
| `/api/categories` | GET | Public | List all categories |
| `/api/categories/:id` | GET | Public | Get category details |
| `/api/categories` | POST | Librarian | Create a new category |
| `/api/categories/:id` | PUT | Librarian | Update category |
| `/api/categories/:id` | DELETE | Librarian | Delete category |

---

## 🤖 AI & External Integrations (AI Books Fetch)
Booksnest leverages external APIs to provide automated metadata and discoverability.

### AI External Search (Auto-fill)
`GET /api/books/search-external?q=keyword`
- **Auth:** Author or Librarian Only
- **Description:** Searches the Google Books API and returns structured metadata (Title, Author, ISBN, Description, Thumbnail). 
- **Use Case:** Powers the "Auto-fill from Google Books" feature in the librarian dashboard to minimize manual entry.

### Free Collection Discovery
`GET /api/books/external/free?subject=fiction`
- **Auth:** Public
- **Description:** Fetches a curated list of free open-access ebooks from external sources.
- **Use Case:** Displays the "Free Collection" on the landing page for immediate reader engagement.

---

## 📧 Nodemailer (Email Service)
The system uses Nodemailer to send automated notifications. These are triggered by specific administrative or security actions.

### 1. Account Approval Email
- **Trigger:** `POST /api/users/approve/:id`
- **Recipient:** The registered user (`reader` or `author`).
- **Content:** Notifies the user that their account is now active and provides a login link.

### 2. Password Reset Email
- **Trigger:** `POST /api/auth/forgot-password`
- **Recipient:** The user who requested the reset.
- **Content:** Sends a system-generated, temporary password that allows the user to regain access and change their password in profile settings.

### Configuration (Environment Variables)
To enable email notifications, the following must be set in the `.env` file:
- `EMAIL_USER`: Gmail address (or other SMTP user).
- `EMAIL_PASS`: App-specific password.
- `EMAIL_FROM`: The display name and email shown to recipients.

---

## 🔐 Secure Access Control (PDF Streaming)
The `/api/books/:bookId/read` endpoint implements high-security streaming:
1. **Validation:** Checks for an active borrow (`returned: false`) and that the due date has not passed.
2. **Privacy:** Files are stored in a non-public `uploads/` directory.
3. **Streaming:** The file is piped directly to the response with `Content-Type: application/pdf`. No direct file URLs are ever exposed to the client.

