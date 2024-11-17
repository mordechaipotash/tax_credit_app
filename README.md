# WOTC Tax Credit Processing App

A comprehensive web application for processing Work Opportunity Tax Credit (WOTC) forms through automated email and document classification.

## Tech Stack

- Framework: Next.js 14 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- Database: Supabase
- Authentication: Google OAuth
- Email Integration: Gmail API
- AI Classification: OpenRouter API (Claude-2)

## Features

- Email Processing System
- Document Classification
- PDF Form Viewer
- Bulk Processing
- Real-time Status Updates

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/mordechaipotash/tax_credit_app.git
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Start the development server:
```bash
npm run dev
```

## Environment Variables

Required environment variables:
- `OPENROUTER_API_KEY`: API key for OpenRouter
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `GOOGLE_REFRESH_TOKEN`: Google OAuth refresh token

## License

MIT
