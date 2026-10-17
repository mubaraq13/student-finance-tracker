# Student Finance Tracker

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=28&pause=1000&color=38BDF8&center=true&vCenter=true&width=700&lines=Student+Finance+Tracker;Track+Smarter.+Spend+Better.;Your+Personal+Finance+Companion." alt="Student Finance Tracker animated title" />
</p>

<p align="center">
  <strong>A modern, AI-ready personal finance management application designed for students.</strong>
</p>

<p align="center">
  Track your income, control expenses, manage accounts, visualize financial habits, and work toward better financial decisions.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?logo=next.js" alt="Next.js 15" />
  <img src="https://img.shields.io/badge/TypeScript-Ready-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-Ready-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Supabase-Backend-3FCF8E?logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="MIT License" />
</p>

<p align="center">
  <a href="#-overview">Overview</a> •
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Installation</a> •
  <a href="#-project-structure">Structure</a> •
  <a href="#-roadmap">Roadmap</a>
</p>

---

## 📌 Overview

**Student Finance Tracker** is a personal finance management web application built to help students understand, organize, and improve their financial habits.

Students often manage money from monthly allowances, scholarships, part-time jobs, and other income sources. Without organized records, it can be difficult to identify spending patterns, control unnecessary expenses, or plan savings.

This project aims to provide a centralized dashboard for managing personal finances through transaction tracking, account management, categorized expenses, financial reports, and a foundation for AI-powered assistance.

### 🎯 Project Goals

- Make daily income and expense recording easier.
- Help students understand their financial condition.
- Visualize spending habits through charts and reports.
- Support better budgeting and saving decisions.
- Provide a foundation for AI-assisted financial recording and analysis.
- Build a maintainable, scalable, and portfolio-ready web application.

### 👥 Target Users

- University and college students.
- Students living independently or away from home.
- Individuals who need simple personal financial records.
- Developers interested in full-stack development and financial technology.

---

## ✨ Features

> Feature availability depends on the current implementation. Planned functionality is identified explicitly.

| Feature | Description | Status |
|---|---|---|
| Dashboard | Overview of income, expenses, balance, and financial activity | Core feature |
| Transactions | Record and manage income and expenses | Core feature |
| Categories | Organize transactions into custom categories | Core feature |
| Accounts | Manage wallets, cash, and bank accounts | Core feature |
| Financial Reports | Analyze spending trends and transaction summaries | Core feature |
| Authentication | Secure user sign-up and login through Supabase Auth | Core feature |
| Responsive UI | Layout for desktop, tablet, and mobile screens | UI target |
| AI Financial Insights | Generate insights from recorded transactions | Planned |
| Voice Note Recording | Record or upload spoken transaction details | Planned |
| Automatic Transaction Parsing | Convert recognized speech into structured transaction data | Planned |
| Budget Management | Define spending limits and monitor budget usage | Planned |
| Financial Goals | Track savings targets and progress | Planned |
| Export Reports | Download transaction data for personal analysis | Planned |

### 💡 Example Use Case

A student receives Rp1,500,000 in monthly allowance and spends money on food, transportation, internet, and college expenses.

The application can help the student:

1. Record income and expenses.
2. Categorize each transaction.
3. Monitor the remaining balance.
4. Review spending patterns.
5. Identify categories with high expenditure.
6. Set budgets and savings goals as those features become available.

---

## 🧰 Tech Stack

The following stack reflects the supplied project specification. Confirm the installed package versions and implemented features in the repository before treating this list as a complete inventory.

| Technology | Role | Why It Is Used |
|---|---|---|
| Next.js 15 | React framework | File-based routing, layouts, server rendering, and full-stack application structure |
| React | UI library | Reusable components and interactive interfaces |
| TypeScript | Programming language | Static typing and better maintainability |
| Tailwind CSS | CSS framework | Utility-first styling and responsive layouts |
| Supabase | Backend platform | PostgreSQL database, authentication, and optional storage |
| PostgreSQL | Relational database | Structured storage for users, accounts, categories, and transactions |
| Recharts | Data visualization | Financial charts and analytics |
| npm | Package manager | Dependency installation and project scripts |
| Vercel | Deployment platform | Hosting and deployment for Next.js applications |

