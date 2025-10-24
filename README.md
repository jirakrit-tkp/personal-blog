# Personal Blog

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/react-19.1.0-blue)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/database-Supabase-green)](https://supabase.com/)

A modern, full-stack personal blogging platform with real-time notifications, role-based access control, and a beautiful, responsive UI. Built for developers who want to share their technical knowledge through well-structured articles with markdown support.

## 📋 Table of Contents

- [Project Description](#-project-description)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation & Setup](#-installation--setup)
- [Usage Guide](#-usage-guide)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Performance Optimizations](#-performance-optimizations)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [Credits](#-credits)
- [License](#-license)

## 🎯 Project Description

**Personal Blog** is a full-featured blogging platform designed specifically for technical writers and developers. It solves the challenge of managing and sharing technical content with an elegant interface while providing real-time engagement features like notifications, comments, and ratings.

### What makes it stand out?

- **Real-time Notifications**: Instant updates using Supabase Realtime when users comment, like, or rate your articles
- **Markdown Support**: Write articles in markdown with live preview
- **Role-Based Access Control**: Separate admin and member functionalities with JWT authentication
- **Performance Optimized**: Implemented caching strategies, request throttling, and bundle splitting to reduce API calls by 90%
- **Modern UI/UX**: Built with TailwindCSS and Radix UI for a polished, accessible interface
- **Draft Support**: Save articles as drafts and publish when ready

### Key Challenges Solved

1. **Rate Limiting**: Implemented intelligent caching and request throttling to prevent HTTP 429 errors
2. **Real-time Updates**: Integrated Supabase Realtime with proper cleanup to avoid memory leaks
3. **Build Performance**: Optimized Vercel deployment, reducing build time from 15 minutes to 5 minutes
4. **Bundle Optimization**: Manual chunk splitting for better caching and faster initial loads

## ✨ Features

### For Readers (Members)
- 📰 Browse and read technical articles with markdown rendering
- 🔍 Search and filter articles by category
- 💬 Comment on articles and engage in discussions
- ⭐ Rate articles (0-10 scale)
- ❤️ Like favorite articles
- 🔔 Real-time notifications for interactions on your comments
- 👤 Personal profile management
- 🔐 Secure authentication with password reset

### For Authors (Admins)
- ✍️ Create, edit, and delete articles with markdown editor
- 📝 Save articles as drafts or publish immediately
- 🏷️ Manage categories/genres
- 📊 View dashboard with article statistics
- 🔔 Receive notifications when users interact with your content
- 👥 Track engagement metrics
- 🖼️ Upload and manage article images
- 📱 Full mobile-responsive admin panel

### System Features
- 🚀 Real-time notifications using Supabase Realtime
- 🔒 JWT-based authentication with protected routes
- 🎨 Beautiful UI with TailwindCSS and Radix UI components
- ⚡ Performance optimized with caching and throttling
- 📱 Fully responsive design
- 🌐 SEO-friendly routing
- 🔧 Comprehensive error handling

## 🛠 Tech Stack

### Frontend
- **Framework**: React 19.1.0
- **Build Tool**: Vite 7.0.4
- **Routing**: React Router DOM 7.8.2
- **Styling**: TailwindCSS 4.1.11
- **UI Components**: Radix UI (Dropdown Menu, Select)
- **Icons**: Lucide React
- **HTTP Client**: Axios 1.11.0
- **Markdown**: React Markdown 10.1.0
- **Auth**: JWT Decode 4.0.0

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5.1.0
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth + JWT
- **Real-time**: Supabase Realtime
- **File Upload**: Multer 2.0.2
- **CORS**: CORS 2.8.5
- **Environment**: dotenv 16.6.1

### Development Tools
- **Linting**: ESLint 9.30.1
- **Dev Server**: Nodemon 3.1.10
- **Concurrency**: Concurrently 8.2.2
- **Deployment**: Vercel

## 📦 Installation & Setup

### Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 18.0.0 or higher)
- npm (comes with Node.js)
- Git
- A Supabase account (free tier works)

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/personal-blog.git
cd personal-blog
```

### Step 2: Install Dependencies

Install all dependencies for both client and server:

```bash
npm run install:all
```

Or manually:

```bash
# Root dependencies
npm install

# Client dependencies
cd client && npm install && cd ..

# Server dependencies
cd server && npm install && cd ..
```

### Step 3: Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Project Settings** → **API** and copy:
   - Project URL
   - `anon` public key
   - `service_role` secret key (for server)

3. Set up the database schema:
   - Go to **SQL Editor** in Supabase Dashboard
   - Create the necessary tables (posts, users, comments, notifications, genres, etc.)
   - Run the SQL from `NOTIFICATIONS_SETUP.md` to set up the notification system

4. Enable Realtime:
   ```sql
   ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
   ```

### Step 4: Configure Environment Variables

#### Client Environment (.env in `client/` directory)

Create `client/.env`:

```env
VITE_API_BASE_URL=http://localhost:4001/api
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### Server Environment (.env in `server/` directory)

Create `server/.env`:

```env
PORT=4001
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET=your_jwt_secret_key_here
```

**Security Note**: Never commit `.env` files to version control. They are already included in `.gitignore`.

### Step 5: Run the Application

#### Development Mode (Both Client and Server)

```bash
npm run dev
```

This will start:
- Client on `http://localhost:5173`
- Server on `http://localhost:4001`

#### Run Separately

Client only:
```bash
npm run dev:client
```

Server only:
```bash
npm run dev:server
```

### Step 6: Build for Production

```bash
npm run build
```

This will build both client and server for production deployment.

## 📖 Usage Guide

### Creating Your First Admin Account

1. Navigate to `http://localhost:5173/signup`
2. Register a new account
3. Manually update the user role in Supabase:
   - Go to **Table Editor** → **users** table
   - Find your user and change `role` to `'admin'`

### Writing Your First Article

1. Log in as admin at `http://localhost:5173/login`
2. Navigate to **Admin Dashboard** → **Articles** → **Create New**
3. Fill in the article details:
   - **Title**: Your article title
   - **Image URL**: Link to cover image
   - **Description**: Short summary
   - **Categories**: Select relevant genres
   - **Content**: Write in markdown format
   - **Status**: Choose "Draft" or "Published"
4. Click **Save** to create the article

### Markdown Examples

The content editor supports standard markdown:

```markdown
# Heading 1
## Heading 2

**Bold text** and *italic text*

- Bullet point 1
- Bullet point 2

1. Numbered list
2. Another item

[Link text](https://example.com)

![Image alt text](image-url.jpg)

\`\`\`javascript
// Code block
function hello() {
  console.log("Hello, World!");
}
\`\`\`
```

### Managing Categories

1. Go to **Admin Dashboard** → **Categories**
2. View existing categories or create new ones
3. Categories help organize articles for better navigation

### Viewing Notifications

1. Click the **bell icon** in the navbar
2. View notifications in real-time as users interact with your content
3. Click a notification to mark it as read
4. Delete notifications you no longer need

## 📂 Project Structure

```
personal-blog/
├── client/                      # React frontend application
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── admin/          # Admin-specific components
│   │   │   ├── member/         # Member-specific components
│   │   │   ├── ui/             # Reusable UI components
│   │   │   └── websection/     # Landing page sections
│   │   ├── context/            # React Context (Auth, etc.)
│   │   ├── hooks/              # Custom React hooks
│   │   ├── lib/                # Utility libraries
│   │   ├── pages/              # Page components
│   │   │   ├── admin/          # Admin pages
│   │   │   └── member/         # Member pages
│   │   ├── utils/              # Utility functions
│   │   ├── App.jsx             # Main app component
│   │   └── main.jsx            # Entry point
│   ├── package.json
│   └── vite.config.js          # Vite configuration
│
├── server/                      # Express.js backend
│   ├── middlewares/            # Express middlewares
│   │   ├── protectAdmin.mjs    # Admin authorization
│   │   ├── protectUser.mjs     # User authentication
│   │   └── post.validation.mjs # Post validation
│   ├── routers/                # API route handlers
│   │   ├── auth.mjs            # Authentication routes
│   │   ├── genres.mjs          # Category routes
│   │   ├── notifications.mjs   # Notification routes
│   │   ├── posts.mjs           # Post routes
│   │   └── profiles.mjs        # User profile routes
│   ├── utils/
│   │   └── db.mjs              # Supabase client
│   ├── app.mjs                 # Express app setup
│   └── package.json
│
├── NOTIFICATIONS_SETUP.md       # Notification system guide
├── PERFORMANCE_OPTIMIZATION.md  # Performance improvements
├── vercel.json                  # Vercel deployment config
└── package.json                 # Root package.json
```

## 🔌 API Documentation

### Base URL

Development: `http://localhost:4001/api`

### Authentication

Most endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Endpoints

#### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |
| GET | `/auth/me` | Get current user | Yes |
| PUT | `/auth/password` | Update password | Yes |

#### Posts

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/posts` | Get all published posts | No |
| GET | `/posts/:id` | Get single post | No |
| POST | `/posts` | Create new post | Admin |
| PUT | `/posts/:id` | Update post | Admin |
| DELETE | `/posts/:id` | Delete post | Admin |

#### Notifications

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/notifications` | Get user notifications | Yes |
| GET | `/notifications/unread-count` | Get unread count | Yes |
| PUT | `/notifications/:id/read` | Mark as read | Yes |
| PUT | `/notifications/mark-all-read` | Mark all as read | Yes |
| DELETE | `/notifications/:id` | Delete notification | Yes |

#### Genres

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/genres` | Get all genres | No |
| POST | `/genres` | Create genre | Admin |
| DELETE | `/genres/:id` | Delete genre | Admin |

#### Profiles

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/profiles/:id` | Get user profile | No |
| PUT | `/profiles/:id` | Update profile | Yes |

### Example Request

```javascript
// Get all posts
const response = await axios.get('http://localhost:4001/api/posts');

// Create a post (admin only)
const token = localStorage.getItem('token');
const response = await axios.post(
  'http://localhost:4001/api/posts',
  {
    title: 'My Article',
    content: '# Hello World',
    status_id: 2, // Published
    author_id: userId
  },
  {
    headers: { Authorization: `Bearer ${token}` }
  }
);
```

## ⚡ Performance Optimizations

This project implements several performance optimizations documented in `PERFORMANCE_OPTIMIZATION.md`:

### Build Performance
- Reduced Vercel build time from **~15 minutes to ~5 minutes** (66% faster)
- Eliminated redundant npm installations
- Unified build configuration

### API Rate Limiting Prevention
- **30-second caching** for notifications and unread counts
- **Request throttling** (1 request per second for articles)
- **Batched API calls** using `Promise.all()`
- **90% reduction** in redundant API calls

### Bundle Optimization
- Manual chunk splitting for vendor libraries, UI components, and utilities
- Better browser caching
- Faster initial page load
- Parallel chunk loading

### Real-time Optimization
- Proper subscription cleanup to prevent memory leaks
- Fixed useEffect dependencies to prevent unnecessary re-renders
- Efficient state management

## 🗺️ Roadmap

### Planned Features

- [ ] **Rich Text Editor**: WYSIWYG editor alternative to markdown
- [ ] **Image Upload**: Direct image upload to Supabase Storage
- [ ] **Social Sharing**: Share articles on social media
- [ ] **Email Notifications**: Optional email alerts for notifications
- [ ] **Article Series**: Group related articles into series
- [ ] **Tags System**: Additional tagging beyond categories
- [ ] **Reading Time**: Estimate reading time for articles
- [ ] **Bookmarks**: Allow users to bookmark articles
- [ ] **Dark Mode**: Toggle between light and dark themes
- [ ] **Analytics Dashboard**: View article performance metrics
- [ ] **Comments Threading**: Nested comment replies
- [ ] **Search Improvements**: Full-text search with filters
- [ ] **PWA Support**: Progressive Web App capabilities
- [ ] **RSS Feed**: Generate RSS feed for articles

### Future Enhancements

- Migration to TypeScript for better type safety
- Integration with third-party APIs (Dev.to, Medium)
- Multi-language support (i18n)
- Advanced SEO optimizations
- Automated testing suite

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

### How to Contribute

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/personal-blog.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Follow the existing code style
   - Add comments for complex logic
   - Ensure no linting errors (`npm run lint`)

4. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```

5. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**
   - Describe your changes clearly
   - Reference any related issues

### Code Style Guidelines

- Use functional components with hooks (no class components)
- Always add `displayName` to React components
- Use semantic HTML tags (`<section>`, `<article>`, `<header>`, `<footer>`)
- Avoid inline CSS styles (use TailwindCSS classes)
- Add `alt` text to all images
- Use JSX curly braces for special characters: `{"It's fine"}`
- Avoid `any` type; use `unknown` or specific types
- Write clear, self-documenting code

### Reporting Issues

If you find a bug or have a feature request:
1. Check if it's already reported in [Issues](https://github.com/your-username/personal-blog/issues)
2. If not, create a new issue with:
   - Clear description
   - Steps to reproduce (for bugs)
   - Expected vs actual behavior
   - Screenshots (if applicable)

## 🙏 Credits

### Technologies & Libraries

- [React](https://reactjs.org/) - UI framework
- [Vite](https://vitejs.dev/) - Build tool
- [TailwindCSS](https://tailwindcss.com/) - CSS framework
- [Supabase](https://supabase.com/) - Backend as a Service
- [Express.js](https://expressjs.com/) - Backend framework
- [Radix UI](https://www.radix-ui.com/) - Accessible UI components
- [Lucide React](https://lucide.dev/) - Icon library

### Learning Resources

- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev/)
- [MDN Web Docs](https://developer.mozilla.org/)
- "How to Write a Good README – a Step-by-Step Guide" - freeCodeCamp

### Acknowledgments

Special thanks to:
- The open-source community for amazing tools and libraries
- TechUp program for project guidance and support
- All contributors who help improve this project

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2025 Personal Blog

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<div align="center">

**Built with ❤️ by developers, for developers**

[Report Bug](https://github.com/your-username/personal-blog/issues) · [Request Feature](https://github.com/your-username/personal-blog/issues) · [Documentation](https://github.com/your-username/personal-blog/wiki)

</div>

