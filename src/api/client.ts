import type { Account, BudgetData, InsuranceProduct, Loan, SavingsGoal } from "@/types";

/**
 * Global API client with mock data.
 * Swap internals for real fetch/axios later.
 */
const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const api = {
  // API PLACEHOLDER
  // TODO connect to real API: GET /api/budget
  async getBudget(): Promise<BudgetData> {
    await sleep(250);
    return {
      totalSpent: 1275,
      totalLimit: 2000,
      categories: [
        { name: "Groceries", spent: 320, limit: 400 },
        { name: "Rent", spent: 900, limit: 900 },
        { name: "Transport", spent: 55, limit: 120 },
        { name: "Eating out", spent: 140, limit: 180 },
        { name: "Utilities", spent: 120, limit: 200 },
      ],
    };
  },

  // API PLACEHOLDER
  // TODO connect to real API: GET /api/accounts
  async getAccounts(): Promise<Account[]> {
    await sleep(250);
    return [
      { id: "acc_1", name: "AIB Current", last4: "1234", balance: 1520.55 },
      { id: "acc_2", name: "Revolut", last4: "9876", balance: 310.12 },
      { id: "acc_3", name: "Savings", last4: "4455", balance: 5000.0 },
    ];
  },

  // API PLACEHOLDER
  // TODO connect to real API: POST /api/chat  body: { message }
  async postChat(message: string): Promise<{ reply: string }> {
    await sleep(200);
    return { reply: `Echo: ${message}` };
  },

  // API PLACEHOLDER
  // TODO connect to real API: GET /api/savings
  async getSavings(): Promise<SavingsGoal[]> {
    await sleep(250);
    return [
      { id: "g1", name: "Emergency Fund", target: 3000, progress: 0.6 },
      { id: "g2", name: "New Laptop", target: 1200, progress: 0.25 },
      { id: "g3", name: "Holiday", target: 1500, progress: 0.1 },
    ];
  },

  // API PLACEHOLDER
  // TODO connect to real API: GET /api/loans
  async getLoans(): Promise<Loan[]> {
    await sleep(250);
    return [
      { id: "l1", name: "Car Loan", apr: 6.9, monthlyPayment: 220 },
      { id: "l2", name: "Student Loan", apr: 3.2, monthlyPayment: 95 },
    ];
  },

  // API PLACEHOLDER
  // TODO connect to real API: GET /api/insurance
  async getInsurance(): Promise<InsuranceProduct[]> {
    await sleep(250);
    return [
      { id: "i1", type: "Home", provider: "Acme Home" },
      { id: "i2", type: "Car", provider: "RoadCare" },
    ];
  },
};