### Optional Tools for Future Development

| Tool | Purpose | Required Now? |
|---|---|---|
| Git | Version control | Recommended |
| GitHub | Source code hosting | Recommended |
| VS Code | Code editor | Recommended |
| ESLint | Code quality checks | Check project configuration |
| Prettier | Consistent code formatting | Optional |
| Zod | Input and data validation | Optional |
| React Hook Form | Form management | Optional |
| Vitest | Unit testing | Optional |
| Playwright | Browser-based end-to-end testing | Optional |
| Framer Motion / Motion | Interface animations | Optional |
| Lucide React | Consistent icon library | Optional |
| Vercel Analytics | Web traffic insights | Optional |

**Important:** Optional packages are not automatically installed just because they appear in this README.

---

## ⚙️ Getting Started

Follow these instructions to run the application locally.

### 1. Prerequisites

Install the following tools before starting.

| Tool | Minimum / Recommendation | Link |
|---|---|---|
| Node.js | Node.js 20.9+ recommended for Next.js 15 | [Download Node.js](https://nodejs.org/) |
| npm | Included with Node.js | [npm documentation](https://docs.npmjs.com/) |
| Git | Current stable release | [Download Git](https://git-scm.com/downloads) |
| VS Code | Latest stable release | [Download VS Code](https://code.visualstudio.com/) |
| Supabase account | Free tier can be used within its current limits | [Supabase](https://supabase.com/) |
| GitHub account | For repository hosting | [GitHub](https://github.com/) |
| Vercel account | For deployment; optional during local development | [Vercel](https://vercel.com/) |

Check your installations:

```bash
node -v
npm -v
git --version
```

### 2. Clone the Repository

Replace the example URL with the actual URL of your GitHub repository.

```bash
git clone https://github.com/YOUR_USERNAME/student-finance-tracker.git
cd student-finance-tracker
```

If the repository already exists on your computer, open the existing project directory instead.

### 3. Install Dependencies

```bash
npm install
```

This installs the dependencies listed in `package.json` and uses the lockfile when available.

Do not install every optional library listed in the technology table. Add a dependency only when the application actually needs it.

### 4. Configure Supabase

1. Open [Supabase](https://supabase.com/).
2. Create a project.
3. Open the project's API settings.
4. Obtain the project URL and publishable key, or the legacy anonymous key if the project uses that configuration.
5. Configure the environment variables below.

Create a file named `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY
```

The variable name above is retained from the supplied project configuration. If the installed Supabase client uses a different variable name, update the code and this file consistently.

**Security requirements:**

- Never commit `.env.local` to GitHub.
- Never expose a Supabase service-role key in frontend code.
- Treat all `NEXT_PUBLIC_*` variables as public.
- Enable Row Level Security (RLS) on tables containing user-specific financial data.
- Write policies that restrict each authenticated user to their own records.
- Validate input and enforce authorization on the server or database, not only in the UI.

Example `.gitignore` entries:

```gitignore
node_modules/
.next/
out/
build/
dist/
coverage/
.env*
!.env.example
*.log
.DS_Store
```

For a safe template, create `.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Never put real credentials in `.env.example`.

### 5. Start the Development Server

```bash
npm run dev
```

Open:

**http://localhost:3000**

To create a production build:

```bash
npm run build
npm run start
```

The available commands depend on the scripts configured in `package.json`.

### 6. Recommended Quality Checks

If the corresponding scripts are configured:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

If a script is missing, inspect `package.json` before running or adding it. Next.js and ESLint configuration varies by project version.

---

## 🗂️ Project Structure

The following is a **proposed reference structure** based on the supplied routes. It is not a guarantee that every directory or file already exists.

```text
student-finance-tracker/
│
├── app/
│   ├── (dashboard)/
│   │   ├── accounts/
│   │   │   └── page.tsx
│   │   ├── categories/
│   │   │   └── page.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── reports/
│   │   │   └── page.tsx
│   │   ├── transactions/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── accounts/
│   ├── categories/
│   ├── dashboard/
│   ├── layout/
│   ├── reports/
│   ├── shared/
│   └── transactions/
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   └── utils.ts
│
├── types/
│   ├── account.ts
│   ├── category.ts
│   └── transaction.ts
│
├── public/
│   ├── images/
│   └── icons/
│
├── .env.example
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── tsconfig.json
└── README.md
```

### Directory Responsibilities

| Directory | Responsibility |
|---|---|
| `app/` | Routes, layouts, pages, and route-level loading or error UI |
| `app/(dashboard)/` | Group authenticated application pages; parentheses do not appear in URLs |
| `components/` | Reusable interface components |
| `components/dashboard/` | Summary cards, charts, and dashboard widgets |
| `components/transactions/` | Transaction forms, tables, and filters |
| `components/shared/` | Shared buttons, inputs, dialogs, and other reusable elements |
| `lib/supabase/` | Supabase browser and server client utilities |
| `lib/utils.ts` | Shared utility functions |
| `types/` | Shared TypeScript data models |
| `public/` | Static assets served directly by Next.js |

A route group such as `(dashboard)` does not automatically protect pages. Authentication and authorization checks must be implemented separately.

---

## 🗄️ Database Design

Supabase provides a managed PostgreSQL database. A relational schema is suitable for connecting users, accounts, categories, and transactions.

The following is a conceptual schema; the actual database tables must be created and aligned with the application's queries.

### Suggested Tables

| Table | Important Fields | Purpose |
|---|---|---|
| profiles | id, display_name, created_at | Optional user profile linked to authentication |
| accounts | id, user_id, name, account_type, initial_balance | Cash, bank, or wallet accounts |
| categories | id, user_id, name, type | Income and expense categories |
| transactions | id, user_id, account_id, category_id, amount, type, description, transaction_date | Financial transaction records |
| budgets | id, user_id, category_id, limit_amount, period_start, period_end | Planned spending limits |
| financial_goals | id, user_id, title, target_amount, current_amount, target_date | Savings goals |

### Database Rules

- Use UUIDs for identifiers where appropriate.
- Use foreign keys to maintain relationships.
- Store timestamps consistently and handle time zones explicitly.
- Store monetary amounts using PostgreSQL `NUMERIC` or integer minor units, not floating-point types.
- Define whether the transaction amount is always positive and whether transaction direction is represented by `type`.
- Define how transfers between accounts work to prevent double-counting income or expenses.
- Use RLS policies for all user-owned data.
- Create indexes for commonly filtered fields, such as `user_id`, `transaction_date`, and `account_id`.
- Use database transactions when an operation must update multiple related records atomically.

### Example Transaction Record

```json
{
  "type": "expense",
  "amount": 25000,
  "description": "Lunch",
  "category": "Food",
  "currency": "IDR"
}
```

This is an illustrative application-level object, not necessarily the exact Supabase table schema. Adapt it to the actual database design.

---

## 🤖 AI & Voice Note Roadmap

One potential future direction is AI-assisted transaction recording. The system could turn a spoken transaction into a draft record, reducing manual entry.

### Example User Flow

```text
User records a voice note
          |
          v
Audio transcription
          |
          v
Extract transaction details
          |
          v
Validate amount, type, date and category
          |
          v
Show a review and confirmation screen
          |
          v
Save the confirmed transaction
          |
          v
Update financial summaries
```

### Example Voice Note

> "Tadi saya makan siang dua puluh lima ribu rupiah."

An AI-assisted workflow could produce a draft:

```json
{
  "type": "expense",
  "amount": 25000,
  "currency": "IDR",
  "category": "Food",
  "description": "Lunch"
}
```

The system should ask the user to confirm ambiguous information before saving. A transcript or AI-generated result must not automatically be treated as an accurate financial record.

### Potential Components

| Component | Possible Technology | Responsibility |
|---|---|---|
| Audio capture | Browser MediaRecorder API | Record audio with user permission |
| Speech-to-text | Browser speech recognition or a transcription API | Convert speech into text |
| Structured extraction | An LLM API or deterministic parsing | Extract amount, date, type, and description |
| Validation | TypeScript and a schema validator such as Zod | Reject invalid or incomplete data |
| Database | Supabase PostgreSQL | Store confirmed transactions |
| AI insights | A language model plus computed financial aggregates | Explain patterns in spending |

### Cost and Privacy Considerations

- Browser speech recognition support and reliability vary across browsers and languages.
- A hosted speech-to-text or LLM API may incur usage charges.
- Free quotas, rate limits, and provider policies can change.
- Never place private API keys in client-side JavaScript.
- Request microphone permission only when recording is initiated.
- Avoid sending unnecessary personal financial data to third-party AI providers.
- Calculate balances and totals using application logic or database queries, rather than trusting an LLM to perform financial arithmetic.
- Do not claim that AI features are available until the required service, backend, validation, and UI are implemented.

---

## 📊 Financial Analytics

The dashboard can provide meaningful summaries using structured transaction data.

Potential metrics include:

- Total income for a selected period.
- Total expenses for a selected period.
- Net cash flow.
- Spending by category.
- Monthly spending trends.
- Budget utilization.
- Savings progress.

A basic calculation is:

```text
Net Cash Flow = Total Income - Total Expenses
```

For example, if income is Rp1,500,000 and expenses are Rp1,100,000, the net cash flow is Rp400,000 for that period.

**Accounting note:** Net cash flow for a period is not necessarily the same as the total balance across accounts. Opening balances, transfers, pending transactions, and other adjustments must be handled consistently.

Recharts can display trends using line charts, category breakdowns using bar charts, and spending composition using pie charts. Chart data should come from validated database records and must respect the selected date range.

---

## 🎨 UI/UX Design Principles

The interface should prioritize clarity and efficient daily use rather than decorative complexity.

Recommended principles:

- Responsive layouts for mobile, tablet, and desktop.
- Consistent spacing, typography, and color tokens.
- Clear distinction between income, expenses, and balances.
- Accessible labels and keyboard navigation.
- Loading, empty, success, and error states.
- Confirmation before destructive actions.
- Useful date filters and transaction search.
- Readable charts with labels and meaningful legends.
- Subtle transitions rather than excessive animation.
- Respect for reduced-motion preferences.

### Optional Animation Libraries

For interface transitions, consider Motion (formerly Framer Motion) after confirming compatibility with the installed React and Next.js versions. CSS transitions are often sufficient for simpler interactions.

An animated typing title is already included at the top of this README using an external SVG service. It is decorative and does not represent an animation built into the application itself.

---

## 🔐 Security & Privacy

Financial records are sensitive data. Security should be treated as a core application requirement.

- Use Supabase Auth for authentication.
- Enable and test RLS on every user-owned table.
- Verify authorization on the server and database.
- Never trust a client-supplied `user_id` without checking the authenticated identity.
- Keep service-role keys and third-party AI secrets on the server.
- Validate all incoming form data.
- Avoid logging sensitive financial details.
- Protect destructive operations and handle errors safely.
- Use HTTPS in production.
- Test cross-user access to ensure one user cannot read or modify another user's records.
- Define a backup and recovery strategy before relying on the application for important financial records.

Supabase Auth alone does not guarantee database isolation. Correct database policies and authorization checks are essential.

---

## 🚀 Deployment

### Deploy with Vercel

1. Push the project to GitHub.
2. Open [Vercel](https://vercel.com/).
3. Import the repository.
4. Configure the required environment variables in the project settings.
5. Deploy the application.
6. Test login, database access, page navigation, and production builds.

### Production Checklist

- [ ] Build completes successfully.
- [ ] Environment variables are configured.
- [ ] No secrets are committed to Git.
- [ ] Supabase RLS policies are enabled and tested.
- [ ] Authentication redirects work correctly.
- [ ] Transaction validation is working.
- [ ] Dashboard totals match database records.
- [ ] Empty and error states are handled.
- [ ] Mobile layouts are usable.
- [ ] Production deployment has been tested.

Free hosting and database tiers may be sufficient for a student portfolio, but limits, availability policies, and usage quotas can change. Check the providers' current plans before deployment.

---

## ⚖️ Advantages & Limitations

### Advantages

- **Student-focused:** Designed around practical personal finance needs.
- **Modern stack:** Next.js, TypeScript, and Supabase support a structured development workflow.
- **Relational data:** PostgreSQL supports relationships and reliable querying.
- **Authentication support:** Supabase provides a managed authentication service.
- **Visual analytics:** Recharts can help make financial patterns easier to understand.
- **Deployment options:** Vercel offers a convenient deployment workflow for Next.js.
- **Extensible architecture:** The application can be expanded with budgeting, voice input, and AI-assisted insights.

### Limitations

- **Backend configuration:** Supabase still requires database design, access policies, and environment configuration.
- **Security responsibility:** Managed authentication does not automatically secure every database query.
- **Vendor dependency:** Supabase and Vercel introduce provider-specific configuration and platform dependencies.
- **Free-tier constraints:** Quotas and policies may limit storage, compute, or availability.
- **AI operating costs:** Speech recognition and LLM APIs may require paid usage as the application grows.
- **Data quality:** Financial analytics are only as accurate as the recorded transactions and calculation rules.
- **Scope complexity:** Voice input, automated extraction, and reliable financial reporting require testing beyond a basic CRUD application.
- **Deployment and maintenance:** Dependency updates, migrations, monitoring, and backups still require attention.

---

## 🧪 Testing Strategy

Recommended tests as the project matures:

| Test Area | Example |
|---|---|
| Unit tests | Validate currency formatting and transaction calculations |
| Form validation | Reject missing amounts or invalid transaction types |
| Integration tests | Verify database writes and reads |
| Authentication | Test login, logout, and protected routes |
| Authorization | Confirm users cannot access another user's records |
| Analytics | Verify monthly totals against known sample transactions |
| Responsive UI | Test common mobile and desktop screen sizes |
| Production build | Ensure the app builds and runs in production mode |

Use Vitest for unit tests and Playwright for end-to-end tests if they fit the project's existing tooling. Neither is required unless configured.

---

## 🗺️ Roadmap

The following roadmap is a proposed development plan, not a statement of completed work.

- [x] Define the initial application concept and technology stack.
- [ ] Complete core dashboard UI.
- [ ] Implement transaction CRUD.
- [ ] Implement account and category management.
- [ ] Configure Supabase Auth and database access policies.
- [ ] Implement financial reports and date filters.
- [ ] Improve responsive design and accessibility.
- [ ] Add budget management.
- [ ] Add savings goals.
- [ ] Prototype voice-note transcription.
- [ ] Implement validated AI-assisted transaction drafts.
- [ ] Add automated tests and error monitoring.
- [ ] Complete production deployment and security review.

Update this checklist as each feature is implemented and tested.

---

## 🤝 Contributing

Contributions, suggestions, and bug reports are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make a focused change.
4. Run relevant checks.
5. Commit with a descriptive message.
6. Open a pull request describing the change.

Example:

```bash
git checkout -b feat/budget-management
git add .
git commit -m "feat: add budget management"
git push origin feat/budget-management
```

Follow the project's existing formatting and naming conventions. Do not commit credentials, real personal financial records, or private user data.

---

## 📚 Documentation & Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Recharts Documentation](https://recharts.org/)
- [Vercel Documentation](https://vercel.com/docs)
- [Node.js Documentation](https://nodejs.org/docs)
- [Git Documentation](https://git-scm.com/doc)

---

## 📄 License

This project is intended to use the MIT License.

Before distributing the project under MIT, add a `LICENSE` file containing the official MIT license text and the appropriate copyright holder and year. The license is not effective merely because this README names it.

---

## 👨‍💻 Author

**Muhammad dzaky mubaraq**

- GitHub: [mubaraq13](https://github.com/mubaraq13)
- Project: [Student Finance Tracker](https://github.com/mubaraq13)
Replace the placeholders with your actual profile and repository URLs.

---

<p align="center">
  <strong>Track smarter. Understand your habits. Make better financial decisions.</strong>
</p>

<p align="center">
  Built as a learning project exploring full-stack web development, data visualization, and AI-assisted personal finance.
</p>
