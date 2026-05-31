# MRK Store — E-Commerce Website

A full-stack MERN e-commerce app: a React storefront with a customer cart/checkout
flow and an admin dashboard for managing products, orders, and users.

## Tech stack

- **Frontend:** React 19, Vite, Redux Toolkit, React Router
- **Backend:** Node.js, Express 5, MongoDB (Mongoose)
- **Services:** Cloudinary (image hosting), Nodemailer/Gmail (transactional email), JWT auth

## Project structure

```
.
├── backend/            Express API
│   ├── config/         DB + Cloudinary setup
│   ├── controllers/    Route handlers
│   ├── middleware/     Auth & admin guards
│   ├── model/          Mongoose schemas
│   ├── routes/         API routes
│   ├── utils/          Email helper
│   └── seed.js         Optional seed script placeholder
└── frontend/           React app (Vite)
    └── src/
        ├── api/        Fetch wrapper for the backend
        ├── app/        Redux store
        ├── components/ Reusable UI
        ├── features/   Redux slices (auth, cart)
        └── pages/      Route views (incl. admin/)
```

## Prerequisites

- Node.js 18+
- A MongoDB instance (local or Atlas)
- A Cloudinary account (for product images)
- A Gmail account with an [App Password](https://support.google.com/accounts/answer/185833) (for email)

## Setup

1. **Install dependencies** (root script installs both apps):
   ```bash
   npm install
   ```

2. **Configure environment variables.** Copy the example files and fill in your values:
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```
   See each `.env.example` for the full list of required variables.

## Running locally

From the project root, run both apps together:

```bash
npm run dev
```

- API: http://localhost:3000
- App: http://localhost:3001

Or run them separately: `npm run dev:server` and `npm run dev:client`.

## Building for production

```bash
npm run build          # builds the frontend into frontend/dist
cd backend && npm start # runs the API with node (no nodemon)
```

Serve `frontend/dist` from any static host and point `VITE_API_URL` at your deployed API.

## Notes

- Use a long, random `JWT_SECRET` in production.
- Gmail requires an **App Password** (not your normal password) for `EMAIL_PASS`.
Updated project documentation
