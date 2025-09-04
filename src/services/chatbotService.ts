/**
 * Smart chatbot service that provides real answers using financial data
 */
import type { ProcessedTransaction } from "@/api/transactions";
import type { BudgetData, Account, SavingsGoal, Loan } from "@/types";

export interface ChatbotContext {
  transactions: ProcessedTransaction[];
  transactionKPIs: {
    totalSpend: number;
    topCategory: string;
    transactionCount: number;
    budgetExceeded: boolean;
  } | null;
  budget: BudgetData | null;
  accounts: Account[];
  savings: SavingsGoal[];
  loans: Loan[];
}

export class FinancialChatbot {
  private context: ChatbotContext;

  constructor(context: ChatbotContext) {
    this.context = context;
  }

  updateContext(context: ChatbotContext) {
    this.context = context;
  }

  async processMessage(message: string): Promise<string> {
    const lowercaseMessage = message.toLowerCase().trim();

    // Demo-specific questions for affluent suburban families
    if (
      this.isAbout(lowercaseMessage, [
        "switch",
        "switching",
        "save",
        "savings",
        "provider",
        "providers",
      ])
    ) {
      return this.handleSwitchingQuestions(lowercaseMessage);
    }

    if (this.isAbout(lowercaseMessage, ["debt", "14k", "credit card", "loan", "apr", "interest"])) {
      return this.handleDebtOptimizationQuestions(lowercaseMessage);
    }

    if (this.isAbout(lowercaseMessage, ["college", "children", "kids", "education", "fund"])) {
      return this.handleCollegeFundQuestions(lowercaseMessage);
    }

    if (this.isAbout(lowercaseMessage, ["family", "optimization", "plan", "thompson"])) {
      return this.handleFamilyOptimizationQuestions(lowercaseMessage);
    }

    // Budget-related questions
    if (this.isAbout(lowercaseMessage, ["budget", "spending", "spent", "expenses"])) {
      return this.handleBudgetQuestions(lowercaseMessage);
    }

    // Transaction-related questions
    if (this.isAbout(lowercaseMessage, ["transaction", "payments", "purchases", "activity"])) {
      return this.handleTransactionQuestions(lowercaseMessage);
    }

    // Account-related questions
    if (this.isAbout(lowercaseMessage, ["account", "balance", "money"])) {
      return this.handleAccountQuestions(lowercaseMessage);
    }

    // Category-related questions
    if (
      this.isAbout(lowercaseMessage, [
        "category",
        "categories",
        "groceries",
        "utilities",
        "mortgage",
      ])
    ) {
      return this.handleCategoryQuestions(lowercaseMessage);
    }

    // Savings-related questions
    if (this.isAbout(lowercaseMessage, ["save", "savings", "goal", "goals"])) {
      return this.handleSavingsQuestions(lowercaseMessage);
    }

    // Loans-related questions
    if (this.isAbout(lowercaseMessage, ["loan", "loans", "debt", "payment", "apr"])) {
      return this.handleLoansQuestions(lowercaseMessage);
    }

    // Time-based questions
    if (this.isAbout(lowercaseMessage, ["month", "week", "day", "recent", "latest"])) {
      return this.handleTimeQuestions(lowercaseMessage);
    }

    // Comparison questions
    if (this.isAbout(lowercaseMessage, ["compare", "vs", "versus", "difference"])) {
      return this.handleComparisonQuestions(lowercaseMessage);
    }

    // Tips and advice
    if (
      this.isAbout(lowercaseMessage, ["tip", "advice", "recommend", "suggest", "help", "improve"])
    ) {
      return this.handleAdviceQuestions(lowercaseMessage);
    }

    // Default response with helpful suggestions
    return this.getDefaultResponse();
  }

  private isAbout(message: string, keywords: string[]): boolean {
    return keywords.some((keyword) => message.includes(keyword));
  }

