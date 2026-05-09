# Supermarket POS System

Full-featured supermarket POS (Point-of-Sale) application that handles **product cataloging**, **billing**, **stock management**, **receipt generation**, and **daily sales analytics**.

Built with **React + Vite** on the frontend and a **Node.js/Express + MongoDB** backend.

---

## Features

- Product & category management
- Billing / checkout flow
- Inventory & stock management
- Staff/user management
- Sales analytics dashboards:
  - Daily sales trend
  - Category-wise sales distribution
  - Sales by cashier
  - Top selling products

---

## Screenshots

### Main Page
![Main Page](public/screenshots/Main_Page.png)

### Billing Page
![Billing Page](public/screenshots/Billing_Page.png)

### Add New Product Page
![Add New Product Page](public/screenshots/Add_New_Product_page.png)

### Inventory & User Management
![Inventory & User Management](public/screenshots/Inventory&User_management_Page.png)

### New Staff Account Creation
![New Staff Account Creation](public/screenshots/New_Staff_AccuntCreation_Page.png)

### Dashboard Overview
![Dashboard Overview](public/screenshots/Dashboard1.png)

### Daily Sales Trend Dashboard
![Daily Sales Trend Dashboard](public/screenshots/Daily_Sales_Trend_Dashboard.png)

### Category Sales Distribution Dashboard
![Category Sales Distribution Dashboard](public/screenshots/Category_Sales_Distribution_Dashborad.png)

### Sales by Cashier Dashboard
![Sales by Cashier Dashboard](public/screenshots/Sales_by_Cashier_Dashboard.png)

### Top Selling Products Dashboard
![Top Selling Products Dashboard](public/screenshots/Top_Selling_Products_Dashboard.png)

---

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- React Router
- Recharts

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcrypt

---

## Getting Started (Frontend)

### Prerequisites
- Node.js (recommended: latest LTS)
- npm

### Install & Run
```bash
npm install
npm run dev
```

---

## Getting Started (Backend)

> Backend code lives in `backend/`.

```bash
cd backend
npm install
node index.js
```

---

## Environment Variables (Backend)

Create a `.env` file inside `backend/` (example keys — update as per your code):

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

---

## Project Structure (High-level)

```plaintext
.
├── backend/
├── public/
│   └── screenshots/
├── src/
├── index.html
├── package.json
└── README.md
```

---

## Author

- **Ankit Kumar** — [@KumarAnkit40](https://github.com/KumarAnkit40)
