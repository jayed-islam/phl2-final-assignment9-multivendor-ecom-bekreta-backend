# Bekreta Multi-Vendor Website Backend

This is the **backend server** for the **Bekreta Multi-Vendor Website**, an e-commerce platform that facilitates vendors and customers to buy and sell products seamlessly. The backend is built with **Node.js**, **Express**, and **MongoDB**, handling all API requests, user authentication, vendor management, product handling, and order processing.

## Table of Contents

- [Project Overview](#project-overview)
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Environment Variables](#environment-variables)
- [Installation Guide](#installation-guide)
- [Running the Project](#running-the-project)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)

## Admin Credentials

To log in as an admin, use the following credentials:

- **Email**: `admin@gmail.com`
- **Password**: `password`

```json
{
  "email": "admin@gmail.com",
  "password": "password"
}
```

## Project Overview

The Bekreta backend server handles the core functionalities of the platform, including:

- Vendor and Customer Registration/Login
- Product Management (CRUD operations)
- Order Placement and Tracking
- Multi-Vendor Support
- Secure Payment Integration (Cash on Delivery and other options)
- Admin Panel for managing users, orders, and products

## Technologies Used

- **Node.js** - Server runtime
- **Express.js** - Web framework for building RESTful APIs
- **MongoDB** - NoSQL database for scalable data storage
- **Mongoose** - MongoDB ODM (Object Data Modeling)
- **TypeScript** - For type safety and better developer experience
- **JWT (JSON Web Tokens)** - Secure user authentication
- **bcryptjs** - Password hashing for security
- **Zod** - Schema validation for request payloads

## Features

### 1. Multi-Vendor Support

- Vendors can register and list their products.
- Customers can browse and purchase products from multiple vendors.

### 2. Authentication

- User and vendor login using JWT.
- Admin-specific login to manage the platform.

### 3. Product Management

- Vendors can create, update, and delete their products.
- Admins can oversee all products and moderate them.

### 4. Order Management

- Customers can place orders.
- Vendors can manage the status of their orders (e.g., Pending, Shipped).

### 5. Secure Payments

- Integrated payment options like Cash on Delivery (additional integrations planned).

### 6. Admin Panel

- Admins can manage vendors, products, and orders efficiently.

## Environment Variables

Create a `.env` file in the root directory and add the following configurations:

```env
# Server Configuration
PORT=5000


# JWT Secret
JWT_SECRET=your_jwt_secret

# Other environment variables
NODE_ENV=development
```

## Installation Guide

### Prerequisites

- Node.js (v16 or later)
- MongoDB (running locally or hosted)

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/jayed-islam/phl2-final-assignment9-multivendor-ecom-bekreta-backend
   ```

2. Navigate to the project directory:

   ```bash
   cd phl2-final-assignment9-multivendor-ecom-bekreta-backend
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Set up the environment variables as described above.

5. Start the MongoDB server.

6. Run the server:
   ```bash
   npm run dev
   ```

## Running the Project

Start the development server with:

```bash
npm run dev
```

For production mode, use:

```bash
npm start
```

## Folder Structure

```
├── src
│   ├── controllers
│   ├── middlewares
│   ├── models
│   ├── routes
│   ├── services
│   ├── utils
│   └── app.ts
├── tests
├── .env
├── .gitignore
├── package.json
└── README.md
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Make your changes and commit them:
   ```bash
   git commit -m "Add some feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

---

For any issues or suggestions, feel free to contact the development team. Happy coding!
