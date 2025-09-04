import { useEffect } from "react";
import Card from "@/components/Card";
import { useAppStore } from "@/store/useAppStore";
import { eur } from "@/utils/format";

export default function Accounts() {
  const { accounts, accountsLoading, fetchAccounts } = useAppStore();

  useEffect(() => {
    if (!accounts.length) fetchAccounts();
  }, [accounts.length, fetchAccounts]);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900">Account Overview</h1>
          <div className="text-sm text-slate-600">
            Last updated •{" "}
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>

        <Card className="gradient-card shadow-lg border-0">
          {accountsLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="text-blue-600 flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                Loading account data…
              </div>
            </div>
          )}
          {!accountsLoading && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-800 mb-6">Your Accounts</h2>
              <div className="grid gap-4">
                {accounts.map((a) => (
                  <div
                    key={a.id}
                    className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                          🏦
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800 text-lg">{a.name}</h3>
                          <p className="text-slate-600 text-sm">Account ending in {a.last4}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-slate-900">{eur(a.balance)}</div>
                        <div className="text-sm text-slate-600">Available Balance</div>
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
