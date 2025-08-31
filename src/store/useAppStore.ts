import { create } from "zustand";
import { api } from "@/api/client";
import type {
  Account,
  BudgetData,
  ChatMessage,
  InsuranceProduct,
  Loan,
  SavingsGoal,
  User,
  AuthError,
  SignUpData,
  LoginData,
  ForgotPasswordData,
} from "@/types";

type State = {
  // Authentication
  user: User;
  authLoading: boolean;
  authError: AuthError | null;

  // App data
  budget: BudgetData | null;
  budgetLoading: boolean;

  accounts: Account[];
  accountsLoading: boolean;

  savings: SavingsGoal[];
  savingsLoading: boolean;

  loans: Loan[];
  loansLoading: boolean;

  insurance: InsuranceProduct[];
  insuranceLoading: boolean;

  chat: ChatMessage[];
  chatSending: boolean;

  uploadedCsv: Array<Record<string, string>>;
};

type Actions = {
  // Authentication actions
  login: (data: LoginData) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  forgotPassword: (data: ForgotPasswordData) => Promise<void>;
  logout: () => void;
  clearAuthError: () => void;

  // App actions
  fetchBudget: () => Promise<void>;
  fetchAccounts: () => Promise<void>;
  fetchSavings: () => Promise<void>;
  fetchLoans: () => Promise<void>;
  fetchInsurance: () => Promise<void>;

  sendChat: (text: string) => Promise<void>;

  setUploadedCsv: (rows: Array<Record<string, string>>) => void;
};

const initialState: State = {
  // Authentication
  user: null,
  authLoading: false,
  authError: null,

  // App data
  budget: null,
  budgetLoading: false,
  accounts: [],
  accountsLoading: false,
  savings: [],
  savingsLoading: false,
  loans: [],
  loansLoading: false,
  insurance: [],
  insuranceLoading: false,
  chat: [],
  chatSending: false,
  uploadedCsv: [],
};

export const useAppStore = create<State & Actions>((set, get) => ({
  ...initialState,

  // Authentication actions
  login: async (data: LoginData) => {
    set({ authLoading: true, authError: null });
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Demo validation
      if (!data.email || !data.password) {
        throw new Error("Email and password are required");
      }

      // Demo user creation
      const user = {
        id: crypto.randomUUID(),
        email: data.email,
        firstName: "Demo",
        lastName: "User",
        createdAt: new Date().toISOString(),
      };

      set({ user, authLoading: false });
    } catch (error) {
      set({
        authError: { message: error instanceof Error ? error.message : "Login failed" },
        authLoading: false,
      });
    }
  },

  signUp: async (data: SignUpData) => {
    set({ authLoading: true, authError: null });
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Demo validation
      if (!data.email || !data.password || !data.firstName || !data.lastName) {
        throw new Error("All fields are required");
      }

      if (data.password !== data.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      if (data.password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }

      // Demo user creation
      const user = {
        id: crypto.randomUUID(),
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        createdAt: new Date().toISOString(),
      };

      set({ user, authLoading: false });
    } catch (error) {
      set({
        authError: { message: error instanceof Error ? error.message : "Sign up failed" },
        authLoading: false,
      });
    }
  },

  forgotPassword: async (data: ForgotPasswordData) => {
    set({ authLoading: true, authError: null });
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (!data.email) {
        throw new Error("Email is required");
      }

      // Demo: always succeeds
      set({ authLoading: false });
    } catch (error) {
      set({
        authError: { message: error instanceof Error ? error.message : "Password reset failed" },
        authLoading: false,
      });
    }
  },

  logout: () => set({ user: null, authError: null }),

  clearAuthError: () => set({ authError: null }),

  fetchBudget: async () => {
    set({ budgetLoading: true });
    try {
      set({ budget: await api.getBudget() });
    } finally {
      set({ budgetLoading: false });
    }
  },
  fetchAccounts: async () => {
    set({ accountsLoading: true });
    try {
      set({ accounts: await api.getAccounts() });
    } finally {
      set({ accountsLoading: false });
    }
  },
  fetchSavings: async () => {
    set({ savingsLoading: true });
    try {
      set({ savings: await api.getSavings() });
    } finally {
      set({ savingsLoading: false });
    }
  },
  fetchLoans: async () => {
    set({ loansLoading: true });
    try {
      set({ loans: await api.getLoans() });
    } finally {
      set({ loansLoading: false });
    }
  },
  fetchInsurance: async () => {
    set({ insuranceLoading: true });
    try {
      set({ insurance: await api.getInsurance() });
    } finally {
      set({ insuranceLoading: false });
    }
  },

  sendChat: async (text: string) => {
    const userMsg: ChatMessage = { id: crypto.randomUUID(), from: "user", text, ts: Date.now() };
    set({ chat: [...get().chat, userMsg], chatSending: true });
    try {
      const { reply } = await api.postChat(text);
      const aiMsg: ChatMessage = {
        id: crypto.randomUUID(),
        from: "ai",
        text: reply,
        ts: Date.now(),
      };
      set({ chat: [...get().chat, userMsg, aiMsg] });
    } finally {
      set({ chatSending: false });
    }
  },

  setUploadedCsv: (rows) => set({ uploadedCsv: rows }),
}));
