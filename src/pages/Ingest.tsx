import {
  AlertTriangle,
  Upload,
  CheckCircle,
  XCircle,
  TrendingUp,
  User,
  Trash2,
} from "lucide-react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import DropZone from "@/components/DropZone";
import StatusAlert from "@/components/StatusAlert";
import CategoryPieChart from "@/components/CategoryPieChart";
import KPICards from "@/components/KPICards";
import SavingsImpactCalculator from "@/components/SavingsImpactCalculator";
import { useAppStore } from "@/store/useAppStore";
import type { ProcessedTransaction } from "@/api/transactions";

export default function Ingest() {
  const {
    transactions,
    transactionsLoading,
    transactionsError,
    transactionKPIs,
    uploadAndProcessTransactions,
    clearTransactionsError,
    clearAllTransactionData,
  } = useAppStore();

  const handleFileUpload = async (file: File) => {
    clearTransactionsError();
    await uploadAndProcessTransactions(file);
  };

  const formatAmount = (amount: string | number) => {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-EU", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
    }).format(Math.abs(num));
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-EU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Upload className="text-blue-600" size={24} />
          <h2 className="text-2xl font-bold text-slate-900">Transaction Processing</h2>
        </div>
        {transactions.length > 0 && (
          <button
            onClick={clearAllTransactionData}
            className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={16} />
            Clear Data
          </button>
        )}
      </div>

      {/* File Upload Section */}
      <Card title="Upload Transaction CSV">
        <div className="space-y-4">
          <div className="text-sm text-slate-600">
            Upload your transaction CSV file to automatically categorize and analyze your spending.
          </div>

          <DropZone
            label="Drag and drop your transaction CSV here"
            onFile={handleFileUpload}
            disabled={transactionsLoading}
          />

          {transactionsLoading && (
            <div className="flex items-center gap-2 text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
              <span>Processing transactions...</span>
            </div>
          )}

          {transactionsError && (
            <StatusAlert tone="error">
              <div className="flex items-center gap-2">
                <XCircle size={16} />
                {transactionsError}
              </div>
            </StatusAlert>
          )}
        </div>
      </Card>

      {/* KPI Cards with Traffic Lights */}
      {transactionKPIs && (
        <KPICards
          totalSpend={transactionKPIs.totalSpend}
          topCategory={transactionKPIs.topCategory}
          transactionCount={transactionKPIs.transactionCount}
          budgetLimit={3000}
        />
      )}

      {/* Category Pie Chart */}
      {transactions.length > 0 && (
        <CategoryPieChart
          data={transactions.map((txn) => ({
            category: txn["Categorisation"] || txn.Category || "Uncategorized",
            amount:
              parseFloat(txn["Debit Amount"] || "0") || Math.abs(parseFloat(txn.Amount || "0")),
          }))}
        />
      )}

      {/* Savings Impact Calculator */}
      {transactionKPIs && transactions.length > 0 && (
        <SavingsImpactCalculator
          totalSpend={transactionKPIs.totalSpend}
          transactions={transactions}
        />
      )}

      {/* Transactions Table */}
      {transactions.length > 0 && (
        <Card title={`Processed Transactions (${transactions.length})`}>
          <div className="overflow-auto rounded-lg border border-slate-200">
            <table className="min-w-full w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-slate-600">
                  <th className="px-3 py-2 font-medium">Date</th>
                  <th className="px-3 py-2 font-medium">Description</th>
                  <th className="px-3 py-2 font-medium">Amount</th>
                  <th className="px-3 py-2 font-medium">Category</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 50).map((transaction, index) => (
                  <tr key={index} className="border-t border-slate-200 hover:bg-blue-25">
                    <td className="px-3 py-2 text-slate-700">
                      {formatDate(
                        transaction["Posted Transactions Date"] || transaction.Date || "",
                      )}
                    </td>
                    <td className="px-3 py-2 text-slate-700">
                      {transaction["Description1"] || transaction.Description || ""}
                    </td>
                    <td className="px-3 py-2 font-medium">
                      {transaction["Debit Amount"] &&
                        parseFloat(transaction["Debit Amount"]) > 0 && (
                          <span className="text-red-600">
                            -{formatAmount(transaction["Debit Amount"])}
                          </span>
                        )}
                      {transaction["Credit Amount"] &&
                        parseFloat(transaction["Credit Amount"]) > 0 && (
                          <span className="text-green-600">
                            +{formatAmount(transaction["Credit Amount"])}
                          </span>
                        )}
                      {!transaction["Debit Amount"] &&
                        !transaction["Credit Amount"] &&
                        transaction.Amount && (
                          <span
                            className={
                              parseFloat(transaction.Amount) < 0 ? "text-red-600" : "text-green-600"
                            }
                          >
                            {parseFloat(transaction.Amount) < 0 ? "-" : "+"}
                            {formatAmount(transaction.Amount)}
                          </span>
                        )}
                    </td>
                    <td className="px-3 py-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {transaction["Categorisation"] || transaction.Category || "Uncategorized"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {transactions.length > 50 && (
              <div className="px-3 py-2 text-sm text-slate-600 bg-slate-50 text-center">
                Showing first 50 transactions of {transactions.length} total
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Empty State */}
      {transactions.length === 0 && !transactionsLoading && !transactionsError && (
        <Card>
          <div className="text-center py-8">
            <Upload className="mx-auto h-12 w-12 text-blue-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No transactions yet</h3>
            <p className="text-slate-600">
              Upload a CSV file to see your transaction data and spending insights.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
