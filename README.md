# MyAI — Personal Finance Dashboard

A single-page web app that turns a raw bank statement (CSV) into a clear picture of where your money goes, with budgets, savings goals, loans, insurance, and an AI assistant you can actually ask questions.

## What it does

You upload a bank CSV, the app cleans it up and sorts each transaction into a spending category, and then it shows you the numbers in a way that's easy to read: total spend, your biggest category, a breakdown by category, and a chat assistant that answers questions about your own data ("how much did I spend on groceries?", "where can I cut back?").

The categorisation runs through a backend service, so messy real-world descriptions get grouped into sensible categories rather than left as raw text.

## Why I built it

I'm a data analyst moving into data science, and I wanted a project that does the full loop end to end: take messy real data in, clean and structure it, categorise it, and turn it into something a non-technical person can read and act on. Personal finance was a good fit because everyone has the data and nobody enjoys looking at a spreadsheet of it.

It's also where my two backgrounds meet — financial risk management (budgets, loans, spend analysis) and human-centred AI (an assistant that explains the numbers in plain language).

## Key features

- **CSV ingest** — upload a bank statement and the app parses it into structured transactions, handling different column names and formats.
- **Automatic categorisation** — each transaction is sorted into a spending category via a processing service, so you see "Groceries / Utilities / Mortgage" instead of raw merchant strings.
- **Spending dashboard** — KPI cards (total spend, top category, transaction count) and a category pie chart built with Chart.js.
- **Budget** — track planned vs. actual spending.
- **Accounts** — overview of balances across accounts.
- **Savings** — set goals and see progress, plus a savings-impact calculator.
- **Loans** — track loans, APR and payment schedules.
- **Insurance** — view home and car insurance details and quotes.
- **AI chat assistant** — ask questions in plain English and get answers grounded in your actual transactions, budget, accounts, savings and loans.
- **Auth + onboarding** — login, sign-up and a guided first-run flow with persistent sessions.

## Tech stack

- **React 18** + **TypeScript**
- **Vite** (dev server and build)
- **Zustand** for state management
- **React Router** for routing
- **Tailwind CSS** for styling
- **Chart.js** / react-chartjs-2 for the data visualisations
- **lucide-react** for icons
- ESLint + Prettier for linting and formatting

TypeScript makes up the large majority of the codebase.

## How it's put together

```
src/
├── api/         # transaction processing + insurance API clients
├── components/  # UI: charts, KPI cards, drop zone, layout, etc.
├── pages/       # Budget, Accounts, Loans, Insurance, Chat, Ingest, auth...
├── services/    # the financial chat assistant logic
├── store/       # Zustand app store
├── utils/       # CSV parsing, formatting, downloads
└── types.ts     # shared TypeScript types
```

## Run it

```bash
git clone https://github.com/shedipes95/MYAI-MVP.git
cd MYAI-MVP
npm install
npm run dev
```

Then open `http://localhost:5173`.

The transaction categorisation and insurance lookups call external services, configured through environment variables (see `.env.local`). The rest of the dashboard — charts, budgets, savings, the chat assistant — runs in the browser, and there's sample data (`real-transactions.csv`) you can upload to try the ingest flow.

Other scripts:

```bash
npm run build     # type-check and build for production
npm run preview   # preview the production build
npm run lint      # run ESLint
```

## Status

This is an MVP / portfolio project built to demonstrate the full data flow — raw input, cleaning, categorisation, and visualisation — in a working app rather than a notebook.
