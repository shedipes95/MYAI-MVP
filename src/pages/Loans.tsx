import { useEffect } from "react";
import Card from "@/components/Card";
import { useAppStore } from "@/store/useAppStore";
import { eur } from "@/utils/format";

export default function Loans() {
  const { loans, loansLoading, fetchLoans } = useAppStore();

  useEffect(() => {
    if (!loans.length) fetchLoans();
  }, [loans.length, fetchLoans]);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900">Loans & Credit</h1>
          <div className="text-sm text-slate-600">
            Active loans •{" "}
            {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </div>
        </div>

        <Card className="gradient-card shadow-lg border-0">
          {loansLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="text-blue-600 flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                Loading loan information…
              </div>
            </div>
          )}
          {!loansLoading && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-6">Your Loans</h2>
              <div className="grid gap-4">
                {loans.map((l) => (
                  <div
                    key={l.id}
                    className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                          💳
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800 text-lg">{l.name}</h3>
                          <p className="text-slate-600 text-sm">APR: {l.apr}%</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-slate-900">
                          {eur(l.monthlyPayment)}
                        </div>
                        <div className="text-sm text-slate-600">Monthly Payment</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
