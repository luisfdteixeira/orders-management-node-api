# Orders Management - Node API

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/Firebase-Admin%20SDK-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase">
  <img src="https://img.shields.io/badge/Supabase-3.x-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase">
  <img src="https://img.shields.io/badge/ImgBB-API-FF6B6B?style=for-the-badge&logo=imgbb&logoColor=white" alt="ImgBB">
  <img src="https://img.shields.io/badge/Architecture-Hexagonal-8A2BE2?style=for-the-badge" alt="Hexagonal Architecture">
</p>

## About
API for restaurant order management, built with Node.js, TypeScript, Firebase Auth and Supabase (PostgreSQL), following Hexagonal Architecture principles.

## Prerequisites
- Node.js (v18+)
- npm
- Firebase account (for authentication)
- Supabase account (database)
- ImgBB account (image upload)

## Installation

    git clone https://github.com/luisfdteixeira/orders-management-node-api
    cd orders-management-api
    npm install

## Startup script

    npm run dev

## Main routes

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | `/api/auth/login` | Login with email/password | Public |
| GET | `/api/auth/profile` | Get logged user profile | `Bearer token` |
| GET | `/api/products` | List all products | `Bearer token` |
| POST | `/api/products` | Create product (admin only) | `Bearer token` |
| GET | `/api/products/:id` | Get product by ID | `Bearer token` |
| PUT | `/api/products/:id` | Update product (admin only) | `Bearer token` |
| DELETE | `/api/products/:id` | Delete product (admin only) | `Bearer token` |
| GET | `/health` | Health check | Public |
