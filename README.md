# Booksnest 📚

Booksnest is a digital platform designed to provide a centralized hub for high-quality learning materials, fostering an environment where knowledge is accessible to everyone.

## 1️⃣ Project Overview

**Mission:** To democratize education by providing a structured, moderated, and easy-to-use platform for sharing academic and professional learning materials.

**SDG Goal: Quality Education (SDG 4)**  
Booksnest directly contributes to SDG 4 by ensuring inclusive and equitable quality education and promoting lifelong learning opportunities for all. By providing a platform for authors to share peer-reviewed materials and readers to access them, we bridge the gap in educational resource accessibility.

**Component Role:**  
This component handles the "Learning Materials Management" life cycle, including submission, moderation (approval/rejection), categorization, and retrieval of educational content.

---

## 2️⃣ Setup Instructions

Follow these steps to get the project running locally:

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory and add the environment variables (see section 5).
4. Start the server:
   ```bash
   node src/server.js
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## 3️⃣ API Documentation

All API requests should be prefixed with `/api`.

### Endpoints: /materials

#### 🔹 Create New Material
- **Method:** `POST /materials`
- **Description:** Create a new learning material (Author/Librarian only).
- **Request Body:**
  ```json
  {
    "title": "Intro to React",
    "description": "A comprehensive guide to React hooks and state management.",
    "contentUrl": "https://example.com/react-guide.pdf",
    "category": "Programming",
    "author": "Induni"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "_id": "64b8f...123",
    "status": "pending",
    "title": "Intro to React",
    "author": "Induni",
    "createdAt": "2026-04-12T..."
  }
  ```

#### 🔹 Get All Materials
- **Method:** `GET /materials`
- **Description:** Retrieve all approved learning materials.
- **Response (200 OK):** `Array of material objects.`

#### 🔹 Get Material by ID
- **Method:** `GET /materials/:id`
- **Description:** Get details for a specific material.
- **Response (200 OK):** `Material object.`

#### 🔹 Update Material
- **Method:** `PUT /materials/:id`
- **Description:** Update an existing material's details.
- **Response (200 OK):** `Updated material object.`

#### 🔹 Delete Material
- **Method:** `DELETE /materials/:id`
- **Description:** Remove a material from the system.
- **Response (200 OK):** `{"message": "Material deleted successfully"}`

#### 🔹 Approve/Reject Material
- **Method:** `PATCH /materials/:id/approve`
- **Description:** Librarian action to approve or reject a pending material.
- **Request Body:**
  ```json
  {
    "status": "approved" 
  }
  ```
- **Response (200 OK):** `Updated status object.`

---

## 4️⃣ Authentication Note

**Role-based Access Control (RBAC)**  
Role-based access is implemented using JWT (JSON Web Tokens). 
- **Readers:** Can browse and view approved materials.
- **Authors:** Can submit new materials and manage their own submissions.
- **Librarians:** Have administrative rights to approve/reject materials and moderate content.

---

## 5️⃣ Environment Variables

Create a `.env` file in the `backend` folder with the following variables:

```env
PORT=8070
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_app_password
EMAIL_FROM=BookNest <your_email_address>
```
⚠️ **IMPORTANT:** Do NOT commit your actual `.env` file to version control.

---

## 6️⃣ Deployment Section

- **Backend URL:** [To be added after evaluation 02]
- **Frontend URL:** [To be added after evaluation 02]
