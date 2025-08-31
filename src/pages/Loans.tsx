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
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-purple-900">Loans</h2>
      <Card>
        {loansLoading && <div className="text-sm text-purple-500">Loading loans…</div>}
        {!loansLoading && (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-purple-600">
                <th className="py-2">Name</th>
                <th className="py-2">APR</th>
                <th className="py-2 text-right">Monthly</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((l) => (
                <tr key={l.id} className="border-t border-purple-200">
                  <td className="py-2 text-purple-800">{l.name}</td>
                  <td className="py-2 text-purple-600">{l.apr}%</td>
                  <td className="py-2 text-right font-medium text-purple-800">
                    {eur(l.monthlyPayment)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
