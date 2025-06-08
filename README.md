# Truth or Dare Games

A web-based multiplayer **Truth or Dare** game platform built with a modern stack, enabling users to play, chat, and manage game sessions online in real-time. The project consists of a Next.js frontend and a Node.js/Express backend with Prisma ORM and WebSocket support.

## Features

- **User Authentication**: Register, login, and manage profiles securely with JWT-based authentication.
- **Multiplayer Real-time Rooms**: Create or join game rooms, invite friends, and play together.
- **Turn-based Gameplay**: Automated turn management for players (Truth or Dare).
- **Real-time Chat**: Chat with other players in the same room.
- **Room Management**: Admin can close rooms; rooms are updated in real-time.
- **Responsive UI**: Built using Next.js for a fast and responsive experience.

## Tech Stack

- **Frontend**: Next.js (React), TypeScript
- **Backend**: Node.js, Express, Prisma ORM, WebSocket (Socket.IO)
- **Database**: (configured via Prisma, e.g., MySql)
- **Authentication**: JWT

## Getting Started

### Frontend

1. Go to the frontend directory:

   ```bash
   cd tod-frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Backend

1. Go to the backend directory:

   ```bash
   cd truth-or-dare-backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up your `.env` file (see `.env.example`) with your database connection string and JWT secret.

4. Run Prisma migrations to set up the database:

   ```bash
   npx prisma migrate dev
   ```

5. Start the backend server:

   ```bash
   node server.js
   # or
   npm run dev
   ```

## Core Project Structure

```
truth-or-dare-games/
│
├── tod-frontend/             # Next.js frontend application
│   └── src/
│       ├── app/              # Pages (login, register, dashboard, etc.)
│       └── context/          # React context for authentication
│
├── truth-or-dare-backend/    # Express backend API
│   └── src/
│       ├── controllers/      # Route controllers (auth, room)
│       ├── middleware/       # JWT authentication middleware
│       └── utils/            # Helper utilities
│
└── prisma/                   # Prisma schema and migrations
```

## Deployment

- **Frontend**: Easily deploy on [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).
- **Backend**: Deploy on any Node.js-compatible platform (e.g., Heroku, Render).

## License

MIT

---

**Made with ❤️ by [@farasalgh](https://github.com/farasalgh)**