  private handleBudgetQuestions(message: string): string {
    const { transactionKPIs, budget } = this.context;

    if (!transactionKPIs) {
      return "I don't have any transaction data to analyze yet. Please upload your CSV file first to see your budget insights!";
    }

    if (message.includes("status") || message.includes("current")) {
      const totalSpend = transactionKPIs.totalSpend;
      const budgetStatus = transactionKPIs.budgetExceeded ? "⚠️ over budget" : "✅ within budget";

      return `Your current budget status: You've spent €${totalSpend.toFixed(2)} this month. You're ${budgetStatus}. Your top spending category is ${transactionKPIs.topCategory}.`;
    }

    if (message.includes("exceeded") || message.includes("over")) {
      return transactionKPIs.budgetExceeded
        ? `Yes, you've exceeded your €3,000 monthly budget. You've spent €${transactionKPIs.totalSpend.toFixed(2)} so far.`
        : `No, you're still within your budget. You've spent €${transactionKPIs.totalSpend.toFixed(2)} out of your €3,000 limit.`;
    }

    if (message.includes("left") || message.includes("remaining")) {
      const remaining = Math.max(0, 3000 - transactionKPIs.totalSpend);
      return `You have €${remaining.toFixed(2)} remaining in your budget this month.`;
    }

    return `You've spent €${transactionKPIs.totalSpend.toFixed(2)} this month across ${transactionKPIs.transactionCount} transactions. Your top category is ${transactionKPIs.topCategory}.`;
  }

  private handleTransactionQuestions(message: string): string {
    const { transactions, transactionKPIs } = this.context;

    if (!transactions.length) {
      return "No transaction data available. Upload your CSV file to see your transaction insights!";
    }

    if (message.includes("count") || message.includes("many") || message.includes("number")) {
      return `You have ${transactions.length} transactions in total. Most recent activity shows regular spending on ${transactionKPIs?.topCategory || "various categories"}.`;
    }

    if (message.includes("recent") || message.includes("latest") || message.includes("last")) {
      const recentTransactions = transactions.slice(-5);
      const recentList = recentTransactions
        .map(
          (t) =>
            `• ${t["Description1"] || t.Description} - €${Math.abs(parseFloat(t["Debit Amount"] || t.Amount || "0")).toFixed(2)}`,
        )
        .join("\n");

      return `Your 5 most recent transactions:\n${recentList}`;
    }

    if (message.includes("largest") || message.includes("biggest") || message.includes("highest")) {
      const amounts = transactions
        .map((t) => parseFloat(t["Debit Amount"] || "0"))
        .filter((a) => a > 0);
      const largest = Math.max(...amounts);
      const largestTxn = transactions.find((t) => parseFloat(t["Debit Amount"] || "0") === largest);

      return `Your largest transaction was €${largest.toFixed(2)} for ${largestTxn?.["Description1"] || largestTxn?.Description || "unknown"}.`;
    }

    return `You have ${transactions.length} transactions with total spending of €${transactionKPIs?.totalSpend.toFixed(2) || "0"}. Your most active category is ${transactionKPIs?.topCategory || "unknown"}.`;
  }

  private handleAccountQuestions(message: string): string {
    const { accounts } = this.context;

    if (!accounts.length) {
      return "No account information available yet. Upload your transaction data to see your account balance!";
    }

    if (message.includes("balance") || message.includes("much")) {
      const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
      return `Your current account balance is €${totalBalance.toFixed(2)}. This is across ${accounts.length} account(s).`;
    }

    if (message.includes("account")) {
      const accountList = accounts
        .map((acc) => `• ${acc.name} ending in ${acc.last4}: €${acc.balance.toFixed(2)}`)
        .join("\n");

      return `Your accounts:\n${accountList}`;
    }

    return `You have ${accounts.length} account(s) with a total balance of €${accounts.reduce((sum, acc) => sum + acc.balance, 0).toFixed(2)}.`;
  }

