import { create } from "zustand";
import { api } from "@/api/client";
import { processTransactions, calculateKPIs, type ProcessedTransaction } from "@/api/transactions";
import { parseCSV } from "@/utils/csv";
import { FinancialChatbot, PREDEFINED_QUESTIONS } from "@/services/chatbotService";
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
  chatbot: FinancialChatbot | null;

  uploadedCsv: Array<Record<string, string>>;

  // Transaction processing
  transactions: ProcessedTransaction[];
  transactionsLoading: boolean;
  transactionsError: string | null;
  transactionKPIs: {
    totalSpend: number;
    topCategory: string;
    transactionCount: number;
    budgetExceeded: boolean;
  } | null;
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
  clearChatHistory: () => void;

  setUploadedCsv: (rows: Array<Record<string, string>>) => void;

  // Transaction processing actions
  uploadAndProcessTransactions: (file: File) => Promise<void>;
  clearTransactionsError: () => void;
  clearAllTransactionData: () => void;
  updateBudgetFromTransactions: (transactions: ProcessedTransaction[]) => void;
  updateAccountsFromTransactions: (transactions: ProcessedTransaction[]) => void;
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
  chatbot: null,
  uploadedCsv: [],

  // Transaction processing
  transactions: [],
  transactionsLoading: false,
  transactionsError: null,
  transactionKPIs: null,
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

      set({
        user,
        authLoading: false,
        // Clear chat messages on successful login for privacy
        chat: [],
        chatbot: null,
      });
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

      set({
        user,
        authLoading: false,
        // Clear chat messages on successful signup for privacy
        chat: [],
        chatbot: null,
      });
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

  logout: () =>
    set({
      user: null,
      authError: null,
      // Clear all user data on logout
      chat: [],
      chatbot: null,
      transactions: [],
      transactionKPIs: null,
      transactionsError: null,
      transactionsLoading: false,
    }),

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
    const state = get();

    // Prevent duplicate calls if already sending
    if (state.chatSending) {
      return;
    }

    // Prevent duplicate messages
    const lastMessage = state.chat[state.chat.length - 1];
    if (lastMessage && lastMessage.from === "user" && lastMessage.text === text) {
      return;
    }

    const userMsg: ChatMessage = { id: crypto.randomUUID(), from: "user", text, ts: Date.now() };

    // Set sending state and add user message immediately
    set({ chat: [...state.chat, userMsg], chatSending: true });

    try {
      // Initialize chatbot if not exists
      let chatbot = state.chatbot;
      if (!chatbot) {
        chatbot = new FinancialChatbot({
          transactions: state.transactions,
          transactionKPIs: state.transactionKPIs,
          budget: state.budget,
          accounts: state.accounts,
          savings: state.savings,
          loans: state.loans,
        });
        set({ chatbot });
      }

      // Update chatbot context with latest data
      chatbot.updateContext({
        transactions: state.transactions,
        transactionKPIs: state.transactionKPIs,
        budget: state.budget,
        accounts: state.accounts,
        savings: state.savings,
        loans: state.loans,
      });

      const reply =
        (await chatbot.processMessage(text)) ||
        "I'm having trouble processing that request. Please try again.";

      const aiMsg: ChatMessage = {
        id: crypto.randomUUID(),
        from: "ai",
        text: reply,
        ts: Date.now(),
      };

      // Get fresh state and add AI message
      const currentState = get();
      set({ chat: [...currentState.chat, aiMsg] });
    } catch (error) {
      console.error("Chat error:", error);
      const errorMsg: ChatMessage = {
        id: crypto.randomUUID(),
        from: "ai",
        text: "Sorry, I encountered an error. Please try again.",
        ts: Date.now(),
      };

      const currentState = get();
      set({ chat: [...currentState.chat, errorMsg] });
    } finally {
      set({ chatSending: false });
    }
  },

  clearChatHistory: () => set({ chat: [], chatbot: null }),

  setUploadedCsv: (rows) => set({ uploadedCsv: rows }),

  // Transaction processing actions
  uploadAndProcessTransactions: async (file: File) => {
    set({ transactionsLoading: true, transactionsError: null });
    try {
      // Try API first
      const transactions = await processTransactions(file);
      const kpis = calculateKPIs(transactions);

      set({
        transactions,
        transactionKPIs: kpis,
        transactionsLoading: false,
        transactionsError: null,
      });

      // Auto-update other pages with transaction data
      get().updateBudgetFromTransactions(transactions);
      get().updateAccountsFromTransactions(transactions);

      // Reset chatbot to pick up new data
      set({ chatbot: null });
    } catch (error) {
      // Fallback to local CSV processing when API fails
      try {
        const text = await file.text();
        const rows = parseCSV(text);

        // Convert to ProcessedTransaction format
        const transactions: ProcessedTransaction[] = rows.map((row) => ({
          "Posted Account": row["Posted Account"] || "",
          "Posted Transactions Date": row["Posted Transactions Date"] || row.Date || row.date || "",
          Description1: row["Description1"] || row.Description || row.description || "",
          "Debit Amount":
            row["Debit Amount"] ||
            (parseFloat(row.Amount || "0") < 0
              ? Math.abs(parseFloat(row.Amount || "0")).toString()
              : ""),
          "Credit Amount":
            row["Credit Amount"] || (parseFloat(row.Amount || "0") > 0 ? row.Amount : ""),
          Balance: row["Balance"] || "",
          Categorisation: row["Categorisation"] || row.Category || row.category || "Uncategorized",
          // Keep fallback fields for compatibility
          Date: row["Posted Transactions Date"] || row.Date || row.date || "",
          Description: row["Description1"] || row.Description || row.description || "",
          Amount:
            row.Amount ||
            row.amount ||
            (row["Debit Amount"] ? `-${row["Debit Amount"]}` : row["Credit Amount"] || ""),
          Category: row["Categorisation"] || row.Category || row.category || "Uncategorized",
        }));

        const kpis = calculateKPIs(transactions);

        set({
          transactions,
          transactionKPIs: kpis,
          transactionsLoading: false,
          transactionsError: null,
        });

        // Auto-update other pages with transaction data
        get().updateBudgetFromTransactions(transactions);
        get().updateAccountsFromTransactions(transactions);

        // Reset chatbot to pick up new data
        set({ chatbot: null });
      } catch (fallbackError) {
        set({
          transactionsError: `Failed to process file: ${fallbackError instanceof Error ? fallbackError.message : "Unknown error"}`,
          transactionsLoading: false,
        });
      }
    }
  },

  clearTransactionsError: () => set({ transactionsError: null }),

  clearAllTransactionData: () => {
    set({
      transactions: [],
      transactionKPIs: null,
      transactionsError: null,
      transactionsLoading: false,
    });
  },

  updateBudgetFromTransactions: (transactions: ProcessedTransaction[]) => {
    // Calculate category spending from transactions
    const categorySpending: Record<string, number> = {};
    let totalSpent = 0;

    transactions.forEach((txn) => {
      const debitAmount = parseFloat(txn["Debit Amount"] || "0");
      const fallbackAmount = parseFloat(txn.Amount || "0");
      const category = txn["Categorisation"] || txn.Category || "Other";

      const spendAmount =
        debitAmount > 0 ? debitAmount : fallbackAmount < 0 ? Math.abs(fallbackAmount) : 0;

      if (spendAmount > 0) {
        totalSpent += spendAmount;
        categorySpending[category] = (categorySpending[category] || 0) + spendAmount;
      }
    });

    // Create budget data from transactions
    const categories = Object.entries(categorySpending).map(([name, spent]) => ({
      name,
      spent,
      limit: spent * 1.2, // Set limit 20% above current spending
    }));

    const budget: BudgetData = {
      totalSpent,
      totalLimit: totalSpent * 1.2, // Set total limit 20% above current spending
      categories,
    };

    set({ budget });
  },

  updateAccountsFromTransactions: (transactions: ProcessedTransaction[]) => {
    // Extract unique account from transactions
    const accountNumber = transactions[0]?.["Posted Account"]?.split(" - ")[0] || "Unknown";

    // Calculate final balance from the last transaction
    let finalBalance = 0;
    if (transactions.length > 0) {
      const lastTransaction = transactions[transactions.length - 1];
      finalBalance = parseFloat(lastTransaction["Balance"] || "0");
    }

    const accounts: Account[] = [
      {
        id: crypto.randomUUID(),
        name: "Current Account",
        last4: accountNumber.slice(-4),
        balance: finalBalance,
      },
    ];

    set({ accounts });
  },
}));
