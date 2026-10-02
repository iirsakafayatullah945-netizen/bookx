# Book.X Backend

Simple Express + MongoDB backend for the Book.X React project.

## Setup

1. Install packages:
   `npm install`

2. Create `.env` from `.env.example`:
   `MONGO_URI=your MongoDB connection string`
   `PORT=5000`

3. Start:
   `npm run dev`

4. If the buses collection is empty:
   `npm run import:buses`

The frontend uses these simple backend routes. There are no external API keys.
