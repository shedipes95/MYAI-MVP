export type BudgetCategory = {
  name: string;
  spent: number;
  limit: number;
};

export type BudgetData = {
  totalSpent: number;
  totalLimit: number;
  categories: BudgetCategory[];
};

export type Account = {
  id: string;
  name: string;
  last4: string;
  balance: number;
};

export type ChatMessage = {
  id: string;
  from: "user" | "ai";
  text: string;
  ts: number;
};

export type SavingsGoal = {
  id: string;
  name: string;
  target: number;
  progress: number; // 0..1
};

export type Loan = {
  id: string;
  name: string;
  apr: number; // e.g., 7.2 (%)
  monthlyPayment: number;
};

export type InsuranceProduct = {
  id: string;
  type: "Home" | "Car";
  provider?: string;
};
