import React from "react";
import { TrendingUp, Target, AlertCircle, CheckCircle, XCircle } from "lucide-react";

interface KPICardsProps {
  totalSpend: number;
  topCategory: string;
  transactionCount: number;
  budgetLimit?: number;
}

export default function KPICards({
  totalSpend,
  topCategory,
  transactionCount,
  budgetLimit = 3000,
}: KPICardsProps) {
  // Calculate budget status
  const budgetPercentage = (totalSpend / budgetLimit) * 100;

  const getBudgetStatus = () => {
    if (budgetPercentage < 70) {
      return {
        status: "Good",
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        icon: CheckCircle,
        iconColor: "text-green-500",
      };
    } else if (budgetPercentage <= 100) {
      return {
        status: "Warning",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        icon: AlertCircle,
        iconColor: "text-yellow-500",
      };
    } else {
      return {
        status: "Over Budget",
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        icon: XCircle,
        iconColor: "text-red-500",
      };
    }
  };

  const budgetStatus = getBudgetStatus();
  const StatusIcon = budgetStatus.icon;

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-EU", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {/* Total Spend Card */}
      <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-600">Total Spend</h3>
            <p className="text-2xl font-bold text-slate-900">{formatAmount(totalSpend)}</p>
          </div>
        </div>
        <div className="text-xs text-slate-500">Based on {transactionCount} transactions</div>
      </div>

      {/* Top Category Card */}
      <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-600">Top Category</h3>
            <p className="text-lg font-semibold text-slate-900 truncate">{topCategory}</p>
          </div>
        </div>
        <div className="text-xs text-slate-500">Highest spending category</div>
      </div>

      {/* Budget Status Card with Traffic Light */}
      <div
        className={`rounded-xl p-4 sm:p-6 border shadow-sm ${budgetStatus.bgColor} ${budgetStatus.borderColor}`}
      >
        <div className="flex items-center gap-3 mb-2">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${budgetStatus.bgColor}`}
          >
            <StatusIcon className={`w-5 h-5 ${budgetStatus.iconColor}`} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-600">Budget Status</h3>
            <p className={`text-lg font-semibold ${budgetStatus.color}`}>{budgetStatus.status}</p>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-600">
            {budgetPercentage.toFixed(0)}% of €{budgetLimit.toLocaleString()}
          </span>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <div
              className={`w-2 h-2 rounded-full ${budgetPercentage >= 70 ? "bg-yellow-400" : "bg-slate-200"}`}
            ></div>
            <div
              className={`w-2 h-2 rounded-full ${budgetPercentage > 100 ? "bg-red-400" : "bg-slate-200"}`}
            ></div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                budgetPercentage < 70
                  ? "bg-green-400"
                  : budgetPercentage <= 100
                    ? "bg-yellow-400"
                    : "bg-red-400"
              }`}
              style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
