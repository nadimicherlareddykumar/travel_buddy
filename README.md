# TravelBuddy 🌍

**TravelBuddy** is a full-stack travel bucket list and trip tracker application. Manage your dream destinations, plan upcoming trips, and log places you've visited — with budget tracking and analytics.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| Database | PostgreSQL |
| ORM | Prisma |

---

## Project Structure

```
travel-bucket/
├── client/         ← React + Vite frontend (port 5173)
├── server/         ← Express backend (port 5000)
├── prisma/         ← Prisma schema & migrations
├── .env            ← Shared environment variables
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- PostgreSQL running locally

### 1. Configure Environment

Edit `.env` at the project root:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/travelbucket"
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
```

### 2. Set Up Database

```bash
cd server
npm run db:push        # push schema to PostgreSQL (no migration history)
# OR
npm run db:migrate     # create migration files (recommended for production)
```

### 3. Start the Backend

```bash
cd server
npm run dev
# API: http://localhost:5000
```

### 4. Start the Frontend

```bash
cd client
npm run dev
# App: http://localhost:5173
```

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/destinations` | List all destinations |
| GET | `/destinations?status=Visited` | Filter by status |
| GET | `/destinations?country=India` | Filter by country |
| POST | `/destinations` | Create destination (multipart/form-data) |
| PUT | `/destinations/:id` | Update destination |
| DELETE | `/destinations/:id` | Delete destination |

### Request Body (POST / PUT)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `placeName` | string | ✅ | |
| `country` | string | ✅ | |
| `description` | string | | |
| `status` | string | | `Wishlist` \| `Planned` \| `Visited` |
| `estimatedBudget` | number | | USD |
| `visitedOn` | date | | Only for `Visited` |
| `rating` | number | | 0–5, only for `Visited` |
| `image` | file | | JPEG/PNG/GIF/WebP, ≤5 MB |

---

## Features

- ✅ Full CRUD for travel destinations
- ✅ Status system: Wishlist / Planned / Visited
- ✅ Rating (1–5 stars) and visitedOn — only shown for Visited destinations
- ✅ Budget tracking per destination
- ✅ Dashboard with Chart.js analytics (doughnut + bar charts)
- ✅ Filter by status and country
- ✅ Image upload for destinations (local storage)
- ✅ Google Maps link for each destination
- ✅ Dark-mode premium UI with glassmorphism
- ✅ Responsive design
