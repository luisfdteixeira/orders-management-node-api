# Orders Management - Node API

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/Firebase-Admin%20SDK-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase">
  <img src="https://img.shields.io/badge/Supabase-3.x-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase">
  <img src="https://img.shields.io/badge/ImgBB-API-FF6B6B?style=for-the-badge&logo=imgbb&logoColor=white" alt="ImgBB">
  <img src="https://img.shields.io/badge/Arquitetura-Hexagonal-8A2BE2?style=for-the-badge" alt="Arquitetura Hexagonal">
</p>

## Sobre
API para gestão de pedidos de um restaurante, desenvolvida com Node.js, TypeScript, Firebase Auth e Supabase (PostgreSQL), seguindo os princípios da Arquitetura Hexagonal.

## Pré-requisitos
- Node.js (v18+)
- npm
- Conta no Firebase (para autenticação)
- Conta no Supabase (banco de dados)
- Conta no ImgBB (upload de imagens)

## Instalação
```
git clone https://github.com/luisfdteixeira/orders-management-node-api
cd orders-management-api
npm install
```

## Script de inicialização
```
npm run dev
```

## Rotas principais

| Método | Rota | Descrição | Autenticação |
|--------|------|-----------|--------------|
| POST | `/api/auth/login` | Login com email/senha | Pública |
| GET | `/api/auth/profile` | Perfil do usuário logado | `Bearer token` |
| GET | `/api/products` | Listar produtos | `Bearer token` |
| POST | `/api/products` | Criar produto (admin) | `Bearer token` |
| GET | `/api/products/:id` | Buscar produto por ID | `Bearer token` |
| PUT | `/api/products/:id` | Atualizar produto (admin) | `Bearer token` |
| DELETE | `/api/products/:id` | Deletar produto (admin) | `Bearer token` |
| GET | `/health` | Health check | Pública |
