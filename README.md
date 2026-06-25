# DevJournal Frontend

The web user interface for DevJournal, built using Next.js, TailwindCSS, and Lucide React.

## Features

- Clean developer journal interface with dark/light themes.
- Nested, collapsible navigation menu (OS -> Linux/Windows, Coding -> Languages/Databases).
- Dynamic tag filtering using Next.js search parameters and Suspense.
- Category-aware dynamic routes for all posts (e.g., `/coding/languages/blog/[slug]`).
- Admin panel console for creating, editing, and deleting blog posts with featured toggles.
- Cloudinary client service wrapper for handling cover image uploads.

## Tech Stack

- Framework: Next.js (App Router)
- Styling: TailwindCSS
- Icons: Lucide React

## Environment Configuration

Create a `.env.local` file in the frontend directory with the following variables:

```env
NEXT_PUBLIC_API_URL="http://localhost:5069"
AUTH_HASH="your-secure-auth-hash"
```

## Setup and Installation

Install dependencies:
```bash
npm install
```

## Running the Application

```bash
# Development mode
npm run dev

# Production build and run
npm run build
npm run start
```
