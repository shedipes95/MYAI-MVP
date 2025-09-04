import { useEffect } from "react";
import Card from "@/components/Card";
import ProgressBar from "@/components/ProgressBar";
import { useAppStore } from "@/store/useAppStore";
import { eur } from "@/utils/format";

export default function Budget() {
  const { budget, budgetLoading, fetchBudget } = useAppStore();

  useEffect(() => {
    if (!budget) fetchBudget();
  }, [budget, fetchBudget]);

  const totalPct = budget && budget.totalLimit > 0 ? budget.totalSpent / budget.totalLimit : 0;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900">Budget Overview</h1>
          <div className="text-sm text-slate-600">
            Current Month •{" "}
            {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </div>
        </div>

        <Card title="Monthly Budget Summary" className="gradient-card shadow-lg border-0">
          {budgetLoading && <div className="text-sm text-blue-600">Loading budget data…</div>}
          {budget && (
            <div className="space-y-6">
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-lg font-semibold text-slate-800">
                    {eur(budget.totalSpent)} / {eur(budget.totalLimit)}
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round((totalPct || 0) * 100)}%
                  </div>
                </div>
                <ProgressBar value={totalPct} />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Category Breakdown</h3>
                {budget.categories.map((c) => {
                  const v = c.limit > 0 ? c.spent / c.limit : 0;
                  return (
                    <div
                      key={c.name}
                      className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-slate-800">{c.name}</div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-600">
                            {eur(c.spent)} / {eur(c.limit)}
                          </span>
                          <span className="rounded-lg bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                            {Math.round(v * 100)}%
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(v * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