  private handleCategoryQuestions(message: string): string {
    const { transactions, budget } = this.context;

    if (!transactions.length) {
      return "Upload your transactions to see category breakdowns!";
    }

    // Calculate category spending
    const categorySpending: Record<string, number> = {};
    transactions.forEach((txn) => {
      const debitAmount = parseFloat(txn["Debit Amount"] || "0");
      const category = txn["Categorisation"] || txn.Category || "Other";
      if (debitAmount > 0) {
        categorySpending[category] = (categorySpending[category] || 0) + debitAmount;
      }
    });

    const sortedCategories = Object.entries(categorySpending)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    if (message.includes("top") || message.includes("most") || message.includes("highest")) {
      const topCategoriesList = sortedCategories
        .map(([cat, amount]) => `• ${cat}: €${amount.toFixed(2)}`)
        .join("\n");

      return `Your top spending categories:\n${topCategoriesList}`;
    }

    if (message.includes("groceries") || message.includes("food")) {
      const grocerySpending = Object.entries(categorySpending)
        .filter(
          ([cat]) =>
            cat.toLowerCase().includes("grocer") || cat.toLowerCase().includes("supermarket"),
        )
        .reduce((sum, [, amount]) => sum + amount, 0);

      return grocerySpending > 0
        ? `You spent €${grocerySpending.toFixed(2)} on groceries this month.`
        : "No grocery spending found in your transactions.";
    }

    const topCategory = sortedCategories[0];
    return `Your highest spending category is ${topCategory[0]} with €${topCategory[1].toFixed(2)} spent.`;
  }

  private handleSavingsQuestions(message: string): string {
    const { savings } = this.context;

    if (!savings.length) {
      return "You don't have any active savings goals set up yet. Consider creating some savings targets to track your progress!";
    }

    const totalTargets = savings.reduce((sum, goal) => sum + goal.target, 0);
    const totalSaved = savings.reduce((sum, goal) => sum + goal.target * goal.progress, 0);
    const progressList = savings
      .map(
        (goal) =>
          `• ${goal.name}: ${Math.round(goal.progress * 100)}% complete (€${(goal.target * goal.progress).toFixed(2)} / €${goal.target.toFixed(2)})`,
      )
      .join("\n");

    if (message.includes("progress") || message.includes("how")) {
      return `Your savings progress:\n${progressList}\n\nTotal saved: €${totalSaved.toFixed(2)} of €${totalTargets.toFixed(2)} target.`;
    }

    if (message.includes("goal") || message.includes("target")) {
      return `You have ${savings.length} savings goal(s) with a total target of €${totalTargets.toFixed(2)}. You've saved €${totalSaved.toFixed(2)} so far (${Math.round((totalSaved / totalTargets) * 100)}%).`;
    }

    return `You're doing great with savings! ${Math.round((totalSaved / totalTargets) * 100)}% progress across ${savings.length} goals.`;
  }

  private handleLoansQuestions(message: string): string {
    const { loans } = this.context;

    if (!loans.length) {
      return "You don't have any active loans in the system. That's great for your financial health! 🎉";
    }

    const totalMonthlyPayments = loans.reduce((sum, loan) => sum + loan.monthlyPayment, 0);
    const avgAPR = loans.reduce((sum, loan) => sum + loan.apr, 0) / loans.length;

    if (message.includes("payment") || message.includes("monthly")) {
      const loanList = loans
        .map((loan) => `• ${loan.name}: €${loan.monthlyPayment.toFixed(2)} (${loan.apr}% APR)`)
        .join("\n");

      return `Your monthly loan payments:\n${loanList}\n\nTotal monthly: €${totalMonthlyPayments.toFixed(2)}`;
    }

    if (message.includes("apr") || message.includes("rate") || message.includes("interest")) {
      return `Your average loan APR is ${avgAPR.toFixed(1)}%. Total monthly payments: €${totalMonthlyPayments.toFixed(2)}.`;
    }

    return `You have ${loans.length} active loan(s) with total monthly payments of €${totalMonthlyPayments.toFixed(2)}.`;
  }

