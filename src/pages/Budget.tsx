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
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-purple-900">Budget</h2>
      <Card title="Budget spent (month)">
        {budgetLoading && <div className="text-sm text-purple-500">Loading budget…</div>}
        {budget && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-purple-600">
                {eur(budget.totalSpent)} / {eur(budget.totalLimit)}
              </div>
              <div className="text-sm text-purple-600">{Math.round((totalPct || 0) * 100)}%</div>
            </div>
            <ProgressBar value={totalPct} />

            <div className="mt-4 space-y-2">
              {budget.categories.map((c) => {
                const v = c.limit > 0 ? c.spent / c.limit : 0;
                return (
                  <div key={c.name} className="grid grid-cols-5 items-center gap-2 text-sm">
                    <div className="col-span-2 font-medium text-purple-800">{c.name}</div>
                    <div className="col-span-2 text-purple-600">
                      {eur(c.spent)} / {eur(c.limit)}
                    </div>
                    <div>
                      <span className="rounded-md bg-purple-100 px-2 py-0.5 text-xs text-purple-700">
                        {Math.round(v * 100)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
