# Service Plus Backend

A simple Node.js backend using [Fastify](https://www.fastify.io/).

## Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Configure environment variables:**

   Create a `.env` file in the `backend/` directory with the following variables:

   ```
   DB_HOST=127.0.0.1
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=proxy
   API_URL=https://serviceplustest.convergintapac.com
   API_SECRET_KEY=your_api_secret_key
   API_APP_ID=SP_PY
   ```

   > Replace values as needed. Do not commit secrets to version control.

## Running the Server

Start the backend server with:

```bash
npm start
```

The server will run on [http://localhost:5001](http://localhost:5001) by default.

## Project Structure

```
backend/
├── app.js                # Main server file
├── config/               # Configuration files
├── src/
│   ├── routes/           # API route definitions
│   └── middlewares/      # Custom middleware functions
├── utils/                # Utility functions
└── ...
```

## Notes

- The backend is configured for CORS to allow requests from your frontend.
- Make sure your environment variables are set correctly before running the server.