  private handleTimeQuestions(message: string): string {
    const { transactions } = this.context;

    if (!transactions.length) {
      return "Upload your transactions to see time-based insights!";
    }

    // For this demo, we'll use the transaction data as-is
    // In a real app, you'd parse dates and group by time periods

    if (message.includes("month") || message.includes("monthly")) {
      const totalSpent = transactions.reduce((sum, txn) => {
        const debit = parseFloat(txn["Debit Amount"] || "0");
        return sum + debit;
      }, 0);

      return `This month you've spent €${totalSpent.toFixed(2)} across ${transactions.length} transactions.`;
    }

    if (message.includes("week") || message.includes("weekly")) {
      // Estimate weekly average
      const totalSpent = transactions.reduce((sum, txn) => {
        const debit = parseFloat(txn["Debit Amount"] || "0");
        return sum + debit;
      }, 0);
      const weeklyAvg = totalSpent / 4; // Rough monthly to weekly conversion

      return `Your average weekly spending is approximately €${weeklyAvg.toFixed(2)}.`;
    }

    return "I can help you analyze spending patterns by month or week. What specific time period are you interested in?";
  }

  private handleComparisonQuestions(message: string): string {
    return "I can help you compare spending categories, monthly budgets, or account balances. What would you like to compare?";
  }

  private handleAdviceQuestions(message: string): string {
    const { transactionKPIs, budget } = this.context;

    if (!transactionKPIs) {
      return "Upload your transaction data first, and I'll provide personalized financial advice based on your spending patterns!";
    }

    const advice = [];

    if (transactionKPIs.budgetExceeded) {
      advice.push(
        "💡 You're over budget this month. Consider reviewing your top spending category: " +
          transactionKPIs.topCategory,
      );
    }

    if (transactionKPIs.totalSpend > 2500) {
      advice.push(
        "💰 Your spending is quite high. Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings.",
      );
    }

    advice.push("📊 Track your spending weekly to stay on top of your budget.");
    advice.push("🎯 Set specific savings goals to build your emergency fund.");

    if (message.includes("save") || message.includes("saving")) {
      return "💰 Top savings tips:\n• Automate your savings\n• Track small expenses\n• Use the 24-hour rule before big purchases\n• Review subscriptions monthly";
    }

    return advice.length > 0
      ? advice.join("\n\n")
      : "Keep up the good work! Your finances look healthy. 🌟";
  }

  private handleSwitchingQuestions(message: string): string {
    return `🎯 **MyAI Switching Analysis for Your Family:**

💰 **Total Annual Savings: €2,960**

**High Priority Switches:**
• Credit Card Debt → Personal Loan: Save €1,820/year
  - Convert €14K debt from 17.5% APR to 4.5% APR
  - Reduces monthly interest from €204 to €53

• Electricity Provider: Save €720/year  
  - Switch from €200/month to €140/month
  - Same service, 30% cost reduction

**Medium Priority Switches:**
• Home Insurance: Save €240/year (€110→€90/month)
• Car Insurance: Save €180/year (€100→€85/month for 2 vehicles)

**Impact on College Fund:**
With €2,960 in annual savings, you could fund:
• Child 1 (age 14): €11,840 over 4 years
• Child 2 (age 16): €5,920 over 2 years

Would you like me to prioritize these switches or explain the switching process?`;
  }

