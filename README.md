# Cachet - Frontend

The frontend for **Cachet**, a secure digital document vault. Built with Next.js, this handles the landing page, authentication UI, dashboard, document management, sharing flows, and settings.

Backend repository: [cachet-backend](https://github.com/zahrabatoolmns-sketch/cachet-backend)

## Features

-  Landing page with animated sections (Features, How It Works, FAQ, CTA)
-  Auth flows - login, signup, forgot/reset password, Google Sign-In
-  Dashboard with stats, storage usage ring, and recent activity
-  Document management, drag-and-drop upload, categories, tags, expiry dates
-  Debounced search and filters (category, sort by date/title)
-  Secure sharing modal with expiry + password protection
-  Bulk ZIP import and bulk document actions (delete, recategorize)
-  Custom avatar picker
-  Fully responsive, with a mobile sidebar drawer

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **State**: Zustand (with persisted auth store)
- **API calls**: Axios
- **Forms**: React Hook Form + Zod
- **Auth**: JWT (via backend) + Google OAuth (`@react-oauth/google`)
- **Toasts**: Sonner

## Getting Started

### Prerequisites

- Node.js 18+
- The [backend](https://github.com/zahrabatoolmns-sketch/cachet-backend) running locally.

### Installation

```bash
git clone https://github.com/zahrabatoolmns-sketch/cachet-frontend.git
cd cachet-frontend
npm install
```

### Environment Variables

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=1072443132476-qbq54dp3e6rjt620p13rdkqjq9namrca.apps.googleusercontent.com
```

### Run locally

```bash
npm run dev
```

Visit `http://localhost:3000`.
