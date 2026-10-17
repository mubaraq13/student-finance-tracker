# Student Finance Tracker

A modern finance tracking application built for students to manage their expenses, income, and financial goals.

## Features

- **Dashboard** - Overview of your financial status with charts and summaries
- **Transactions** - Track income and expenses with categorization
- **Accounts** - Manage multiple bank accounts and wallets
- **Categories** - Organize transactions by custom categories
- **Reports** - Visual financial reports and analytics
- **AI-Powered Insights** - Get intelligent suggestions for your spending habits

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **Charts**: Recharts
- **Authentication**: Supabase Auth

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
app/
├── (dashboard)/          # Dashboard routes (auth required)
│   ├── accounts/         # Account management
│   ├── categories/       # Category management
│   ├── dashboard/        # Main dashboard
│   ├── reports/          # Financial reports
│   └── transactions/     # Transaction management
├── login/                # Authentication pages
├── layout.tsx            # Root layout
└── page.tsx              # Home page
components/
├── accounts/             # Account components
├── categories/           # Category components
├── dashboard/            # Dashboard components
├── layout/               # Layout components
├── reports/              # Report components
├── shared/               # Shared components
└── transactions/         # Transaction components
lib/
├── supabase/             # Supabase client/server utilities
└── utils.ts              # Utility functions
types/                    # TypeScript types
```

## License

MIT