  private handleDebtOptimizationQuestions(message: string): string {
    return `💳 **Debt Optimization Strategy for €14K Credit Card Debt:**

**Current Situation:**
• Debt: €14,000 at 17.5% APR
• Monthly interest: €204
• Annual interest cost: €2,450

**MyAI Recommendation: Personal Loan Conversion**
• New APR: 4.5% (vs current 17.5%)
• Monthly interest: €53 (vs €204)
• **Annual savings: €1,820**

**Additional Strategy:**
• Apply for new credit card at 11.4% APR for future purchases
• Use savings to build emergency fund
• Set up automatic payments to avoid future debt

**Timeline:**
• Week 1: Apply for personal loan
• Week 2-3: Loan approval & pay off credit card
• Month 2: Start saving €151/month in interest

This single switch saves you more than most families' monthly grocery budget! 

Want me to explain the application process or calculate payoff scenarios?`;
  }

  private handleCollegeFundQuestions(message: string): string {
    return `🎓 **College Fund Strategy for Thompson Family:**

**Current Situation:**
• Child 1: Age 14 (4 years until college)
• Child 2: Age 16 (2 years until college)
• Combined income: €173,000
• Available from switching savings: €2,960/year

**College Fund Projections:**

**Option 1: Use Switching Savings Only**
• Child 1: €11,840 (4 years × €2,960)
• Child 2: €5,920 (2 years × €2,960)

**Option 2: Enhanced Strategy**
• Reduce discretionary spending by 40% 
• Additional €500/month = €6,000/year
• Total available: €8,960/year
• Child 1: €35,840 over 4 years
• Child 2: €17,920 over 2 years

**Option 3: Investment Growth**
• Invest in education savings account (4% growth)
• Child 1: €40,000+ with compound interest
• Child 2: €19,000+ with growth

**Recommendation:** Start with switching savings immediately, then add discretionary spending reduction once switches are complete.

Would you like specific investment recommendations or help setting up automatic transfers?`;
  }

  private handleFamilyOptimizationQuestions(message: string): string {
    return `👨‍👩‍👧‍👦 **Complete Thompson Family Financial Optimization Plan:**

**Phase 1: Immediate Switches (Month 1-3)**
1. Convert credit card debt to personal loan (-€1,820/year)
2. Switch electricity provider (-€720/year)
3. Review insurance providers (-€420/year combined)
**Phase 1 Savings: €2,960/year**

**Phase 2: Behavioral Changes (Month 4-6)**
1. Reduce discretionary spending by 40%
2. Start pension contributions (€1,000/month both adults)
3. Implement weekly budget reviews
**Additional Savings: €6,000+/year**

**Phase 3: Long-term Growth (Month 7+)**
1. College fund investments with compound growth
2. Emergency fund building (6 months expenses)
3. Property/investment opportunities

**Monthly Cash Flow Improvement:**
• Interest savings: €151/month
• Utility savings: €60/month  
• Insurance savings: €35/month
• **Total: €246/month extra cash flow**

**Annual Impact:**
• Total savings: €8,960+
• College funds fully funded
• Retirement contributions on track
• Emergency fund established

**MyAI monitors all this automatically and alerts you to new switching opportunities!**

Ready to start with Phase 1 switches?`;
  }

  private getDefaultResponse(): string {
    return `I'm your MyAI assistant! I specialize in helping affluent suburban families optimize their finances through smart switching and planning.

🎯 **I can help you with:**
• Switching analysis (insurance, utilities, loans)
• College fund planning for your children
• Debt optimization strategies  
• Family budget optimization
• Provider comparison and recommendations

💡 **Try asking:**
• "How much can I save by switching providers?"
• "What's the best way to pay off my €14K debt?"
• "How should I budget for my children's college?"
• "Show me my family's financial optimization plan"

Based on the Thompson family profile, I can show you how to save €2,960+ annually through smart switches alone!

What would you like to optimize first?`;
  }
}

// Predefined smart questions users can click
export const PREDEFINED_QUESTIONS = [
  "What's my current budget status?",
  "Show me my recent transactions",
  "What's my top spending category?",
  "How much is my account balance?",
  "What are my monthly loan payments?",
  "Give me some financial advice",
  "How much did I spend on groceries?",
  "Am I over budget this month?",
];
