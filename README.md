# GoldenDuck <img width="40" height="40" alt="duck" src="https://github.com/user-attachments/assets/945a561e-59d0-48a7-9950-4028e8397ba8" />

## Overview


GoldenDuck is a customer management platform designed for practicing full-stack development. It features a modern React + TypeScript frontend and a RESTful backend API. The app allows users to view, add, edit, and delete customer records, as well as sign in and sign out.

---

## Tech Stack

- **Frontend:** React, TypeScript, HTML, MUI
- **Backend:** Node.js (REST API)
- **Other:** Vite, CSS Modules

---

## Features

- 🔒 **Authentication:** Sign in and sign out functionality.
- 📋 **Customer List:** View all customers in a responsive table.
- ✏️ **CRUD Operations:** Create, read, update, and delete customer information.
- ⚡ **Live API Integration:** All operations are performed via REST API calls.
- 🖥️ **Modern UI:** Built with Material UI DataGrid for a professional look and feel.

---

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm

---

### Frontend Setup

1. **Navigate to the client directory:**
   ```sh
   cd client
   ```
2. **Configure environment variable:**  
   Create a `.env` file in the `client` folder with the following content:
   ```env
   VITE_SERVER_API=http://localhost:4000/customers
   ```
3. **Install dependencies:**
   ```sh
   npm install
   ```
4. **Start the development server:**
   ```sh
   npm run dev
   ```
5. **Open the app:**
   - Press `o` and `Enter` in the terminal, or  
   - Go to [http://localhost:5173/](http://localhost:5173/) in your browser.

---

### Backend Setup

1. **Navigate to the server directory:**
   ```sh
   cd server
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Start the backend server:**
   ```sh
   npm run start
   ```
4. **Test the API:**
   - Use Postman or any REST client to test CRUD endpoints at [http://localhost:4000/customers](http://localhost:4000/customers).

---

## Environment Variables

The frontend uses a `.env` file to configure the backend API URL:

```env
VITE_SERVER_API=http://localhost:4000/customers
```

---

## Project Structure

```
GoldenDuck/
├── client/   # React frontend
│   ├── src/
│   └── ...
├── server/   # Node.js backend
│   └── ...
└── README.md
```

---

## License

This project is for educational and practice purposes.

---

## Author

- Omar Ninach
- Pilar Medina
- JungHwan Lee
