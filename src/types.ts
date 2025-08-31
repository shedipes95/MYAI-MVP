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

// Authentication types
export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
} | null;

export type AuthError = {
  message: string;
  field?: string;
};

export type SignUpData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type LoginData = {
  email: string;
  password: string;
};

export type ForgotPasswordData = {
  email: string;
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
