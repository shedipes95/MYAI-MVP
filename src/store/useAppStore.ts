import { create } from "zustand";
import { api } from "@/api/client";
import type {
  Account,
  BudgetData,
  ChatMessage,
  InsuranceProduct,
  Loan,
  SavingsGoal,
} from "@/types";

type User = { email: string } | null;

type State = {
  user: User;

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
  login: (email: string) => void;
  logout: () => void;

  fetchBudget: () => Promise<void>;
  fetchAccounts: () => Promise<void>;
  fetchSavings: () => Promise<void>;
  fetchLoans: () => Promise<void>;
  fetchInsurance: () => Promise<void>;

  sendChat: (text: string) => Promise<void>;

  setUploadedCsv: (rows: Array<Record<string, string>>) => void;
};

const initialState: State = {
  user: null,
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

  login: (email: string) => set({ user: { email } }),
  logout: () => set({ user: null }),

  fetchBudget: async () => {
    set({ budgetLoading: true });
    try { set({ budget: await api.getBudget() }); } finally { set({ budgetLoading: false }); }
  },
  fetchAccounts: async () => {
    set({ accountsLoading: true });
    try { set({ accounts: await api.getAccounts() }); } finally { set({ accountsLoading: false }); }
  },
  fetchSavings: async () => {
    set({ savingsLoading: true });
    try { set({ savings: await api.getSavings() }); } finally { set({ savingsLoading: false }); }
  },
  fetchLoans: async () => {
    set({ loansLoading: true });
    try { set({ loans: await api.getLoans() }); } finally { set({ loansLoading: false }); }
  },
  fetchInsurance: async () => {
    set({ insuranceLoading: true });
    try { set({ insurance: await api.getInsurance() }); } finally { set({ insuranceLoading: false }); }
  },

  sendChat: async (text: string) => {
    const userMsg: ChatMessage = { id: crypto.randomUUID(), from: "user", text, ts: Date.now() };
    set({ chat: [...get().chat, userMsg], chatSending: true });
    try {
      const { reply } = await api.postChat(text);
      const aiMsg: ChatMessage = { id: crypto.randomUUID(), from: "ai", text: reply, ts: Date.now() };
      set({ chat: [...get().chat, userMsg, aiMsg] });
    } finally { set({ chatSending: false }); }
  },

  setUploadedCsv: (rows) => set({ uploadedCsv: rows }),
}));
