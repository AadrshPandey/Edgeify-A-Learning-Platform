# 🖥️ Edgeify Backend API

This directory contains the Express + Node.js server that drives the **Edgeify** learning platform.

## 🚀 Overview

The backend is built as an ES module Express application integrated with MongoDB (via Mongoose ODM). It handles user sessions, course management, video uploads, progress/history tracking, and review calculations.

For comprehensive details about database schemas, API routes, and general setup, please refer to the **[Main Workspace README.md](../README.md)**.

## ⚙️ Quick Start

1. Ensure MongoDB is running locally or set up a MongoDB Atlas cluster.
2. Create a `.env` file (refer to the [main environment config](../README.md#backend-configuration-backendenv)).
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the development server with nodemon auto-reloads:
   ```bash
   npm run dev
   ```

## 🛠️ Main Dependencies

- **express**: Framework for server router and request handling
- **mongoose**: ODM layer for MongoDB schemas and validation
- **jsonwebtoken** & **bcrypt**: Session token authorization and security
- **cloudinary** & **multer**: Local & cloud file uploads for user avatars, course covers, and lectures
- **cookie-parser**: Parses cookies for cookie-based authentication
- **cors**: Handles Cross-Origin Resource Sharing policy configuration