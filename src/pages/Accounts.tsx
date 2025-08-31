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
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Accounts</h2>
      <Card>
        {accountsLoading && <div className="text-sm text-gray-500">Loading accounts…</div>}
        {!accountsLoading && (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="py-2">Name</th>
                <th className="py-2">Last 4</th>
                <th className="py-2 text-right">Balance</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((a) => (
                <tr key={a.id} className="border-t">
                  <td className="py-2">{a.name}</td>
                  <td className="py-2">{a.last4}</td>
                  <td className="py-2 text-right font-medium">{eur(a.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
