# Server Setup

## Environment Variables

Create a `.env` file in the server directory with the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=blogpost
DB_USER=postgres
DB_PASSWORD=your_password_here

# Server Configuration
PORT=4001
NODE_ENV=development
```

## Installation

```bash
npm install
```

## Running the Server

```bash
npm run dev
```

## API Endpoints

- `GET /` - Health check
- `GET /profiles` - Get profiles
- `GET /posts` - Get all posts
- `GET /posts/:id` - Get single post by ID
