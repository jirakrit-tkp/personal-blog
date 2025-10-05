# Server Setup

## Environment Variables

Create a `.env` file in the server directory with the following variables (Supabase-based, no local Postgres needed):

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

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
- `GET /posts` - Get all posts (Supabase)
- `GET /posts/:id` - Get single post by ID (Supabase)
