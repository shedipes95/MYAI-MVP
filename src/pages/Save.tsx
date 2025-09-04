import { useEffect } from "react";
import Card from "@/components/Card";
import ProgressBar from "@/components/ProgressBar";
import { useAppStore } from "@/store/useAppStore";
import { eur } from "@/utils/format";

export default function Save() {
  const { savings, savingsLoading, fetchSavings } = useAppStore();

  useEffect(() => {
    if (!savings.length) fetchSavings();
  }, [savings.length, fetchSavings]);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900">Savings Goals</h1>
          <div className="text-sm text-slate-600">
            Track your progress •{" "}
            {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </div>
        </div>

        <Card className="gradient-card shadow-lg border-0">
          {savingsLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="text-blue-600 flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                Loading savings goals…
              </div>
            </div>
          )}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">Your Savings Goals</h2>
            <div className="grid gap-6">
              {savings.map((g) => (
                <div
                  key={g.id}
                  className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white font-bold">
                        💰
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800 text-lg">{g.name}</h3>
                        <p className="text-slate-600 text-sm">
                          {Math.round(g.progress * 100)}% complete
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-slate-900">
                        {eur(g.target * g.progress)} / {eur(g.target)}
                      </div>
                      <div className="text-sm text-slate-600">Target Amount</div>
                    </div>
                  </div>
                  <ProgressBar value={g.progress} />
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
